import { Step, Phase } from "../types";

export class StepUtils {
  static getPhaseName(phase: Phase | string): string {
    switch (phase) {
      case "recon_enum":
      case "reconnaissance":
      case "enumeration":
        return "Reconnaissance and Scanning";
      case "vulnerability_analysis":
        return "Vulnerability Analysis";
      case "exploitation":
        return "Exploitation";
      case "post_exploitation":
        return "Post-Exploitation";
      case "privilege_escalation":
        return "Privilege Escalation";
      default:
        return phase;
    }
  }

  static getPhaseDescription(phase: Phase): string {
    switch (phase) {
      case "recon_enum":
        return `**Reconnaissance and Scanning (Enumeration)**

**What it is:** The initial phase of penetration testing where you gather information about the target system without directly interacting with it in a way that could alert defenders.

**Purpose:** To understand the attack surface, identify potential entry points, and collect intelligence that will guide the rest of the assessment.

**Main Points:**
- Passive reconnaissance (no direct interaction)
- Active scanning and enumeration
- Service and port identification
- Network mapping and topology discovery

**Main Techniques:**
- WHOIS lookups and DNS enumeration
- Google dorks and OSINT gathering
- Port scanning with Nmap (TCP, UDP, SYN scans)
- Service version detection and fingerprinting
- Directory enumeration with tools like Gobuster/Dirbuster
- Web application scanning with Nikto

**Obtained Results:**
- IP ranges and domain information
- Open ports and running services
- Operating system identification
- Web application structure and technologies
- Potential usernames and email addresses

**Examples:**
- Discovering that port 80/443 is open with Apache web server
- Finding hidden directories like /admin or /backup
- Identifying vulnerable services like outdated FTP servers
- Mapping the network topology and firewall rules`;
      case "vulnerability_analysis":
        return `**Vulnerability Analysis**

**What it is:** The phase where identified systems and services are analyzed for known vulnerabilities, misconfigurations, and potential security weaknesses.

**Purpose:** To prioritize and validate vulnerabilities that could be exploited, providing a clear roadmap for the exploitation phase.

**Main Points:**
- Vulnerability scanning and assessment
- Configuration review and analysis
- Version checking against vulnerability databases
- Risk assessment and prioritization

**Main Techniques:**
- Automated scanning with Nessus/OpenVAS
- Manual verification of findings
- Web application vulnerability assessment (OWASP Top 10)
- Database enumeration and injection testing
- File system and permission analysis
- Default credential checking

**Obtained Results:**
- CVE identifications and severity scores
- Misconfiguration findings
- Weak authentication mechanisms
- Unpatched software versions
- Exposed sensitive information

**Examples:**
- Finding SQL injection vulnerabilities in web forms
- Discovering default admin credentials on web panels
- Identifying unpatched Windows systems vulnerable to EternalBlue
- Locating exposed .git directories with sensitive information`;
      case "exploitation":
        return `**Exploitation (Gaining Access)**

**What it is:** The phase where identified vulnerabilities are actively exploited to gain initial access to the target system.

**Purpose:** To demonstrate that vulnerabilities can be weaponized and to establish a foothold within the target environment.

**Main Points:**
- Weaponizing identified vulnerabilities
- Gaining initial system access
- Establishing stable connections
- Bypassing basic security controls

**Main Techniques:**
- Web application exploits (SQL injection, XSS, RCE)
- Service exploitation (buffer overflows, command injection)
- Password attacks (brute force, dictionary attacks)
- Social engineering and phishing
- Wireless network attacks
- Physical access exploitation

**Obtained Results:**
- Shell access (user or system level)
- Network pivoting capabilities
- Data exfiltration channels
- Persistent access mechanisms

**Examples:**
- Exploiting a vulnerable web application to gain shell access
- Using Metasploit to exploit an unpatched service
- Cracking weak passwords to access SSH or RDP
- Gaining access through misconfigured cloud storage`;
      case "post_exploitation":
        return `**Post-Exploitation (User Own)**

**What it is:** Activities performed after gaining initial access, focusing on maintaining presence, exploring the compromised system, and expanding control within the network.

**Purpose:** To assess the impact of the compromise, maintain access for further testing, and simulate real-world attacker persistence techniques.

**Main Points:**
- Access maintenance and persistence
- Internal network reconnaissance
- Lateral movement within the network
- Data collection and analysis

**Main Techniques:**
- Installing backdoors and persistence mechanisms
- Privilege escalation attempts
- Network scanning from compromised hosts
- Password dumping and credential harvesting
- File system exploration and sensitive data location
- Process and service enumeration

**Obtained Results:**
- Additional compromised systems
- Stolen credentials and hashes
- Sensitive data and files
- Network topology from internal perspective
- System configuration and security controls

**Examples:**
- Installing a web shell for persistent access
- Using Mimikatz to dump credentials from memory
- Scanning internal network segments for additional targets
- Finding and exfiltrating sensitive database files`;
      case "privilege_escalation":
        return `**Privilege Escalation (Root Own)**

**What it is:** The process of elevating privileges from a low-privilege user account to administrative or root-level access.

**Purpose:** To demonstrate the full impact of a compromise by gaining complete control over the target system.

**Main Points:**
- Vertical privilege escalation (user to admin/root)
- Horizontal privilege escalation (user to user)
- Kernel and system-level exploits
- Configuration abuse and misconfigurations

**Main Techniques:**
- Exploiting sudo misconfigurations
- Kernel exploits and local privilege escalation
- Scheduled task abuse (cron jobs, scheduled tasks)
- SUID binary exploitation
- Windows token manipulation
- Linux capability abuse

**Obtained Results:**
- Root/administrative access
- Complete system control
- Ability to modify system files and configurations
- Full data access and manipulation capabilities

**Examples:**
- Exploiting a vulnerable sudo version for root access
- Using Dirty COW kernel exploit on Linux systems
- Abusing Windows service misconfigurations
- Leveraging Docker container escapes`;
      default:
        return "";
    }
  }

  static getPhaseColor(phase: Phase | string): string {
    // Map old phases to new ones for color consistency
    if (phase === "reconnaissance" || phase === "enumeration") {
      phase = "recon_enum";
    }

    const phaseColors: Record<string, string> = {
      recon_enum: "#3b82f6", // Blue
      vulnerability_analysis: "#ef4444", // Red
      exploitation: "#10b981", // Green
      post_exploitation: "#8b5cf6", // Purple
      privilege_escalation: "#64748b", // Gray
    };
    return phaseColors[phase] || "#64748b";
  }

  static getStatusIcon(status: Step["status"]): string {
    switch (status) {
      case "success":
        return "✅";
      case "failed":
        return "❌";
      case "pending":
        return "⏳";
      default:
        return "•";
    }
  }

  static generateStepId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  static parseCommands(commandsText: string): string[] {
    return commandsText
      .split("\n")
      .map((cmd) => cmd.trim())
      .filter((cmd) => cmd.length > 0);
  }

  static groupStepsByPhase(steps: Step[]): Record<Phase, Step[]> {
    const grouped: Record<Phase, Step[]> = {
      recon_enum: [],
      vulnerability_analysis: [],
      exploitation: [],
      post_exploitation: [],
      privilege_escalation: [],
    };

    steps.forEach((step) => {
      let phase = step.phase;

      // Ensure phase exists in grouped, fallback to recon_enum if unknown
      if (!grouped[phase as Phase]) {
        phase = "recon_enum";
      }

      grouped[phase as Phase].push(step);
    });

    return grouped;
  }

  static calculateProgress(steps: Step[]): {
    total: number;
    completed: number;
    percentage: number;
  } {
    const total = steps.length;
    const completed = steps.filter((step) => step.status === "success").length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { total, completed, percentage };
  }

  static generateAgentFromSteps(steps: Step[], phase: Phase): string {
    const phaseSteps = steps.filter((step) => step.phase === phase);

    if (phaseSteps.length === 0) {
      return `# Agent: ${this.getPhaseName(phase)}\n\nNo steps registered for this phase.\n`;
    }

    const successfulCommands = phaseSteps
      .filter((step) => step.status === "success")
      .flatMap((step) => step.commands || []);

    const failedCommands = phaseSteps
      .filter((step) => step.status === "failed")
      .flatMap((step) => step.commands || []);

    const patterns: string[] = [];

    // Detect patterns in successful commands
    if (successfulCommands.length > 0) {
      patterns.push("Successful commands identified");
    }

    if (failedCommands.length > 0) {
      patterns.push("Failed commands identified");
    }

    return `# Agent: ${this.getPhaseName(phase)}

## Description
${this.getPhaseDescription(phase)}

## Learned Context
Analysis of ${phaseSteps.length} steps in the ${this.getPhaseName(phase)} phase.

## Successful Commands
${successfulCommands.map((cmd) => `- \`${cmd}\``).join("\n") || "- None"}

## Failed Commands
${failedCommands.map((cmd) => `- \`${cmd}\``).join("\n") || "- None"}

## Identified Patterns
${patterns.map((pattern) => `- ${pattern}`).join("\n") || "- None"}

## Creation Date
${new Date().toISOString()}
`;
  }
}
