import React, { useState } from 'react';
import { 
  Briefcase, 
  Code2, 
  ShieldAlert, 
  Globe2, 
  DollarSign, 
  TrendingUp, 
  ChevronRight, 
  Play, 
  Lock, 
  CheckCircle, 
  Sparkles,
  ArrowDown,
  Layers,
  Cpu
} from 'lucide-react';
import { DepartmentId } from '../types';
import { DEPARTMENTS } from '../data/departments';

interface OrgChartProps {
  lang: 'ar' | 'en';
  onSelectSkill?: (skillName: string) => void;
}

export const OrgChart: React.FC<OrgChartProps> = ({ lang, onSelectSkill }) => {
  const isAr = lang === 'ar';
  const [selectedDept, setSelectedDept] = useState<DepartmentId>('technology');

  const deptIcons: Record<DepartmentId, any> = {
    executive: Briefcase,
    technology: Code2,
    security: ShieldAlert,
    'iot-geospatial': Globe2,
    'operations-finance': DollarSign,
    'growth-marketing': TrendingUp,
  };

  const currentMeta = DEPARTMENTS[selectedDept];

  return (
    <div className="space-y-6">
      {/* Header explanation */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium mb-1.5">
              <Layers className="w-3.5 h-3.5" />
              <span>{isAr ? 'الركيزة الثانية: الهيكل التنظيمي المخصص (Custom Org Chart)' : 'Pillar 2: Custom Org Chart'}</span>
            </div>
            <h2 className="text-xl font-bold text-white">
              {isAr ? 'مصفوفة الإدارات والوكلاء التخصصية' : 'Autonomous Department & Agent Matrix'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              {isAr 
                ? '6 قطاعات مستقلة مبنية لخدمة المشاريع التقنية والريادية، مقسمة بين فئة المنتجين (Producers) وفئة المدققين (Reviewers) مع عزل أسطح الكتابة.'
                : '6 autonomous departments serving technical and entrepreneurial initiatives, cleanly segregated into Producers and Reviewers.'}
            </p>
          </div>
        </div>
      </div>

      {/* Visual Architectural Flow Diagram */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="text-center max-w-sm mx-auto mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-mono shadow-md">
            <Cpu className="w-4 h-4 text-amber-400" />
            <span>{isAr ? 'الموجه الذكي (Dynamic Intent Router)' : 'Dynamic Intent Router'}</span>
          </div>
          <div className="w-0.5 h-6 bg-gradient-to-b from-amber-500 to-slate-700 mx-auto my-1" />
        </div>

        {/* 6 Department Cards in Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(Object.keys(DEPARTMENTS) as DepartmentId[]).map((deptId) => {
            const dept = DEPARTMENTS[deptId];
            const Icon = deptIcons[deptId];
            const isSelected = selectedDept === deptId;
            const isReviewer = dept.class === 'reviewer';

            return (
              <div
                key={deptId}
                onClick={() => setSelectedDept(deptId)}
                className={`p-4 rounded-xl border transition-all cursor-pointer relative overflow-hidden ${
                  isSelected
                    ? `${dept.borderColor} ${dept.accentBg} ring-1 ring-amber-400/40 shadow-lg scale-[1.01]`
                    : 'border-slate-800 bg-slate-900/60 hover:bg-slate-900 hover:border-slate-700'
                }`}
              >
                {isReviewer && (
                  <div className="absolute top-2 end-2 text-[9px] font-mono font-black uppercase px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    VETO CLASS
                  </div>
                )}
                {!isReviewer && (
                  <div className="absolute top-2 end-2 text-[9px] font-mono uppercase px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700/50">
                    PRODUCER
                  </div>
                )}

                <div className="flex items-center gap-3 mb-2.5">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${dept.accentBg} ${dept.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white tracking-tight">{dept.name}</h3>
                    <span className="text-[11px] font-mono text-slate-400">/{deptId}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-400 line-clamp-2 mb-3">
                  {dept.description}
                </p>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-500">
                    {Object.keys(dept.skills).length} {isAr ? 'مهارات مسجلة' : 'skills'}
                  </span>
                  <span className={`text-xs font-medium flex items-center gap-1 ${isSelected ? 'text-amber-400' : 'text-slate-400'}`}>
                    <span>{isAr ? 'معاينة المهارات' : 'Inspect'}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Reviewer Gate diagram */}
        <div className="mt-8 pt-6 border-t border-slate-800 text-center max-w-md mx-auto">
          <div className="w-0.5 h-6 bg-gradient-to-b from-slate-700 to-rose-500 mx-auto mb-2" />
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 inline-block shadow-lg">
            <div className="flex items-center gap-2 font-bold mb-1 justify-center">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <span>{isAr ? 'محرك التدقيق الصارم (Reviewer-Class Protocol)' : 'Reviewer-Class Protocol'}</span>
            </div>
            <p className="text-[11px] text-slate-400">
              {isAr ? 'يفحص المخرجات بمعايير OWASP وله سلطة الرفض المطلقة قبل التنفيذ' : 'Evaluates deliverables with absolute VETO power prior to final release'}
            </p>
          </div>
        </div>
      </div>

      {/* Selected Department Drilldown Detail Drawer */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-white">{currentMeta.name}</h3>
              <span className={`text-xs px-2 py-0.5 rounded-full font-mono font-bold uppercase ${
                currentMeta.class === 'reviewer' ? 'bg-rose-500/20 text-rose-300' : 'bg-blue-500/20 text-blue-300'
              }`}>
                {currentMeta.class}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">{currentMeta.description}</p>
          </div>

          <div className="text-xs text-slate-400 flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>{isAr ? 'سطح كتابة محمي ومستقل' : 'Isolated Write Surface'}</span>
          </div>
        </div>

        <div className="mt-5 space-y-3">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
            {isAr ? 'المهارات والوكلاء التخصصيون في هذا القسم:' : 'Registered Department Skills:'}
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {Object.entries(currentMeta.skills).map(([skillId, path]) => {
              const canonicalName = `${selectedDept}:${skillId}`;
              return (
                <div
                  key={skillId}
                  className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <code className="text-xs font-bold font-mono text-amber-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                        {canonicalName}
                      </code>
                      <span className="text-[10px] text-slate-500 font-mono">{path}</span>
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-900 flex items-center justify-between">
                    <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      <span>{isAr ? 'معيار نشط' : 'Active Standard'}</span>
                    </span>
                    {onSelectSkill && (
                      <button
                        onClick={() => onSelectSkill(canonicalName)}
                        className="text-xs px-2.5 py-1 rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <Play className="w-3 h-3" />
                        <span>{isAr ? 'تشغيل المهارة' : 'Run'}</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
