// Types for the HackTheBox Framework application

export type Phase =
  | "recon_enum" // Reconnaissance and Scanning (Enumeration)
  | "vulnerability_analysis"
  | "exploitation"
  | "post_exploitation"
  | "privilege_escalation";

export interface Machine {
  id: string;
  name: string;
  ip: string;
  url?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Step {
  id: string;
  machineId: string;
  phase: Phase;
  title: string; // Only TITLE is mandatory
  description?: string;
  commands?: string[];
  results?: string;
  status?: "success" | "failed" | "pending";
  createdAt: Date;
  updatedAt: Date;
  screenshots?: string[];
}

export interface Agent {
  phase: Phase;
  context: string;
  successfulCommands: string[];
  failedCommands: string[];
  patterns: string[];
  createdAt: Date;
}

export interface Project {
  machine: Machine;
  steps: Step[];
  agents: Agent[];
  playbook: string;
  writeup: string;
}

// Types for UI
export interface StepFormData {
  phase: Phase;
  title: string;
  description: string;
  commands: string;
  screenshots?: File[];
  results: string;
  status: "success" | "failed" | "pending";
}

export interface MachineFormData {
  name: string;
  ip: string;
  url?: string;
}
