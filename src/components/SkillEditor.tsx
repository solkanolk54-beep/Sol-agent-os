import React, { useState } from 'react';
import { 
  FileCode, 
  CheckCircle, 
  AlertCircle, 
  Play, 
  Copy, 
  Check, 
  FileText, 
  Folder, 
  Terminal, 
  RefreshCw,
  Search,
  BookOpen
} from 'lucide-react';
import { SkillDefinition } from '../types';

interface SkillEditorProps {
  skills: SkillDefinition[];
  lang: 'ar' | 'en';
  onRunSkill: (skillName: string) => void;
}

export const SkillEditor: React.FC<SkillEditorProps> = ({ skills, lang, onRunSkill }) => {
  const isAr = lang === 'ar';

  const [selectedSkill, setSelectedSkill] = useState<SkillDefinition>(skills[0] || null);
  const [copied, setCopied] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isValidating, setIsValidating] = useState<boolean>(false);
  const [validationResult, setValidationResult] = useState<{ valid: boolean; totalSkills: number; errors: string[] } | null>(null);

  const filteredSkills = skills.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleValidateSkills = async () => {
    setIsValidating(true);
    try {
      const res = await fetch('/api/skills/validate');
      const data = await res.json();
      setValidationResult(data);
    } catch (e: any) {
      setValidationResult({ valid: false, totalSkills: skills.length, errors: [e.message] });
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium mb-1.5">
            <BookOpen className="w-3.5 h-3.5" />
            <span>{isAr ? 'المرحلة الأولى: مستودع المهارات ودستور AGENTS.md' : 'Phase 1: Skills Repository & AGENTS.md'}</span>
          </div>
          <h2 className="text-xl font-bold text-white">
            {isAr ? 'مستودع المهارات والبروتوكول المعياري' : 'Skill Catalog & Operational Specifications'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            {isAr 
              ? 'تصفح وتفحص ملفات المهارات بصيغة Markdown + YAML Frontmatter وفق المعايير المعتمدة للمنصة.'
              : 'Inspect modular skill definitions with YAML frontmatter, execution rules, and mandatory deliverables.'}
          </p>
        </div>

        <button
          onClick={handleValidateSkills}
          disabled={isValidating}
          className="text-xs px-3.5 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-200 border border-slate-700 flex items-center gap-2 transition-all cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-amber-400 ${isValidating ? 'animate-spin' : ''}`} />
          <span>{isAr ? 'التحقق من صحة المهارات (validate-skills.js)' : 'Validate Skills Spec'}</span>
        </button>
      </div>

      {/* Validation Result Box */}
      {validationResult && (
        <div className={`p-4 rounded-xl border text-xs ${
          validationResult.valid 
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' 
            : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
        }`}>
          <div className="flex items-center gap-2 font-bold mb-1">
            {validationResult.valid ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-rose-400" />}
            <span>
              {validationResult.valid 
                ? (isAr ? `نجح التحقق: جميع المهارات الـ ${validationResult.totalSkills} مطابقة للمواصفات المعيارية.` : `Validation Passed: All ${validationResult.totalSkills} skills strictly conform to standard.`)
                : (isAr ? 'فشل التحقق في بعض المهارات' : 'Validation Failed')}
            </span>
          </div>
          {validationResult.errors.length > 0 && (
            <ul className="list-disc list-inside mt-2 space-y-1">
              {validationResult.errors.map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Main 2-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Skill List (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
            {/* Search */}
            <div className="relative mb-3">
              <Search className="w-4 h-4 text-slate-500 absolute top-2.5 start-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={isAr ? 'بحث في المهارات...' : 'Search skills...'}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl ps-8 pe-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="space-y-1.5 max-h-[500px] overflow-y-auto pe-1">
              {filteredSkills.map((skill) => {
                const isSelected = selectedSkill?.name === skill.name;
                return (
                  <button
                    key={skill.name}
                    onClick={() => setSelectedSkill(skill)}
                    className={`w-full p-2.5 rounded-xl text-start transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-amber-500/10 border-amber-500/40 text-amber-300'
                        : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-800 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <code className="text-xs font-mono font-bold">{skill.name}</code>
                      <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono uppercase ${
                        skill.class === 'reviewer' ? 'bg-rose-500/20 text-rose-300' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {skill.class}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-1">{skill.description}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Markdown Viewer & Runner (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {selectedSkill ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white font-mono">{selectedSkill.name}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-mono font-black uppercase ${
                      selectedSkill.class === 'reviewer' ? 'bg-rose-500/20 text-rose-300' : 'bg-blue-500/20 text-blue-300'
                    }`}>
                      {selectedSkill.class}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{selectedSkill.deptName} • {selectedSkill.path}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopy(selectedSkill.content)}
                    className="text-xs px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1.5 transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? (isAr ? 'تم النسخ' : 'Copied') : (isAr ? 'نسخ المواصفة' : 'Copy')}</span>
                  </button>
                  <button
                    onClick={() => onRunSkill(selectedSkill.name)}
                    className="text-xs px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 font-bold text-slate-950 hover:brightness-110 flex items-center gap-1.5 shadow-md shadow-amber-500/20"
                  >
                    <Play className="w-3.5 h-3.5 fill-slate-950" />
                    <span>{isAr ? 'تشغيل في مركز العمليات' : 'Test in Runner'}</span>
                  </button>
                </div>
              </div>

              {/* Triggers Bar */}
              {selectedSkill.triggers && selectedSkill.triggers.length > 0 && (
                <div className="my-3 flex items-center gap-1.5 flex-wrap">
                  <span className="text-[11px] text-slate-500 font-mono">{isAr ? 'المحفزات:' : 'Triggers:'}</span>
                  {selectedSkill.triggers.map((trig, idx) => (
                    <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-slate-950 text-slate-300 font-mono border border-slate-800">
                      {trig}
                    </span>
                  ))}
                </div>
              )}

              {/* Code/Markdown Content */}
              <div className="mt-4 bg-slate-950 rounded-xl p-4 sm:p-5 border border-slate-800 text-slate-200 text-xs sm:text-sm font-mono overflow-x-auto leading-relaxed">
                <pre className="whitespace-pre-wrap">{selectedSkill.content}</pre>
              </div>
            </div>
          ) : (
            <div className="py-20 text-center text-slate-500 text-sm">
              {isAr ? 'اختر مهارة من القائمة لمعاينتها' : 'Select a skill to inspect.'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
