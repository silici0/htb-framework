import fs from "fs-extra";
import path from "path";
import { Machine, Step, Agent, Project } from "../types";

// Verifica se estamos no ambiente do servidor
const isServer = typeof window === "undefined";

const PROJECTS_DIR = path.join(process.cwd(), "projects");

export class FileUtils {
  static ensureProjectsDir() {
    fs.ensureDirSync(PROJECTS_DIR);
  }

  static getProjectPath(machineId: string): string {
    return path.join(PROJECTS_DIR, machineId);
  }

  static getMachinePath(machineId: string): string {
    return path.join(this.getProjectPath(machineId), "machine.json");
  }

  static getStepsDir(machineId: string): string {
    return path.join(this.getProjectPath(machineId), "steps");
  }

  static getStepPath(machineId: string, stepId: string): string {
    return path.join(this.getStepsDir(machineId), `${stepId}.json`);
  }

  static getScreenshotsDir(machineId: string): string {
    return path.join(this.getProjectPath(machineId), "screenshots");
  }

  static getAgentsDir(machineId: string): string {
    return path.join(this.getProjectPath(machineId), "agents");
  }

  static getAgentPath(machineId: string, phase: string): string {
    return path.join(this.getAgentsDir(machineId), `${phase}.md`);
  }

  static getPlaybookPath(machineId: string): string {
    return path.join(this.getProjectPath(machineId), "playbook.md");
  }

  static getWriteupPath(machineId: string): string {
    return path.join(this.getProjectPath(machineId), "writeup.md");
  }

  static getConclusionPath(machineId: string): string {
    return path.join(this.getProjectPath(machineId), "conclusion.txt");
  }

  static writeFileSync(filePath: string, content: string) {
    fs.writeFileSync(filePath, content, "utf8");
  }

  // Machine operations
  static saveMachine(machine: Machine): void {
    this.ensureProjectsDir();
    const projectPath = this.getProjectPath(machine.id);
    fs.ensureDirSync(projectPath);
    fs.ensureDirSync(this.getStepsDir(machine.id));
    fs.ensureDirSync(this.getScreenshotsDir(machine.id));
    fs.ensureDirSync(this.getAgentsDir(machine.id));

    fs.writeJsonSync(this.getMachinePath(machine.id), machine, { spaces: 2 });
  }

  static loadMachine(machineId: string): Machine | null {
    const machinePath = this.getMachinePath(machineId);
    if (!fs.existsSync(machinePath)) {
      return null;
    }
    const machine = fs.readJsonSync(machinePath);
    // Convert date strings back to Date objects
    if (machine.createdAt) machine.createdAt = new Date(machine.createdAt);
    if (machine.updatedAt) machine.updatedAt = new Date(machine.updatedAt);
    return machine;
  }

  static listMachines(): Machine[] {
    this.ensureProjectsDir();
    const machines: Machine[] = [];

    const dirs = fs.readdirSync(PROJECTS_DIR);
    dirs.forEach((dir) => {
      const machine = this.loadMachine(dir);
      if (machine) {
        machines.push(machine);
      }
    });

    return machines.sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
    );
  }

  // Step operations
  static saveStep(step: Step): void {
    fs.writeJsonSync(this.getStepPath(step.machineId, step.id), step, {
      spaces: 2,
    });
  }

  static loadStep(machineId: string, stepId: string): Step | null {
    const stepPath = this.getStepPath(machineId, stepId);
    if (!fs.existsSync(stepPath)) {
      return null;
    }
    const step = fs.readJsonSync(stepPath);
    // Convert date strings back to Date objects
    if (step.createdAt) step.createdAt = new Date(step.createdAt);
    if (step.updatedAt) step.updatedAt = new Date(step.updatedAt);
    return step;
  }

  static listSteps(machineId: string): Step[] {
    const stepsDir = this.getStepsDir(machineId);
    if (!fs.existsSync(stepsDir)) {
      return [];
    }

    const steps: Step[] = [];
    const files = fs.readdirSync(stepsDir);

    files.forEach((file) => {
      if (file.endsWith(".json")) {
        const step = this.loadStep(machineId, file.replace(".json", ""));
        if (step) {
          steps.push(step);
        }
      }
    });

    return steps.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }

  // Agent operations
  static saveAgent(machineId: string, agent: Agent): void {
    const agentPath = this.getAgentPath(machineId, agent.phase);
    const content = this.generateAgentContent(agent);
    fs.writeFileSync(agentPath, content);
  }

  static generateAgentContent(agent: Agent): string {
    return `# Agent: ${agent.phase}

## Learned Context
${agent.context}

## Successful Commands
${agent.successfulCommands.map((cmd) => `- \`${cmd}\``).join("\n")}

## Failed Commands
${agent.failedCommands.map((cmd) => `- \`${cmd}\``).join("\n")}

## Identified Patterns
${agent.patterns.map((pattern) => `- ${pattern}`).join("\n")}

## Creation Date
${agent.createdAt.toISOString()}
`;
  }

  // Conclusion operations
  static saveConclusion(machineId: string, conclusion: string): void {
    const conclusionPath = this.getConclusionPath(machineId);
    fs.writeFileSync(conclusionPath, conclusion, "utf8");
  }

  static loadConclusion(machineId: string): string {
    const conclusionPath = this.getConclusionPath(machineId);
    if (!fs.existsSync(conclusionPath)) {
      return "";
    }
    return fs.readFileSync(conclusionPath, "utf8");
  }

  // Document operations
  static generatePlaybook(machineId: string): string {
    const machine = this.loadMachine(machineId);
    const steps = this.listSteps(machineId);

    if (!machine) {
      throw new Error("Machine not found");
    }

    // Normalize phase names: map old names to new ones
    const normalizedSteps = steps.map((step) => {
      let normalizedPhase: any = step.phase;
      if (
        normalizedPhase === "reconnaissance" ||
        normalizedPhase === "enumeration"
      ) {
        normalizedPhase = "recon_enum";
      }
      return { ...step, phase: normalizedPhase };
    });

    const phases = [
      "recon_enum",
      "vulnerability_analysis",
      "exploitation",
      "post_exploitation",
      "privilege_escalation",
    ];

    let content = `# Playbook: ${machine.name}\n\n`;
    content += `**IP:** ${machine.ip}\n`;
    content += `**URL:** ${machine.url || "N/A"}\n`;
    content += `**Start Date:** ${machine.createdAt.toISOString()}\n\n`;

    phases.forEach((phase) => {
      const phaseSteps = normalizedSteps.filter((step) => step.phase === phase);
      if (phaseSteps.length > 0) {
        content += `## ${this.getPhaseName(phase)}\n\n`;

        phaseSteps.forEach((step, index) => {
          content += `### Step ${index + 1}: ${step.title}\n`;
          content += `**Status:** ${step.status === "success" ? "✅ Success" : step.status === "failed" ? "❌ Failed" : "⏳ Pending"}\n\n`;
          content += `**Description:**\n${step.description}\n\n`;

          if (step.commands?.length && step.commands?.length > 0) {
            content += `**Commands:**\n\`\`\`\n${step.commands.join("\n")}\n\`\`\`\n\n`;
          }

          if (step.results) {
            content += `**Results:**\n\`\`\`\n${step.results}\n\`\`\`\n\n`;
          }

          content += "---\n\n";
        });
      }
    });

    return content;
  }

  static generateWriteup(machineId: string): string {
    const machine = this.loadMachine(machineId);
    const steps = this.listSteps(machineId);
    const conclusion = this.loadConclusion(machineId);

    if (!machine) {
      throw new Error("Machine not found");
    }

    // Normalize phase names: map old names to new ones
    const normalizedSteps = steps.map((step) => {
      let normalizedPhase: any = step.phase;
      if (
        normalizedPhase === "reconnaissance" ||
        normalizedPhase === "enumeration"
      ) {
        normalizedPhase = "recon_enum";
      }
      return { ...step, phase: normalizedPhase };
    });

    let content = `# Write-up: ${machine.name}\n\n`;
    content += `**IP:** ${machine.ip}\n`;
    content += `**URL:** ${machine.url || "N/A"}\n`;
    content += `**Completion Date:** ${new Date().toISOString()}\n\n`;

    content += `## Summary\n\n`;
    content += `This write-up documents the exploitation of the machine ${machine.name} (${machine.ip}).\n\n`;

    content += `## Methodology\n\n`;

    const phases = [
      "recon_enum",
      "vulnerability_analysis",
      "exploitation",
      "post_exploitation",
      "privilege_escalation",
    ];

    phases.forEach((phase) => {
      const phaseSteps = normalizedSteps.filter((step) => step.phase === phase);
      if (phaseSteps.length > 0) {
        content += `### ${this.getPhaseName(phase)}\n\n`;

        phaseSteps.forEach((step, index) => {
          content += `#### Step ${index + 1}: ${step.title}\n`;
          content += `${step.description}\n\n`;

          if (step.commands && step.commands.length > 0) {
            content += `**Command used:**\n\`\`\`\n${step.commands.join("\n")}\n\`\`\`\n\n`;
          }

          if (step.screenshots && step.screenshots.length > 0) {
            content += `**Screenshots:**\n`;
            step.screenshots.forEach((screenshot, imgIndex) => {
              content += `![Screenshot ${imgIndex + 1}](${screenshot})\n\n`;
            });
          }

          if (step.results) {
            content += `**Result:**\n${step.results}\n\n`;
          }
        });
      }
    });

    content += `## Conclusion\n\n`;
    if (conclusion) {
      content += `${conclusion}\n`;
    } else {
      content += `The machine ${machine.name} was successfully compromised using the techniques described above.\n`;
    }

    return content;
  }

  static getPhaseName(phase: string): string {
    const phaseNames: Record<string, string> = {
      reconnaissance: "Reconnaissance",
      enumeration: "Enumeration",
      vulnerability_analysis: "Vulnerability Analysis",
      exploitation: "Exploitation",
      post_exploitation: "Post-Exploitation",
      privilege_escalation: "Privilege Escalation",
    };
    return phaseNames[phase] || phase;
  }
}
