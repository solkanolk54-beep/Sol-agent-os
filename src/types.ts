export type DepartmentId = 
  | 'executive'
  | 'technology'
  | 'security'
  | 'iot-geospatial'
  | 'operations-finance'
  | 'growth-marketing';

export interface SkillDefinition {
  id: string;
  name: string;
  department: DepartmentId;
  deptName: string;
  deptDesc: string;
  class: 'producer' | 'reviewer';
  description: string;
  triggers: string[];
  path: string;
  content: string;
}

export interface DepartmentInfo {
  id: DepartmentId;
  name: string;
  description: string;
  class: 'producer' | 'reviewer';
  skills: Record<string, string>;
  icon: string;
  color: string;
  accentBg: string;
  borderColor: string;
}

export interface RoutingMatch {
  department: DepartmentId;
  skill: string;
  class: 'producer' | 'reviewer';
  confidence: number;
  reason: string;
  directCommand?: boolean;
  matchedTriggers?: string[];
}

export interface ExecutionResult {
  success: boolean;
  executionId: string;
  timestamp: string;
  prompt: string;
  routing: RoutingMatch;
  skillMetadata: {
    name: string;
    department: DepartmentId;
    class: 'producer' | 'reviewer';
    description: string;
  };
  pipeline: {
    router: {
      status: string;
      decision: RoutingMatch;
    };
    producer: {
      agent: string;
      status: string;
      output: string;
    };
    reviewer: {
      agent: string;
      status: 'APPROVED' | 'REJECTED';
      verdict: 'APPROVED' | 'REJECTED';
      severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'NONE';
      auditLog: string;
    } | null;
  };
}
