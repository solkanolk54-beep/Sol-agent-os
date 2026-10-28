import React from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Lock, 
  FileCode, 
  ExternalLink,
  Activity,
  History
} from 'lucide-react';
import { ExecutionResult } from '../types';

interface AuditDashboardProps {
  auditHistory: ExecutionResult[];
  lang: 'ar' | 'en';
}

export const AuditDashboard: React.FC<AuditDashboardProps> = ({ auditHistory, lang }) => {
  const isAr = lang === 'ar';

  const totalRuns = auditHistory.length;
  const approvedRuns = auditHistory.filter(h => h.pipeline.reviewer?.verdict === 'APPROVED').length;
  const rejectedRuns = auditHistory.filter(h => h.pipeline.reviewer?.verdict === 'REJECTED').length;

  const securityCheckpoints = [
    {
      id: 'owasp-a01',
      title: 'Broken Access Control & RBAC Enforcement',
      descAr: 'التحقق من صحة توكن JWT وعزل الصلاحيات وحظر الوصول المباشر للكائنات.',
      descEn: 'JWT token verification, role enforcement, and object-level permissions.',
      status: 'MANDATORY',
      severity: 'CRITICAL',
    },
    {
      id: 'owasp-a03',
      title: 'SQL / PostGIS Injection Prevention',
      descAr: 'إلزامية الاستعلامات المجهزة (Parameterized Queries) وتدقيق مدخلات الـ Spatial Coordinates.',
      descEn: 'Parameterized queries and coordinate schema validation.',
      status: 'MANDATORY',
      severity: 'CRITICAL',
    },
    {
      id: 'owasp-a02',
      title: 'Cryptographic & Secrets Exposure',
      descAr: 'منع تسريب المفاتيح في الفرونت اند، تشفير الحقول الحساسة وتحديد خوارزميات التوقيع.',
      descEn: 'Zero client-side secrets, PII masking, and explicit RS256/ES256 algorithms.',
      status: 'MANDATORY',
      severity: 'HIGH',
    },
    {
      id: 'owasp-a05',
      title: 'Security Misconfiguration & Wildcard CORS',
      descAr: 'حظر الـ Wildcards في بيئات الإنتاج وإلزامية RFC 7807 لمعالجة الأخطاء دون كشف الـ Stack Trace.',
      descEn: 'Strict CORS policies, no verbose stack leaks, and RFC 7807 error schema.',
      status: 'ENFORCED',
      severity: 'HIGH',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium mb-1.5">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>{isAr ? 'الركيزة الثالثة: طبقة التدقيق الصارمة (Reviewer-Class Protocol)' : 'Pillar 3: Reviewer-Class Protocol'}</span>
          </div>
          <h2 className="text-xl font-bold text-white">
            {isAr ? 'محرك التدقيق الأمني وسلطة النقض (CISO VETO Gate)' : 'CISO Reviewer & Audit Authority'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            {isAr 
              ? 'يمتلك وكيل التدقيق سلطة النقض المطلقة (VETO) لمنع إصدار أي كود أو معمارية لا تتطابق مع معايير الأمان والهندسة النظيفة.'
              : 'The Reviewer Class has absolute veto power to reject deliverables that fail OWASP standards, input sanitation, or architectural rules.'}
          </p>
        </div>

        {/* Live Counters */}
        <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-xl border border-slate-800">
          <div className="text-center px-3 py-1 border-e border-slate-800">
            <span className="block text-[10px] text-slate-500 uppercase font-mono">Audited</span>
            <span className="text-xs font-bold text-slate-200">{totalRuns}</span>
          </div>
          <div className="text-center px-3 py-1 border-e border-slate-800">
            <span className="block text-[10px] text-emerald-400 uppercase font-mono">Approved</span>
            <span className="text-xs font-bold text-emerald-400">{approvedRuns}</span>
          </div>
          <div className="text-center px-3 py-1">
            <span className="block text-[10px] text-rose-400 uppercase font-mono">Vetoed</span>
            <span className="text-xs font-bold text-rose-400">{rejectedRuns}</span>
          </div>
        </div>
      </div>

      {/* Security Checkpoints Matrix */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl">
        <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
          <Lock className="w-4 h-4 text-rose-400" />
          <span>{isAr ? 'معايير التدقيق الأمني الإلزامية للمراجع (Reviewer Enforcement Matrix)' : 'Enforced Security Matrix'}</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {securityCheckpoints.map((cp) => (
            <div key={cp.id} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-slate-200">{cp.title}</span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                  cp.severity === 'CRITICAL' ? 'bg-rose-500/20 text-rose-300' : 'bg-amber-500/20 text-amber-300'
                }`}>
                  {cp.severity}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {isAr ? cp.descAr : cp.descEn}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Audit History Logs */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl">
        <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
          <History className="w-4 h-4 text-amber-400" />
          <span>{isAr ? 'سجل عمليات التدقيق المنفذة مؤخراً' : 'Recent Pipeline Audit History'}</span>
        </h3>

        {auditHistory.length === 0 ? (
          <div className="py-12 text-center text-slate-500 text-xs">
            <ShieldCheck className="w-8 h-8 mx-auto mb-2 text-slate-700" />
            {isAr ? 'لم يتم تنفيذ أي تدقيق بعد. قم بتشغيل طلب من مركز العمليات لمشاهدة سجلات التدقيق المباشرة.' : 'No audit records yet. Execute a pipeline in Mission Control to see live audit evaluations.'}
          </div>
        ) : (
          <div className="space-y-3">
            {auditHistory.map((item) => {
              const reviewer = item.pipeline.reviewer;
              const isRejected = reviewer?.verdict === 'REJECTED';

              return (
                <div key={item.executionId} className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-900">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                        isRejected ? 'bg-rose-500 text-white' : 'bg-emerald-500 text-slate-950'
                      }`}>
                        {reviewer ? reviewer.verdict : 'BYPASS'}
                      </span>
                      <code className="text-xs font-mono font-bold text-slate-200">
                        {item.skillMetadata.name}
                      </code>
                    </div>

                    <span className="text-[11px] font-mono text-slate-500">
                      {new Date(item.timestamp).toLocaleTimeString()} • ID: {item.executionId}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 mt-2 font-medium">
                    {item.prompt}
                  </p>

                  {reviewer && (
                    <div className="mt-2 text-xs font-mono text-slate-400 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80 max-h-32 overflow-y-auto">
                      <pre className="whitespace-pre-wrap">{reviewer.auditLog}</pre>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
