import React, { useState } from 'react';
import { 
  Terminal, 
  Copy, 
  Check, 
  Code2, 
  Cpu, 
  Download, 
  Layers, 
  Sparkles,
  ExternalLink
} from 'lucide-react';

interface McpBridgeProps {
  lang: 'ar' | 'en';
}

export const McpBridge: React.FC<McpBridgeProps> = ({ lang }) => {
  const isAr = lang === 'ar';
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const mcpConfig = {
    mcpServers: {
      "sol-agent-os": {
        command: "node",
        args: ["./scripts/mcp-server.js"],
        env: {
          AGENT_PROTOCOL: "AGENTS.md-v1",
          MANIFEST_PATH: "./.agents/manifest.json"
        }
      }
    }
  };

  const mcpToolsDefinition = [
    {
      name: "sol_route_intent",
      description: "Dynamically matches user prompt to the exact department and skill (e.g. technology:api-design or operations-finance:unit-economics)",
      inputSchema: {
        type: "object",
        properties: {
          prompt: { type: "string", description: "The task or requirement description in Arabic or English" }
        },
        required: ["prompt"]
      }
    },
    {
      name: "sol_execute_skill",
      description: "Executes a registered autonomous skill strictly inside its isolated write surface",
      inputSchema: {
        type: "object",
        properties: {
          skill_namespace: { type: "string", description: "Format: department:skill-name" },
          context: { type: "string", description: "Input parameters or code" }
        },
        required: ["skill_namespace", "context"]
      }
    },
    {
      name: "sol_audit_reviewer",
      description: "Mandatory CISO / Reviewer evaluation with VETO power before release",
      inputSchema: {
        type: "object",
        properties: {
          deliverable: { type: "string", description: "The artifact to review for vulnerabilities and compliance" }
        },
        required: ["deliverable"]
      }
    }
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-medium mb-1.5">
              <Terminal className="w-3.5 h-3.5" />
              <span>{isAr ? 'المرحلة الثالثة: الأتمتة وبروتوكول MCP (Automation & Tooling)' : 'Phase 3: MCP & Automation Tooling'}</span>
            </div>
            <h2 className="text-xl font-bold text-white">
              {isAr ? 'جسر الربط مع بيئات العمل و Claude Code عبر بروتوكول MCP' : 'Model Context Protocol (MCP) & CLI Bridge'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              {isAr 
                ? 'اربط المنظومة مباشرة بأدوات التطوير (Claude Code, Cursor, Windsurf) كـ MCP Tools لاستدعاء الوكلاء تلقائياً أثناء كتابة الكود.'
                : 'Connect Sol Agent OS directly to your local development environment via Model Context Protocol (MCP).'}
            </p>
          </div>
        </div>
      </div>

      {/* 2-Column Config & Tools */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: MCP Configuration */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Code2 className="w-4 h-4 text-amber-400" />
              <span>{isAr ? 'إعداد ملف الـ MCP (claude_desktop_config.json)' : 'MCP Configuration'}</span>
            </h3>
            <button
              onClick={() => handleCopy(JSON.stringify(mcpConfig, null, 2), 'mcp')}
              className="text-xs px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1 transition-colors"
            >
              {copiedKey === 'mcp' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'mcp' ? (isAr ? 'تم النسخ' : 'Copied') : (isAr ? 'نسخ الإعداد' : 'Copy')}</span>
            </button>
          </div>

          <p className="text-xs text-slate-400">
            {isAr 
              ? 'أضف هذا الإعداد في ملف إعدادات Claude Desktop أو Cursor لاستدعاء المهارات مباشرة من خلال الـ AI.'
              : 'Add this snippet to your Claude Desktop or Cursor MCP settings to invoke Sol agents directly.'}
          </p>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-slate-200 overflow-x-auto">
            <pre>{JSON.stringify(mcpConfig, null, 2)}</pre>
          </div>

          <div className="pt-2">
            <h4 className="text-xs font-bold text-slate-300 mb-2">{isAr ? 'أوامر الطرفية السريعة (CLI Commands):' : 'CLI Commands:'}</h4>
            <div className="space-y-2">
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 flex items-center justify-between font-mono text-xs text-amber-300">
                <code>node scripts/validate-skills.js</code>
                <button
                  onClick={() => handleCopy('node scripts/validate-skills.js', 'cli1')}
                  className="text-slate-400 hover:text-white"
                >
                  {copiedKey === 'cli1' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 flex items-center justify-between font-mono text-xs text-amber-300">
                <code>node -e &quot;import(&apos;./scripts/router.js&apos;).then(m =&gt; console.log(new m.default().route(&apos;API PostGIS&apos;)))&quot;</code>
                <button
                  onClick={() => handleCopy(`node -e "import('./scripts/router.js').then(m => console.log(new m.default().route('API PostGIS')))"`, 'cli2')}
                  className="text-slate-400 hover:text-white"
                >
                  {copiedKey === 'cli2' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Exposed MCP Tools Definitions */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-violet-400" />
              <span>{isAr ? 'أدوات الـ MCP المسجلة (Exposed MCP Tools)' : 'Exposed MCP Tools'}</span>
            </h3>
            <button
              onClick={() => handleCopy(JSON.stringify(mcpToolsDefinition, null, 2), 'tools')}
              className="text-xs px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1 transition-colors"
            >
              {copiedKey === 'tools' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'tools' ? (isAr ? 'تم النسخ' : 'Copied') : (isAr ? 'نسخ الأدوات' : 'Copy')}</span>
            </button>
          </div>

          <p className="text-xs text-slate-400">
            {isAr 
              ? 'مخطط أدوات JSON-RPC المعياري لتمكين النماذج الذكية من التوجيه والتنفيذ والتدقيق.' 
              : 'Standard JSON-RPC tool schemas enabling LLMs to route, produce, and audit autonomously.'}
          </p>

          <div className="space-y-3">
            {mcpToolsDefinition.map((tool) => (
              <div key={tool.name} className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex items-center justify-between mb-1">
                  <code className="text-xs font-bold font-mono text-violet-300">{tool.name}</code>
                  <span className="text-[10px] text-slate-500 font-mono">Tool</span>
                </div>
                <p className="text-xs text-slate-400">{tool.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
