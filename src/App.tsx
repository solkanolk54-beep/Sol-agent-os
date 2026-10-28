/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { PipelineRunner } from './components/PipelineRunner';
import { OrgChart } from './components/OrgChart';
import { SkillEditor } from './components/SkillEditor';
import { AuditDashboard } from './components/AuditDashboard';
import { McpBridge } from './components/McpBridge';
import { ExecutionResult, SkillDefinition } from './types';
import { DEPARTMENTS } from './data/departments';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('runner');
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  const [skills, setSkills] = useState<SkillDefinition[]>([]);
  const [auditHistory, setAuditHistory] = useState<ExecutionResult[]>([]);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [selectedSkillForRunner, setSelectedSkillForRunner] = useState<string>('');

  // Sync HTML lang and dir attributes
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  // Load manifest & registered skills on mount
  useEffect(() => {
    fetch('/api/agents/manifest')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch manifest');
        return res.json();
      })
      .then((data) => {
        if (data.skills && Array.isArray(data.skills)) {
          setSkills(data.skills);
        }
      })
      .catch((err) => {
        console.warn('Using local fallback skills:', err);
        // Fallback placeholder skills if server is warming up
        const fallbackSkills: SkillDefinition[] = [];
        for (const [deptId, dept] of Object.entries(DEPARTMENTS)) {
          for (const [sId, sPath] of Object.entries(dept.skills)) {
            fallbackSkills.push({
              id: sId,
              name: `${deptId}:${sId}`,
              department: deptId as any,
              deptName: dept.name,
              deptDesc: dept.description,
              class: dept.class,
              description: dept.description,
              triggers: [sId, deptId],
              path: sPath,
              content: `# ${sId}\n## Objective\nOperational definition for ${deptId}:${sId}\n## Execution Rules\n1. Rule 1\n## Mandatory Deliverable\n- Specification`,
            });
          }
        }
        setSkills(fallbackSkills);
      });
  }, []);

  const handleExecutionComplete = (result: ExecutionResult) => {
    setAuditHistory((prev) => [result, ...prev]);
  };

  const handleSelectSkill = (skillName: string) => {
    setSelectedSkillForRunner(skillName);
    setCurrentTab('runner');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-amber-500/30 selection:text-amber-200">
      <Header
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        lang={lang}
        setLang={setLang}
        isExecuting={isExecuting}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {currentTab === 'runner' && (
          <PipelineRunner
            skills={skills}
            lang={lang}
            onExecutionComplete={handleExecutionComplete}
          />
        )}

        {currentTab === 'org' && (
          <OrgChart
            lang={lang}
            onSelectSkill={handleSelectSkill}
          />
        )}

        {currentTab === 'skills' && (
          <SkillEditor
            skills={skills}
            lang={lang}
            onRunSkill={handleSelectSkill}
          />
        )}

        {currentTab === 'audit' && (
          <AuditDashboard
            auditHistory={auditHistory}
            lang={lang}
          />
        )}

        {currentTab === 'mcp' && (
          <McpBridge
            lang={lang}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 py-4 px-6 text-center text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Sol Autonomous Agent OS • Architecture & Governance Specification v1.0</span>
          <span>Zero Context Bloat • Exclusive Write Surfaces • Reviewer-Class Protocol</span>
        </div>
      </footer>
    </div>
  );
}
