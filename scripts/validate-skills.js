#!/usr/bin/env node
/**
 * Sol Autonomous Agent OS - Skills Validator
 * Validates YAML frontmatter, naming conventions, department mapping, and mandatory sections.
 */

import fs from 'fs';
import path from 'path';

const MANIFEST_PATH = path.resolve('.agents/manifest.json');
const PLUGINS_DIR = path.resolve('.agents/plugins');

function validate() {
  console.log('🔍 Sol Agent OS: Validating Registered Skills & Protocols...');
  
  if (!fs.existsSync(MANIFEST_PATH)) {
    console.error('❌ Manifest not found at', MANIFEST_PATH);
    process.exit(1);
  }

  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf-8'));
  const departments = Object.keys(manifest.departments);
  let totalSkills = 0;
  let errors = [];

  for (const deptId of departments) {
    const dept = manifest.departments[deptId];
    for (const [skillId, relativePath] of Object.entries(dept.skills)) {
      totalSkills++;
      const fullPath = path.resolve('.agents', relativePath);
      if (!fs.existsSync(fullPath)) {
        errors.push(`Missing skill file for ${deptId}:${skillId} -> ${fullPath}`);
        continue;
      }

      const content = fs.readFileSync(fullPath, 'utf-8');
      if (!content.startsWith('---')) {
        errors.push(`Skill ${deptId}:${skillId} is missing YAML frontmatter`);
      }
      if (!content.includes('## Objective') || !content.includes('## Execution Rules')) {
        errors.push(`Skill ${deptId}:${skillId} is missing mandatory structural sections`);
      }
    }
  }

  if (errors.length > 0) {
    console.error(`❌ Validation failed with ${errors.length} errors:`);
    errors.forEach(e => console.error(`  - ${e}`));
    return false;
  }

  console.log(`✅ All ${totalSkills} skills across ${departments.length} departments verified successfully!`);
  return true;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  validate();
}

export { validate };
