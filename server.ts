import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import AgentRouter from './scripts/router.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Initialize Google GenAI client according to AI Studio guidelines
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Helper to load skills into memory
function loadRegistry() {
  const manifestPath = path.resolve(process.cwd(), '.agents/manifest.json');
  if (!fs.existsSync(manifestPath)) return [];

  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
  const skillsList: any[] = [];

  for (const deptId of Object.keys(manifest.departments)) {
    const dept = manifest.departments[deptId];
    for (const [skillId, relPath] of Object.entries<string>(dept.skills)) {
      const fullPath = path.resolve(process.cwd(), '.agents', relPath);
      let content = '';
      let triggers: string[] = [];
      let description = '';
      let skillClass = dept.class || 'producer';

      if (fs.existsSync(fullPath)) {
        content = fs.readFileSync(fullPath, 'utf-8');
        // Extract frontmatter
        const fmMatch = content.match(/^---\s*([\s\S]*?)\s*---/);
        if (fmMatch) {
          const fm = fmMatch[1];
          const classMatch = fm.match(/class:\s*([^\n\r]+)/);
          if (classMatch) skillClass = classMatch[1].trim();

          const descMatch = fm.match(/description:\s*([^\n\r]+)/);
          if (descMatch) description = descMatch[1].trim();

          const trigMatch = fm.match(/triggers:\s*\[([^\]]*)\]/);
          if (trigMatch) {
            triggers = trigMatch[1].split(',').map((s: string) => s.trim().replace(/['"]/g, ''));
          }
        }
      }

      skillsList.push({
        id: skillId,
        name: `${deptId}:${skillId}`,
        department: deptId,
        deptName: dept.name,
        deptDesc: dept.description,
        class: skillClass,
        description: description || dept.description,
        triggers,
        path: relPath,
        content,
      });
    }
  }

  return skillsList;
}

// 1. API: Get Manifest & Registered Skills
app.get('/api/agents/manifest', (req, res) => {
  try {
    const manifestPath = path.resolve(process.cwd(), '.agents/manifest.json');
    if (!fs.existsSync(manifestPath)) {
      return res.status(404).json({ error: 'Manifest file not found' });
    }
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
    const skills = loadRegistry();
    return res.json({ manifest, skills });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// 2. API: Dynamic Intent Router Match
app.post('/api/router/match', (req, res) => {
  try {
    const { prompt } = req.body;
    const skills = loadRegistry();
    const router = new AgentRouter(skills);
    const routingResult = router.route(prompt || '');
    return res.json({ result: routingResult });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// 3. API: Validate Skills
app.get('/api/skills/validate', (req, res) => {
  try {
    const skills = loadRegistry();
    const errors: string[] = [];
    for (const skill of skills) {
      if (!skill.content || !skill.content.startsWith('---')) {
        errors.push(`Skill ${skill.name} has invalid YAML frontmatter`);
      }
      if (!skill.content.includes('## Objective')) {
        errors.push(`Skill ${skill.name} missing Objective section`);
      }
    }
    return res.json({
      valid: errors.length === 0,
      totalSkills: skills.length,
      errors,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// 4. API: Execute Full Autonomous Pipeline (Router -> Producer -> Reviewer -> Final Artifact)
app.post('/api/agents/execute', async (req, res) => {
  try {
    const { prompt, forcedSkill, requireReview = true, strictAudit = true } = req.body;

    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Valid prompt is required' });
    }

    const skills = loadRegistry();
    const router = new AgentRouter(skills);

    // 1. Router Phase
    let routeDecision: any;
    if (forcedSkill) {
      const found = skills.find(s => s.name === forcedSkill || s.id === forcedSkill);
      routeDecision = {
        department: found ? found.department : 'technology',
        skill: forcedSkill,
        class: found ? found.class : 'producer',
        confidence: 1.0,
        reason: 'Manually designated by operator override',
        matchedTriggers: ['manual:override'],
      };
    } else {
      routeDecision = router.route(prompt);
    }

    const selectedSkill = skills.find(s => s.name === routeDecision.skill) || skills[0];

    // Check Gemini API key
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: 'GEMINI_API_KEY is not configured in environment secrets.',
      });
    }

    // 2. Producer Phase: Generate output according to skill specifications & isolated write surface
    const producerSystemInstruction = `You are a high-level autonomous agent operating in the "${selectedSkill.deptName}" within Sol Autonomous Agent OS.
You are executing the canonical skill: "${selectedSkill.name}" (Class: ${selectedSkill.class}).

Below is your strict skill operational specification:
---
${selectedSkill.content}
---

CRITICAL OPERATIONAL RULES:
- Operate strictly within your isolated write surface.
- Obey all formatting guidelines (OpenAPI 3.1, PostGIS SQL, Unit Economics formulas, etc.).
- Produce production-grade, immediately usable deliverables without filler talk or superficial placeholders.
- If the user prompt is in Arabic, provide explanations and schemas with professional Arabic and standard English technical terms.
- Provide the deliverables marked under 'Mandatory Deliverable' in your skill specification.`;

    const producerResponse = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: producerSystemInstruction,
        temperature: 0.3,
      },
    });

    const producerOutput = producerResponse.text || 'No output generated from producer agent.';

    // 3. Reviewer Phase: Audit and Veto Gate (Reviewer-Class Protocol)
    let reviewerOutput = null;
    let auditVerdict = 'APPROVED';
    let severityLevel = 'NONE';
    let issues: string[] = [];

    if (requireReview) {
      const securitySkill = skills.find(s => s.name === 'security:security-audit');
      const reviewerSystemInstruction = `You are the Lead Cybersecurity & Protocol Auditor (Reviewer Class) for Sol Autonomous Agent OS.
You hold absolute VETO authority over producer outputs before production release.

Your task:
Review the following artifact produced by agent "${selectedSkill.name}" in response to prompt: "${prompt}".

Examine against:
1. Input sanitization, SQL/PostGIS injection risks, and parameterization.
2. Authentication, JWT, and authorization controls.
3. Information leaks, secrets, and wildcard CORS.
4. Architectural soundness, performance bottlenecks, and compliance.

Audit Rules:
- If you find ANY critical or high vulnerability, you MUST issue STATUS: REJECTED.
- If the design is sound, safe, and adheres to standards, issue STATUS: APPROVED.
- Your review MUST conclude with:
### SECURITY AUDIT VERDICT
STATUS: [APPROVED or REJECTED]
SEVERITY_LEVEL: [CRITICAL, HIGH, MEDIUM, LOW, or NONE]
ISSUES:
- [Issue 1 if any]
REMEDIATION:
- [Fix 1 if any]`;

      const reviewerResponse = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `PRODUCER AGENT DELIVERABLE TO AUDIT:
${producerOutput}`,
        config: {
          systemInstruction: reviewerSystemInstruction,
          temperature: 0.2,
        },
      });

      reviewerOutput = reviewerResponse.text || '';

      if (reviewerOutput.includes('STATUS: REJECTED')) {
        auditVerdict = 'REJECTED';
        if (reviewerOutput.includes('CRITICAL')) severityLevel = 'CRITICAL';
        else if (reviewerOutput.includes('HIGH')) severityLevel = 'HIGH';
        else severityLevel = 'MEDIUM';
      } else {
        auditVerdict = 'APPROVED';
        severityLevel = 'NONE';
      }
    }

    return res.json({
      success: true,
      executionId: `exec-${Date.now().toString(36)}`,
      timestamp: new Date().toISOString(),
      prompt,
      routing: routeDecision,
      skillMetadata: {
        name: selectedSkill.name,
        department: selectedSkill.department,
        class: selectedSkill.class,
        description: selectedSkill.description,
      },
      pipeline: {
        router: {
          status: 'SUCCESS',
          decision: routeDecision,
        },
        producer: {
          agent: selectedSkill.name,
          status: 'COMPLETED',
          output: producerOutput,
        },
        reviewer: requireReview
          ? {
              agent: 'security:security-audit',
              status: auditVerdict,
              verdict: auditVerdict,
              severity: severityLevel,
              auditLog: reviewerOutput,
            }
          : null,
      },
    });
  } catch (err: any) {
    console.error('Pipeline execution error:', err);
    return res.status(500).json({ error: err.message || 'Execution error' });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV === 'production' && fs.existsSync(path.resolve(process.cwd(), 'dist'))) {
    app.use(express.static(path.resolve(process.cwd(), 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(process.cwd(), 'dist/index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Sol Autonomous Agent OS server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
