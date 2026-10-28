import React, { useState, useEffect } from 'react';
import { 
  Play, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  ShieldAlert, 
  ShieldCheck, 
  Cpu, 
  ArrowRight, 
  Copy, 
  Check, 
  Download, 
  Sparkles, 
  Zap, 
  Lock, 
  Code, 
  FileText, 
  Settings2,
  Sliders,
  Maximize2
} from 'lucide-react';
import { ExecutionResult, RoutingMatch, SkillDefinition } from '../types';
import { SAMPLE_PROMPTS, DEPARTMENTS } from '../data/departments';

interface PipelineRunnerProps {
  skills: SkillDefinition[];
  lang: 'ar' | 'en';
  onExecutionComplete?: (result: ExecutionResult) => void;
}

export const PipelineRunner: React.FC<PipelineRunnerProps> = ({
  skills,
  lang,
  onExecutionComplete,
}) => {
  const isAr = lang === 'ar';

  const [prompt, setPrompt] = useState<string>(SAMPLE_PROMPTS[0].prompt);
  const [requireReview, setRequireReview] = useState<boolean>(true);
  const [strictAudit, setStrictAudit] = useState<boolean>(true);
  const [forcedSkill, setForcedSkill] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentStage, setCurrentStage] = useState<number>(0); // 0=idle, 1=routing, 2=producer, 3=reviewer, 4=done
  const [result, setResult] = useState<ExecutionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'deliverable' | 'audit' | 'trace' | 'json'>('deliverable');
  const [copied, setCopied] = useState<boolean>(false);

  // Real-time intent routing calculation as user types
  const [liveRouting, setLiveRouting] = useState<RoutingMatch | null>(null);

  useEffect(() => {
    if (!prompt.trim()) {
      setLiveRouting(null);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await fetch('/api/router/match', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt }),
        });
        if (res.ok) {
          const data = await res.json();
          setLiveRouting(data.result);
        }
      } catch (e) {
        // quiet fallback
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [prompt]);

  const handleRunPipeline = async () => {
    if (!prompt.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    setCurrentStage(1);

    try {
      // Stage 1: Router animation delay
      await new Promise(r => setTimeout(r, 450));
      setCurrentStage(2); // Producer

      const response = await fetch('/api/agents/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          forcedSkill: forcedSkill || undefined,
          requireReview,
          strictAudit,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Server responded with status ${response.status}`);
      }

      if (requireReview) {
        setCurrentStage(3); // Reviewer
        await new Promise(r => setTimeout(r, 400));
      }

      const data: ExecutionResult = await response.json();
      setResult(data);
      setCurrentStage(4); // Done
      if (onExecutionComplete) onExecutionComplete(data);
    } catch (err: any) {
      console.error('Execution error:', err);
      setError(err.message || 'An error occurred during pipeline execution.');
      setCurrentStage(0);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!result) return;
    const content = `# Sol Autonomous Agent OS - Deliverable
Execution ID: ${result.executionId}
Agent: ${result.skillMetadata.name} (${result.skillMetadata.class})
Date: ${result.timestamp}
Prompt: ${result.prompt}

---
## PRODUCER DELIVERABLE:
${result.pipeline.producer.output}

---
## REVIEWER CLASS AUDIT:
${result.pipeline.reviewer ? result.pipeline.reviewer.auditLog : 'Audit Skipped'}
`;
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sol-deliverable-${result.executionId}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const currentDeptKey = liveRouting?.department || 'technology';
  const currentDeptMeta = DEPARTMENTS[currentDeptKey] || DEPARTMENTS.technology;

  return (
    <div className="space-y-6">
      {/* Top Banner / Philosophy Box */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 rounded-2xl p-5 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl -z-10" />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-medium mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isAr ? 'الركائز الثلاث: التوجيه الديناميكي • عزل أسطح الكتابة • سلطة النقض للمراجع' : '3 Pillars: Intent Routing • Isolated Surfaces • Reviewer VETO'}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {isAr ? 'مركز العمليات والتنفيذ المستقل' : 'Autonomous Agent Mission Control'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mt-1">
              {isAr 
                ? 'أدخل أي مسألة تقنية، مالية، مكانية أو أمنية. سيقوم الموجه الذكي باختيار الوكيل المناسب من بين الإدارات الـ 6، تشغيل الوكيل في مجاله المعزول، ثم إخضاعه لتدقيق CISO الإلزامي قبل الإفراج عن المخرجات.' 
                : 'Input any technical, financial, or spatial request. The Intent Router auto-selects the right skill, generates deliverables in isolation, and runs strict Reviewer-Class verification before final certification.'}
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-950/80 p-2 rounded-xl border border-slate-800 self-stretch md:self-auto justify-between">
            <div className="text-center px-3 py-1 border-e border-slate-800">
              <span className="block text-[10px] text-slate-500 uppercase font-mono">Status</span>
              <span className="text-xs font-bold text-emerald-400">READY</span>
            </div>
            <div className="text-center px-3 py-1 border-e border-slate-800">
              <span className="block text-[10px] text-slate-500 uppercase font-mono">Depts</span>
              <span className="text-xs font-bold text-amber-400">6 ACTIVE</span>
            </div>
            <div className="text-center px-3 py-1">
              <span className="block text-[10px] text-slate-500 uppercase font-mono">Protocol</span>
              <span className="text-xs font-bold text-slate-200">AGENTS.md</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Input & Presets vs Real-time Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Prompt & Execution Controls (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg">
            {/* Quick Sample Presets */}
            <div className="mb-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  {isAr ? 'سيناريوهات تجريبية جاهزة (أمثلة معيارية):' : 'Ready Sample Scenarios:'}
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {SAMPLE_PROMPTS.map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setPrompt(sample.prompt);
                      setForcedSkill('');
                    }}
                    className="text-xs px-2.5 py-1.5 rounded-lg bg-slate-950/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 transition-all text-start"
                  >
                    {sample.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Prompt Textarea */}
            <div className="relative">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={isAr ? "اكتب طلبك هنا، مثلاً: صمم لي واجهة برمجية لأسطول سيارات واستعلام PostGIS..." : "Enter request, or use direct command like /technology:api-design..."}
                rows={4}
                className="w-full bg-slate-950/90 border border-slate-700/80 focus:border-amber-500 rounded-xl p-3.5 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500/50 transition-all resize-y"
              />
              <div className="flex items-center justify-between text-xs text-slate-500 mt-1 px-1">
                <span>{isAr ? 'يدعم الأوامر المباشرة: /department:skill [context]' : 'Supports direct commands: /dept:skill'}</span>
                <span>{prompt.length} {isAr ? 'حرف' : 'chars'}</span>
              </div>
            </div>

            {/* Execution Controls bar */}
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-4 text-xs">
                {/* Mandatory Reviewer Switch */}
                <label className="flex items-center gap-2 cursor-pointer select-none text-slate-300">
                  <input
                    type="checkbox"
                    checked={requireReview}
                    onChange={(e) => setRequireReview(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-amber-500 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                  />
                  <span className="flex items-center gap-1 font-medium">
                    <ShieldCheck className="w-4 h-4 text-rose-400" />
                    {isAr ? 'تدقيق CISO الإلزامي (سلطة النقض VETO)' : 'Mandatory CISO Review (VETO)'}
                  </span>
                </label>

                {/* Direct Override Dropdown */}
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-500 hidden sm:inline">{isAr ? 'تجاوز:' : 'Override:'}</span>
                  <select
                    value={forcedSkill}
                    onChange={(e) => setForcedSkill(e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-xs text-slate-300 focus:outline-none focus:border-amber-500"
                  >
                    <option value="">{isAr ? 'توجيه آلي (Router Auto)' : 'Auto-Route'}</option>
                    {skills.map((s) => (
                      <option key={s.name} value={s.name}>
                        {s.name} ({s.class})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Run Button */}
              <button
                type="button"
                onClick={handleRunPipeline}
                disabled={isLoading || !prompt.trim()}
                className={`px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg transition-all cursor-pointer ${
                  isLoading || !prompt.trim()
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 hover:brightness-110 shadow-amber-500/20 active:scale-95'
                }`}
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    <span>{isAr ? 'جاري تشغيل خط الوكلاء...' : 'Executing Pipeline...'}</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-slate-950 text-slate-950" />
                    <span>{isAr ? 'تشغيل خط الوكلاء المستقلين' : 'Execute Autonomous Pipeline'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right: Real-time Intent Radar & Router Diagnostics (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                  <h3 className="text-sm font-bold text-white">
                    {isAr ? 'رادار التوجيه الذكي المباشر (Intent Radar)' : 'Live Intent Router Radar'}
                  </h3>
                </div>
                <span className="text-[11px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                  {liveRouting ? `${Math.round(liveRouting.confidence * 100)}% Match` : 'Listening...'}
                </span>
              </div>

              {liveRouting ? (
                <div className="mt-4 space-y-3">
                  {/* Department & Skill Matched */}
                  <div className={`p-3.5 rounded-xl border ${currentDeptMeta.borderColor} ${currentDeptMeta.accentBg} transition-all`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-mono font-bold text-slate-300">
                        {isAr ? 'القسم والمهارة المستهدفة:' : 'Targeted Skill & Dept:'}
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono uppercase font-black ${
                        liveRouting.class === 'reviewer' ? 'bg-rose-500/20 text-rose-300' : 'bg-blue-500/20 text-blue-300'
                      }`}>
                        {liveRouting.class}
                      </span>
                    </div>
                    <div className="text-sm font-bold text-white flex items-center gap-2">
                      <code className="text-amber-400 font-mono text-xs sm:text-sm bg-slate-950/80 px-2 py-0.5 rounded border border-slate-800">
                        {liveRouting.skill}
                      </code>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      {currentDeptMeta.name}
                    </p>
                  </div>

                  {/* Reason & Matched Triggers */}
                  <div className="space-y-2 text-xs">
                    <div className="text-slate-400">
                      <strong className="text-slate-300">{isAr ? 'مبرر التوجيه:' : 'Routing Justification:'}</strong> {liveRouting.reason}
                    </div>
                    {liveRouting.matchedTriggers && liveRouting.matchedTriggers.length > 0 && (
                      <div>
                        <span className="text-slate-500 block mb-1">{isAr ? 'الكلمات المفتاحية المحفزة (Triggers):' : 'Trigger Tokens:'}</span>
                        <div className="flex flex-wrap gap-1">
                          {liveRouting.matchedTriggers.map((trig, i) => (
                            <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-slate-950 text-slate-300 font-mono border border-slate-800">
                              {trig}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center text-slate-500 text-xs">
                  <Cpu className="w-8 h-8 mx-auto mb-2 text-slate-700" />
                  {isAr ? 'اكتب طلباً في الحقل أعلاه لمعاينة التوجيه الآلي المباشر' : 'Type a prompt above to see real-time routing analysis.'}
                </div>
              )}
            </div>

            {/* Write Surface Guarantee Badge */}
            <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center gap-2">
              <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>{isAr ? 'ضمان العزل التام: لن يتعدى الوكيل حدود السطح البرمجي المخصص له.' : 'Exclusive Write Surface: Strict sandbox isolation guaranteed.'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Pipeline Stepper */}
      {(isLoading || result) && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl transition-all">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-amber-400" />
              {isAr ? 'مسار التنفيذ التتابعي للوكلاء (Agent Execution Graph)' : 'Sequential Agent Execution Graph'}
            </h3>
            {result && (
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-mono font-bold flex items-center gap-1 ${
                result.pipeline.reviewer?.verdict === 'REJECTED'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              }`}>
                {result.pipeline.reviewer?.verdict === 'REJECTED' ? (
                  <>
                    <XCircle className="w-3.5 h-3.5" />
                    <span>{isAr ? 'تم النقض (VETOED)' : 'VETOED'}</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{isAr ? 'معتمد للإنتاج (RELEASE CERTIFIED)' : 'CERTIFIED'}</span>
                  </>
                )}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            {/* Step 1: Router */}
            <div className={`p-3 rounded-xl border transition-all ${
              currentStage >= 1 ? 'border-amber-500/50 bg-amber-500/5' : 'border-slate-800 bg-slate-950/50 opacity-50'
            }`}>
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1">
                <span>01. ROUTER</span>
                {currentStage === 1 && <span className="animate-pulse text-amber-400">ANALYZING</span>}
                {currentStage > 1 && <Check className="w-3.5 h-3.5 text-emerald-400" />}
              </div>
              <h4 className="text-xs font-bold text-white">{isAr ? 'الموجه الذكي' : 'Intent Router'}</h4>
              <p className="text-[11px] text-slate-400 mt-1 truncate font-mono">
                {result ? result.routing.skill : (liveRouting ? liveRouting.skill : 'Resolving...')}
              </p>
            </div>

            {/* Step 2: Producer */}
            <div className={`p-3 rounded-xl border transition-all ${
              currentStage >= 2 ? 'border-blue-500/50 bg-blue-500/5' : 'border-slate-800 bg-slate-950/50 opacity-50'
            }`}>
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1">
                <span>02. PRODUCER</span>
                {currentStage === 2 && <span className="animate-pulse text-blue-400">GENERATING</span>}
                {currentStage > 2 && <Check className="w-3.5 h-3.5 text-emerald-400" />}
              </div>
              <h4 className="text-xs font-bold text-white">{isAr ? 'الوكيل المُنتِج' : 'Producer Agent'}</h4>
              <p className="text-[11px] text-slate-400 mt-1">
                {isAr ? 'سطح كتابة معزول' : 'Isolated Surface'}
              </p>
            </div>

            {/* Step 3: Reviewer Gate */}
            <div className={`p-3 rounded-xl border transition-all ${
              currentStage >= 3 ? 'border-rose-500/50 bg-rose-500/5' : 'border-slate-800 bg-slate-950/50 opacity-50'
            }`}>
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1">
                <span>03. REVIEWER</span>
                {currentStage === 3 && <span className="animate-pulse text-rose-400">AUDITING</span>}
                {currentStage > 3 && (
                  result?.pipeline.reviewer?.verdict === 'REJECTED'
                    ? <XCircle className="w-3.5 h-3.5 text-rose-400" />
                    : <Check className="w-3.5 h-3.5 text-emerald-400" />
                )}
              </div>
              <h4 className="text-xs font-bold text-white">{isAr ? 'بوابة التدقيق والنقض' : 'CISO Reviewer Gate'}</h4>
              <p className="text-[11px] text-slate-400 mt-1 font-mono">
                {result?.pipeline.reviewer ? result.pipeline.reviewer.verdict : (requireReview ? 'security:security-audit' : 'Bypassed')}
              </p>
            </div>

            {/* Step 4: Final Deliverable */}
            <div className={`p-3 rounded-xl border transition-all ${
              currentStage >= 4 ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-slate-800 bg-slate-950/50 opacity-50'
            }`}>
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1">
                <span>04. RELEASE</span>
                {currentStage === 4 && <Check className="w-3.5 h-3.5 text-emerald-400" />}
              </div>
              <h4 className="text-xs font-bold text-white">{isAr ? 'المخرجات المعتمدة' : 'Release Package'}</h4>
              <p className="text-[11px] text-slate-400 mt-1">
                {result ? `${result.executionId}` : 'Pending...'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div>
            <strong className="block font-bold">{isAr ? 'فشل تنفيذ خط الوكلاء:' : 'Pipeline Execution Failed:'}</strong>
            <p className="mt-0.5 text-xs text-rose-200/90">{error}</p>
          </div>
        </div>
      )}

      {/* Execution Results View */}
      {result && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
          {/* Top Result Action Bar */}
          <div className="bg-slate-950 px-5 py-3.5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400">{isAr ? 'العرض:' : 'View:'}</span>
              <div className="flex bg-slate-900 p-0.5 rounded-lg border border-slate-800">
                <button
                  onClick={() => setActiveTab('deliverable')}
                  className={`text-xs px-3 py-1 rounded-md font-medium transition-all ${
                    activeTab === 'deliverable'
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {isAr ? 'المخرجات النهائية (Deliverable)' : 'Deliverable'}
                </button>
                {result.pipeline.reviewer && (
                  <button
                    onClick={() => setActiveTab('audit')}
                    className={`text-xs px-3 py-1 rounded-md font-medium transition-all flex items-center gap-1.5 ${
                      activeTab === 'audit'
                        ? 'bg-amber-500 text-slate-950 font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>{isAr ? 'تقرير التدقيق (CISO Audit)' : 'CISO Audit'}</span>
                    <span className={`text-[9px] px-1.5 py-0.2 rounded font-black ${
                      result.pipeline.reviewer.verdict === 'REJECTED'
                        ? 'bg-rose-500 text-white'
                        : 'bg-emerald-500 text-slate-950'
                    }`}>
                      {result.pipeline.reviewer.verdict}
                    </span>
                  </button>
                )}
                <button
                  onClick={() => setActiveTab('trace')}
                  className={`text-xs px-3 py-1 rounded-md font-medium transition-all ${
                    activeTab === 'trace'
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {isAr ? 'سجل المعمارية (Trace)' : 'Architecture Trace'}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleCopy(result.pipeline.producer.output)}
                className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center gap-1.5 transition-colors"
                title="نسخ المخرجات"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? (isAr ? 'تم النسخ' : 'Copied') : (isAr ? 'نسخ المخرجات' : 'Copy')}</span>
              </button>
              <button
                onClick={handleDownload}
                className="text-xs px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 flex items-center gap-1.5 transition-colors"
                title="تحميل كملف Markdown"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{isAr ? 'تصدير (.md)' : 'Export .md'}</span>
              </button>
            </div>
          </div>

          {/* Result Content Body */}
          <div className="p-5 sm:p-6">
            {/* Tab 1: Deliverable */}
            {activeTab === 'deliverable' && (
              <div className="space-y-4">
                {/* Status Callout */}
                {result.pipeline.reviewer && result.pipeline.reviewer.verdict === 'REJECTED' ? (
                  <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/40 text-rose-300 flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <strong className="block text-sm font-bold text-rose-200">
                        {isAr ? 'تنبيه: تم نقض المخرجات بواسطة بروتوكول التدقيق (VETOED BY REVIEWER)' : 'VERDICT: REJECTED BY REVIEWER'}
                      </strong>
                      <p className="mt-1">
                        {isAr 
                          ? 'اكتشف وكيل التدقيق الأمني ثغرات أو ملاحظات يجب معالجتها قبل اعتماد الشيفرة للإنتاج. يرجى مراجعة تبويب تقرير التدقيق.'
                          : 'Critical security or structural concerns were flagged by the Reviewer Class. Inspect the CISO Audit tab for required remediation steps.'}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>
                        {isAr ? 'تم التحقق والاعتماد: اجتازت المخرجات معايير الأمن والمعمارية النظيفة بنجاح.' : 'Release Certified: Passed all security and architecture standards.'}
                      </span>
                    </div>
                    <span className="font-mono text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                      STATUS: APPROVED
                    </span>
                  </div>
                )}

                {/* Main Deliverable Output */}
                <div className="bg-slate-950 rounded-xl p-5 border border-slate-800 text-slate-200 text-sm overflow-x-auto leading-relaxed">
                  <pre className="whitespace-pre-wrap font-mono text-xs sm:text-sm text-slate-100">
                    {result.pipeline.producer.output}
                  </pre>
                </div>
              </div>
            )}

            {/* Tab 2: CISO Audit Log */}
            {activeTab === 'audit' && result.pipeline.reviewer && (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                      result.pipeline.reviewer.verdict === 'APPROVED' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                    }`}>
                      {result.pipeline.reviewer.verdict === 'APPROVED' ? <Check className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">
                        {isAr ? 'قرار وكيل التدقيق الأمني (CISO Auditor Verdict)' : 'CISO Auditor Verdict'}
                      </h4>
                      <p className="text-xs text-slate-400">
                        {isAr ? 'بروتوكول التدقيق: OWASP Top 10 • فحص الحقن • ضوابط التوثيق' : 'Protocol: OWASP Top 10 • Injection Checks • Auth Controls'}
                      </p>
                    </div>
                  </div>

                  <div className="text-end">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-mono font-black ${
                      result.pipeline.reviewer.verdict === 'APPROVED' ? 'bg-emerald-500 text-slate-950' : 'bg-rose-500 text-white'
                    }`}>
                      STATUS: {result.pipeline.reviewer.verdict}
                    </span>
                    <span className="block text-[10px] text-slate-500 mt-1 font-mono">
                      SEVERITY: {result.pipeline.reviewer.severity}
                    </span>
                  </div>
                </div>

                <div className="bg-slate-950 rounded-xl p-5 border border-slate-800 text-xs sm:text-sm font-mono overflow-x-auto text-slate-200">
                  <pre className="whitespace-pre-wrap">
                    {result.pipeline.reviewer.auditLog}
                  </pre>
                </div>
              </div>
            )}

            {/* Tab 3: Architecture Trace */}
            {activeTab === 'trace' && (
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-500 font-mono block">EXECUTION ID</span>
                    <span className="text-slate-200 font-mono font-bold">{result.executionId}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-500 font-mono block">AGENT NAMESPACE</span>
                    <span className="text-amber-400 font-mono font-bold">{result.skillMetadata.name}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-500 font-mono block">WRITE SURFACE</span>
                    <span className="text-emerald-400 font-mono font-bold">STRICTLY ISOLATED</span>
                  </div>
                </div>

                <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 font-mono text-[11px] overflow-x-auto text-slate-300">
                  <pre>{JSON.stringify(result, null, 2)}</pre>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
