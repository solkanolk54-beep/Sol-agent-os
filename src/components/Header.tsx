import React from 'react';
import { 
  Cpu, 
  ShieldCheck, 
  Layers, 
  FileText, 
  Terminal, 
  Network, 
  Languages, 
  Sparkles,
  Activity
} from 'lucide-react';

interface HeaderProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  lang: 'ar' | 'en';
  setLang: (lang: 'ar' | 'en') => void;
  isExecuting: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  lang,
  setLang,
  isExecuting,
}) => {
  const isAr = lang === 'ar';

  const navItems = [
    {
      id: 'runner',
      label: isAr ? 'مركز العمليات والتنفيذ' : 'Mission Control',
      icon: Cpu,
      badge: isExecuting ? (isAr ? 'جاري التشغيل' : 'RUNNING') : null,
    },
    {
      id: 'org',
      label: isAr ? 'الهيكل التنظيمي (Org Chart)' : 'Org Structure',
      icon: Network,
      badge: '6 Depts',
    },
    {
      id: 'skills',
      label: isAr ? 'مستودع المهارات والبروتوكول' : 'Skills & Protocols',
      icon: Layers,
      badge: 'AGENTS.md',
    },
    {
      id: 'audit',
      label: isAr ? 'محرك التدقيق الصارم' : 'Reviewer Engine',
      icon: ShieldCheck,
      badge: 'VETO Gate',
    },
    {
      id: 'mcp',
      label: isAr ? 'ربط الـ MCP و CLI' : 'MCP & Bridge',
      icon: Terminal,
      badge: 'Tools',
    },
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80">
      {/* Top micro status bar */}
      <div className="bg-slate-900/60 px-4 py-1 text-xs text-slate-400 flex items-center justify-between border-b border-slate-800/40">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 font-mono text-emerald-400">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            SYSTEM: ONLINE
          </span>
          <span className="text-slate-600 hidden sm:inline">|</span>
          <span className="text-slate-400 font-mono hidden sm:inline">
            PROTOCOL: <strong className="text-slate-200">AGENTS.md-v1</strong>
          </span>
          <span className="text-slate-600 hidden md:inline">|</span>
          <span className="text-slate-400 font-mono hidden md:inline">
            ROUTER: <strong className="text-amber-400">DYNAMIC-INTENT-v2</strong>
          </span>
          <span className="text-slate-600 hidden lg:inline">|</span>
          <span className="text-slate-400 font-mono hidden lg:inline">
            REVIEWER GATE: <strong className="text-rose-400">VETO-SUPREMACY</strong>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
            className="flex items-center gap-1 text-xs px-2 py-0.5 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors"
            title="تبديل اللغة / Switch Language"
          >
            <Languages className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-semibold">{lang === 'ar' ? 'English' : 'العربية'}</span>
          </button>
        </div>
      </div>

      {/* Main branding & tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 via-amber-600 to-orange-700 flex items-center justify-center shadow-lg shadow-amber-500/20 ring-1 ring-amber-400/30">
              <Sparkles className="w-5 h-5 text-slate-950 font-bold" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black tracking-tight text-white flex items-center gap-1.5">
                  SOL <span className="text-amber-400 font-mono font-medium text-xs px-1.5 py-0.5 bg-amber-400/10 rounded border border-amber-400/20">AGENT OS</span>
                </h1>
              </div>
              <p className="text-xs text-slate-400">
                {isAr ? 'منصة الوكلاء الذكيين المستقلين والمؤسسية' : 'Autonomous Enterprise Agent Operating System'}
              </p>
            </div>
          </div>

          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
              className="text-xs px-2 py-1 rounded bg-slate-800 text-slate-200"
            >
              {lang === 'ar' ? 'EN' : 'عربي'}
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`relative px-3 py-2 rounded-lg text-xs sm:text-sm font-medium flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/25 font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900/80 border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                      isActive
                        ? 'bg-slate-950/20 text-slate-950 font-black'
                        : item.badge === 'RUNNING' || item.badge === 'جاري التشغيل'
                        ? 'bg-amber-500/20 text-amber-300 animate-pulse'
                        : 'bg-slate-800 text-slate-400 border border-slate-700/50'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
