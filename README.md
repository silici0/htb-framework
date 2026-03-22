# HTB Framework

Framework for pentest documentation on HackTheBox with terminal-style interface.

## Features

- **Terminal Interface**: Retro style with black background and green font
- **Machine Registration**: Name, IP and optional URL
- **Project Management**: Organization by 5 main pentesting categories
- **Step Registration**: Only TITLE field is mandatory per step
- **Informative Popups**: Advanced explanations about each pentesting category
- **Automatic Documents**: Generation of agents.md, playbook.md and writeup.md
- **Local Storage**: No database, just local files
- **Docker**: Container with pentest tools

## Pentesting Categories

The framework organizes activities into 5 main categories:

1. **Reconnaissance and Scanning (Enumeration)** - Passive and active information gathering, service and port enumeration
2. **Vulnerability Analysis** - Identification and analysis of vulnerabilities in the target system
3. **Exploitation (Gaining Access)** - Exploitation attempts and initial system access
4. **Post-Exploitation (User Own)** - Access maintenance and post-compromise exploration
5. **Privilege Escalation (Root Own)** - Privilege elevation for administrative access

### Side Interface

On the left side of the interface, the 5 categories are displayed with:

- Category name
- Magnifying glass icon (?) to open popup with advanced explanation about the step in relation to pentesting
- List of registered steps for each category

### Step Registration

For each category, multiple steps can be registered with:

- **Mandatory field**: TITLE (step title)
- **Optional fields**: Description, commands, results, status, screenshots

## Installation

### Requirements

- Docker
- Node.js 18+ (optional)

### With Docker (Recommended)

```bash
# Clone the repository
git clone <repository-url>
cd htb-framework

# Start with Docker Compose
docker-compose up -d

# Access the application
http://localhost:3000
```

### Without Docker

```bash
# Install dependencies
npm install

# Start development
npm run dev

# Access the application
http://localhost:3000
```

## Usage

1. **Create Project**: Register a new machine with name, IP and URL
2. **Navigate Categories**: Use the left sidebar to access the 5 categories
3. **View Explanations**: Click the magnifying glass icon (?) for informative popups about each category
4. **Add Steps**: For each category, register steps with at least the title
5. **Organize by Categories**: Classify steps in appropriate categories
6. **Generate Documents**: Create agents.md, playbook.md and writeup.md automatically

## File Structure

```
htb-framework/
├── projects/
│   └── [machine-id]/
│       ├── machine.json
│       ├── steps/
│       │   └── [step-id].json
│       ├── screenshots/
│       ├── agents/
│       │   ├── reconnaissance.md
│       │   ├── enumeration.md
│       │   ├── vulnerability_analysis.md
│       │   ├── exploitation.md
│       │   ├── post_exploitation.md
│       │   └── privilege_escalation.md
│       ├── playbook.md
│       └── writeup.md
├── src/
│   ├── components/
│   │   ├── ProjectDashboard.tsx
│   │   ├── StepList.tsx
│   │   ├── StepForm.tsx
│   │   └── TerminalLayout.tsx
│   ├── types/
│   └── utils/
└── docs/
```

## Feature Status

⚠️ **WARNING**: Currently, some features may not be working correctly. A complete code review is necessary to ensure full system functionality.

## Useful Commands

### Docker

```bash
# View logs
docker-compose logs -f htb-framework

# Stop containers
docker-compose down

# Update images
docker-compose pull && docker-compose up -d
```

### Development

```bash
# Check types
npm run type-check

# Lint
npm run lint

# Build
npm run build
```

```bash
# Install dependencies
npm install

# Start development mode
npm run dev

# Build para produção
npm run build

# Testar
npm test
```

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## Licença

GNU General Public License v3.0 - veja o arquivo [LICENSE](LICENSE) para detalhes.

## Contato

Rafael - silici0

Projeto criado para documentação de explorações em HackTheBox.
