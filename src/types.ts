export type Severity = 'Critical' | 'High' | 'Medium' | 'Low';
export type IncidentStatus = 'In Review' | 'Draft' | 'Approved' | 'Resolved';
export type IncidentCategory = 'RAN' | 'Core' | 'Fiber' | 'Power' | 'Cloud' | 'OSS';

export interface Incident {
  id: string;
  title: string;
  description: string;
  severity: Severity;
  region: string;
  owner: string;
  ownerInitials: string;
  ownerAvatar?: string;
  status: IncidentStatus;
  dueDate: string;
  category: IncidentCategory;
  impactCustomers: number;
  financialImpact: string; // e.g. "$2.4M" or "$50k"
  duration: string; // e.g. "4h 12m"
  siteId: string; // e.g. "ATL-CORE-02"
  startTime: string; // e.g. "2023-10-24 | 14:22:10 UTC"
  slaImpact: string; // e.g. "-18.4%"
}

export type ActionStatus = 'Completed' | 'In Progress' | 'Overdue' | 'Planning';

export interface CAPAAction {
  id: string;
  title: string;
  status: ActionStatus;
  owner: string;
  department: string;
  dueDate: string;
  priority: Severity;
  description?: string;
}

export interface WhyStep {
  index: number; // 1 to 5
  type: string; // "Why 1: Problem Symptom", etc.
  statement: string;
  evidence: string;
  confidence: number; // 0 to 100
  status: 'Validated' | 'Pending Peer Review' | 'Draft';
}

export interface RCAWorkspace {
  incidentId: string;
  title: string;
  whys: WhyStep[];
  qualityScore: number;
  executiveSummary?: string;
  rootCauseStatement?: string;
  actionPlan?: {
    task: string;
    owner: string;
    dueDate: string;
    status: string;
  }[];
  feedback?: string;
}

export interface MitigationStep {
  phase: string;
  action: string;
  targetTime: string;
  responsibility: string;
}

export interface MitigationPlan {
  title: string;
  summary: string;
  steps: MitigationStep[];
  recommendations: string[];
}
