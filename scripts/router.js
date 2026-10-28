/**
 * Agent Organization Router Engine
 * Decodes user intent and routes execution to the correct department skill.
 * Supports bilingual Arabic & English semantic keyword matching.
 */

class AgentRouter {
  constructor(registry = []) {
    this.registry = registry;
  }

  // Pre-configured bilingual mapping dictionaries
  static ARABIC_MAPPINGS = {
    // Technology
    'api': ['واجهة', 'خدمة', 'اندبوينت', 'رست', 'برمجة', 'كود', 'تطوير', 'باك اند', 'سيرفر', 'openapi', 'rest', 'endpoints'],
    'architecture': ['معمارية', 'نظام', 'مايكروسيرفيس', 'بنية', 'تصميم النظام', 'سحابي'],
    // Security
    'security': ['أمن', 'حماية', 'ثغرة', 'تدقيق', 'سيبراني', 'اختراق', 'تشفير', 'jwt', 'توكن', 'صلاحيات', 'owasp'],
    // IoT & Geospatial
    'geospatial': ['مكاني', 'خرائط', 'احداثيات', 'جي بي اس', 'تتبع', 'موقع', 'جغرافي', 'postgis', 'gis', 'شاحنة', 'مركبة', 'اسطول', 'حساسات', 'انترنت الاشياء', 'iot', 'تيليميتري'],
    // Operations & Finance
    'finance': ['تكلفة', 'تسعير', 'هامش', 'ربح', 'نقطة التعادل', 'مالي', 'جدوى', 'سعر', 'اقتصاديات', 'ريال', 'دولار', 'مصاريف'],
    // Executive
    'executive': ['استراتيجية', 'رئيس', 'تنفيذي', 'قرار', 'استثمار', 'تمويل', 'عرض', 'فكرة', 'اختناق', 'نمو'],
    // Growth
    'marketing': ['صفحة هبوط', 'تحويل', 'تسويق', 'اعلان', 'عملاء', 'مبيعات', 'cro', 'cta', 'جمهور']
  };

  route(userPrompt) {
    if (!userPrompt || !userPrompt.trim()) {
      return {
        department: 'executive',
        skill: 'ceo-advisor',
        class: 'producer',
        confidence: 0.1,
        reason: 'Empty prompt defaulted to CEO Office Advisor'
      };
    }

    // Direct namespace command detection (e.g. /technology:api-design ...)
    const directMatch = userPrompt.match(/^\/([a-zA-Z0-9_-]+):([a-zA-Z0-9_-]+)/);
    if (directMatch) {
      const [_, dept, skill] = directMatch;
      const matched = this.registry.find(s => s.department === dept && s.name.endsWith(skill));
      return {
        department: dept,
        skill: `${dept}:${skill}`,
        class: matched ? matched.class : (dept === 'security' ? 'reviewer' : 'producer'),
        confidence: 1.0,
        directCommand: true,
        reason: 'Explicit direct namespace invocation'
      };
    }

    const promptLower = userPrompt.toLowerCase();
    const tokens = this.extractTokens(promptLower);

    let matchedSkill = null;
    let highestScore = 0;
    let matchBreakdown = [];

    for (const skill of this.registry) {
      const { score, matchedTriggers } = this.calculateMatch(promptLower, tokens, skill);
      if (score > highestScore) {
        highestScore = score;
        matchedSkill = skill;
        matchBreakdown = matchedTriggers;
      }
    }

    if (!matchedSkill || highestScore < 0.2) {
      return {
        department: 'executive',
        skill: 'executive:ceo-advisor',
        class: 'producer',
        confidence: Math.max(0.1, highestScore),
        reason: 'Low intent certainty (<0.20) — routed to Executive Advisor for strategic qualification',
        matchedTriggers: matchBreakdown
      };
    }

    return {
      department: matchedSkill.department,
      skill: matchedSkill.name,
      class: matchedSkill.class,
      confidence: Math.min(1.0, Number(highestScore.toFixed(2))),
      reason: `High confidence match on triggers: ${matchBreakdown.join(', ')}`,
      matchedTriggers: matchBreakdown
    };
  }

  extractTokens(prompt) {
    return prompt.replace(/[^\w\s\u0600-\u06FF]/gi, ' ').split(/\s+/).filter(Boolean);
  }

  calculateMatch(rawPrompt, tokens, skill) {
    const triggers = skill.triggers || [];
    let matchedTriggers = [];

    // Check direct triggers
    for (const trigger of triggers) {
      if (rawPrompt.includes(trigger.toLowerCase())) {
        matchedTriggers.push(trigger);
      }
    }

    // Check Arabic dictionary keywords for the department
    const deptKeywords = AgentRouter.ARABIC_MAPPINGS[skill.department] || [];
    for (const kw of deptKeywords) {
      if (rawPrompt.includes(kw)) {
        matchedTriggers.push(`ar:${kw}`);
      }
    }

    const uniqueMatches = [...new Set(matchedTriggers)];
    const score = triggers.length > 0 ? (uniqueMatches.length / (triggers.length + 2)) * 1.5 : 0;
    return { score: Math.min(0.98, score), matchedTriggers: uniqueMatches };
  }
}

export default AgentRouter;
