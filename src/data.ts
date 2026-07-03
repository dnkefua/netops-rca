import { Incident, CAPAAction, RCAWorkspace } from './types';

export const INITIAL_INCIDENTS: Incident[] = [
  {
    id: "RCA-2023-0842",
    title: "Core Router Failure - Node NYC-04",
    description: "Cascading BGP failure affecting northeast corridor.",
    severity: "Critical",
    region: "North America (NE)",
    owner: "John Doe",
    ownerInitials: "JD",
    status: "In Review",
    dueDate: "2023-10-24",
    category: "Core",
    impactCustomers: 320000,
    financialImpact: "$850k",
    duration: "2h 45m",
    siteId: "NYC-NODE-04",
    startTime: "2023-10-24 | 08:15:22 UTC",
    slaImpact: "-12.4%"
  },
  {
    id: "RCA-2023-0915",
    title: "Submarine Cable Cut (SEA-ME-WE 5)",
    description: "Latency spike in APAC transit routes.",
    severity: "Critical",
    region: "APAC Central",
    owner: "Sarah Chen",
    ownerInitials: "SC",
    status: "Draft",
    dueDate: "2023-10-28",
    category: "Fiber",
    impactCustomers: 1200000,
    financialImpact: "$4.2M",
    duration: "18h 30m",
    siteId: "SEA-ME-WE-5",
    startTime: "2023-10-27 | 22:10:00 UTC",
    slaImpact: "-25.6%"
  },
  {
    id: "RCA-2023-0722",
    title: "Billing OSS DB Deadlock",
    description: "Delayed CDR processing for prepaid segment.",
    severity: "High",
    region: "Global Ops",
    owner: "Marco Lu",
    ownerInitials: "ML",
    status: "Approved",
    dueDate: "2023-10-15",
    category: "OSS",
    impactCustomers: 450000,
    financialImpact: "$1.2M",
    duration: "6h 15m",
    siteId: "BILL-OSS-01",
    startTime: "2023-10-14 | 03:40:11 UTC",
    slaImpact: "-8.1%"
  },
  {
    id: "RCA-2023-1004",
    title: "Metro Fiber Hub Power Outage",
    description: "Dual UPS failure during scheduled maintenance.",
    severity: "Critical",
    region: "EMEA West",
    owner: "Erik Ten",
    ownerInitials: "ET",
    status: "In Review",
    dueDate: "2023-10-31",
    category: "Power",
    impactCustomers: 650000,
    financialImpact: "$1.8M",
    duration: "3h 20m",
    siteId: "YDE-NODE-12",
    startTime: "2023-10-30 | 11:15:00 UTC",
    slaImpact: "-15.2%"
  },
  {
    id: "INC-9942",
    title: "South Region Fiber Cut",
    description: "Regional backbone cable severed during roadwork.",
    severity: "Critical",
    region: "North America (SE)",
    owner: "Sarah Jenkins",
    ownerInitials: "SJ",
    status: "In Review",
    dueDate: "2023-10-24",
    category: "Fiber",
    impactCustomers: 842000,
    financialImpact: "$2.4M",
    duration: "4h 12m",
    siteId: "ATL-CORE-02",
    startTime: "2023-10-24 | 14:22:10 UTC",
    slaImpact: "-18.4%"
  },
  {
    id: "RCA-9921-X",
    title: "Packet Drop in Southern Metro",
    description: "High-priority core network instability affecting data throughput.",
    severity: "Critical",
    region: "South-East",
    owner: "Alex Mitchell",
    ownerInitials: "AM",
    status: "In Review",
    dueDate: "2023-10-24",
    category: "Core",
    impactCustomers: 540000,
    financialImpact: "$1.5M",
    duration: "4h 12m",
    siteId: "ATL-CORE-02",
    startTime: "2023-10-24 | 14:22:10 UTC",
    slaImpact: "-14.2%"
  }
];

export const INITIAL_CAPA_ACTIONS: CAPAAction[] = [
  {
    id: "CAPA-001",
    title: "Restore redundant fiber path in Sector 4",
    status: "Completed",
    owner: "Sarah Jenkins",
    department: "Infrastructure",
    dueDate: "2023-10-24",
    priority: "High",
    description: "Deploy emergency splice crew to restore standard traffic routing paths."
  },
  {
    id: "CAPA-002",
    title: "Replace failed rack switch (RS-102)",
    status: "In Progress",
    owner: "Mark Thompson",
    department: "Network Ops",
    dueDate: "2023-10-28",
    priority: "Medium",
    description: "Procure and swap physical rack switch in Cabinet C4."
  },
  {
    id: "CAPA-003",
    title: "Emergency patch deployment for CVE-2023",
    status: "Overdue",
    owner: "Alex Rivera",
    department: "Cybersecurity",
    dueDate: "2023-10-22",
    priority: "High",
    description: "Deploy firmware update to close high-severity gateway routing vulnerability."
  },
  {
    id: "CAPA-004",
    title: "Implement IoT-based Battery Health Monitoring",
    status: "In Progress",
    owner: "Engineering Lead",
    department: "Maintenance",
    dueDate: "2023-12-15",
    priority: "Medium",
    description: "Configure telemetry logs to alert NOC on battery voltage drops."
  },
  {
    id: "CAPA-005",
    title: "Update Preventive Maintenance Schedule",
    status: "Planning",
    owner: "Diana Prince",
    department: "Operations",
    dueDate: "2023-11-30",
    priority: "Low",
    description: "Re-evaluate routine visual audits in coastal zones to offset salt erosion."
  },
  {
    id: "CAPA-006",
    title: "Deploy Redundant Signal Aggregators",
    status: "Completed",
    owner: "Chris Evans",
    department: "Infrastructure",
    dueDate: "2023-10-15",
    priority: "High",
    description: "Add hardware failover triggers for primary hub towers in South-East division."
  }
];

export const INITIAL_RCA_WORKSPACES: { [key: string]: RCAWorkspace } = {
  "RCA-9921-X": {
    incidentId: "RCA-9921-X",
    title: "Packet Drop in Southern Metro",
    qualityScore: 82,
    whys: [
      {
        index: 1,
        type: "Why 1: Problem Symptom",
        statement: "Slow 4G data",
        evidence: "Throughput_Log.csv",
        confidence: 100,
        status: "Validated"
      },
      {
        index: 2,
        type: "Why 2: Logical Link",
        statement: "Packet loss",
        evidence: "Wireshark_Trace_02.pcap",
        confidence: 95,
        status: "Validated"
      },
      {
        index: 3,
        type: "Why 3: Technical Failure",
        statement: "Microwave instability",
        evidence: "Signal_Fade_Report.pdf",
        confidence: 88,
        status: "Validated"
      },
      {
        index: 4,
        type: "Why 4: Physical Trigger",
        statement: "Power fluctuations",
        evidence: "Rectifier_Log_Oct24.log",
        confidence: 72,
        status: "Pending Peer Review"
      },
      {
        index: 5,
        type: "Why 5: Root Cause",
        statement: "Preventive maintenance failure",
        evidence: "None",
        confidence: 64,
        status: "Draft"
      }
    ]
  }
};

export const INITIAL_REPORTS = [
  {
    id: "RCA-2023-0892",
    title: "NetOps RCA Report: BGP Loop Outage",
    caseId: "RCA-2023-0892-NY",
    incidentDate: "Oct 24, 2023",
    reportDate: "Oct 27, 2023",
    leadInvestigator: "Sarah J. Chen",
    status: "Approved",
    executiveSummary: "On October 24, 2023, at 14:22 UTC, the North American East-1 regional cluster experienced a 45-minute service degradation affecting 12% of fiber backbone traffic. The incident was triggered by an automated firmware rollout to edge routers which caused a routing loop. Initial failover mechanisms were delayed by 8 minutes due to misconfigured health checks. Total service restoration was achieved at 15:07 UTC.",
    timeline: [
      { time: "14:22 UTC", title: "Incident Start", details: "Automatic deployment of patch v4.2.1-b to Zone A-12.", type: "error" },
      { time: "14:25 UTC", title: "First Alert", details: "NOC receives Critical Alarm: 'BGP Session Loss - East-1'.", type: "info" },
      { time: "14:38 UTC", title: "Diagnosis", details: "Engineering team identifies routing loop in Core Router CR-NY-01.", type: "info" },
      { time: "15:07 UTC", title: "Restoration", details: "Rollback complete. Regional traffic stabilized.", type: "success" }
    ],
    whys: [
      { num: 1, text: "Regional traffic was dropped for 45 minutes.", question: "Why? Because the core routers entered a routing loop." },
      { num: 2, text: "Core routers entered a routing loop.", question: "Why? Because firmware v4.2.1-b misconfigured the BGP distance metrics." },
      { num: 3, text: "Firmware was deployed with the wrong metrics.", question: "Why? Because the automated CI/CD pipeline script used the 'test' environment profile for 'production'." },
      { num: 4, text: "The wrong profile was used in production.", question: "Why? Because a manual override variable was left in the config file during an emergency patch 48 hours prior." },
      { num: 5, text: "Override variables weren't audited before deployment.", question: "Why? (ROOT CAUSE): There is no automated pre-flight check to validate profile consistency against the target cluster environment." }
    ],
    rootCauseStatement: {
      title: "Technical Process Gap in CI/CD Pre-Flight Validation",
      body: "The primary root cause was the lack of an environment-identity validation check in the deployment pipeline. This allowed a configuration meant for a sandboxed test cluster to be pushed to the live production backbone, resulting in incompatible routing parameters and service loss."
    },
    actionPlan: [
      { task: "Implement CI/CD Environment Identity Guard", owner: "DevOps Team", due: "Nov 10, 2023", status: "In Progress" },
      { task: "Audit all manual override flags in Git", owner: "S. Chen", due: "Oct 30, 2023", status: "Completed" },
      { task: "Updated NOC Playbook for BGP Routing Loops", owner: "NOC Leads", due: "Nov 15, 2023", status: "Pending" }
    ],
    approvers: [
      { role: "Investigator Signature", name: "Sarah J. Chen", date: "Oct 27, 2023" },
      { role: "VP Engineering Approval", name: "Marcus A. Thorne", date: "Oct 28, 2023" }
    ]
  }
];
