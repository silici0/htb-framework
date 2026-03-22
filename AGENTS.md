# HTB Framework - Agent Documentation

## Overview

This document contains comprehensive information about the HTB Framework project, including its architecture, components, and usage patterns.

## Project Structure

```
htb-framework/
├── pages/                          # Next.js pages and API routes
│   ├── index.tsx                   # Main application page
│   ├── _app.tsx                    # Next.js app wrapper
│   └── api/                        # API endpoints
│       ├── generate-agent.ts       # AI agent generation
│       ├── generate-documents.ts   # Document generation
│       ├── machines.ts            # Machine data management
│       └── steps.ts               # Step management
├── src/                           # Source code
│   ├── components/                # React components
│   │   ├── MachineForm.tsx        # Machine/project creation form
│   │   ├── ProjectDashboard.tsx   # Project overview dashboard
│   │   ├── ProjectList.tsx        # List of all projects
│   │   ├── StepForm.tsx           # Step creation/editing form
│   │   ├── StepList.tsx           # List of steps in a project
│   │   └── TerminalLayout.tsx     # Terminal interface component
│   ├── types/                     # TypeScript type definitions
│   │   └── index.ts               # Main type definitions
│   └── utils/                     # Utility functions
│       ├── fileUtils.ts           # File system operations
│       └── stepUtils.ts           # Step-related utilities
├── projects/                      # Generated project directories
│   └── [project-id]/             # Individual project folders
│       ├── machine.json          # Machine information
│       ├── playbook.md           # Generated playbook
│       ├── writeup.md            # Generated writeup
│       ├── agents/               # Agent-specific documentation
│       │   ├── reconnaissance.md # Reconnaissance agent output
│       │   └── exploitation.md   # Exploitation agent output
│       ├── screenshots/          # Screenshot storage
│       └── steps/                # Step-specific files
├── public/                       # Static assets
├── Dockerfile                    # Docker container configuration
├── docker-compose.yml           # Docker Compose setup
├── package.json                 # Project dependencies
├── tsconfig.json               # TypeScript configuration
└── README.md                   # Project documentation
```

## Core Components

### 1. MachineForm Component

- **Purpose**: Creates new projects with machine information
- **Features**:
  - Form validation for machine details
  - Project ID generation
  - File structure creation
  - Integration with file system utilities

### 2. ProjectDashboard Component

- **Purpose**: Displays detailed project information
- **Features**:
  - Machine information display
  - Step progress tracking
  - Agent documentation access
  - Screenshot gallery
  - Command execution interface

### 3. StepForm Component

- **Purpose**: Manages individual steps within projects
- **Features**:
  - Step creation and editing
  - Phase categorization (Recon, Exploitation, Privilege Escalation)
  - Status tracking
  - Command and screenshot management

### 4. TerminalLayout Component

- **Purpose**: Provides terminal interface for command execution
- **Features**:
  - Real-time command execution
  - Output display and formatting
  - Command history
  - Screenshot capture integration

### 5. ProjectList Component

- **Purpose**: Displays all available projects
- **Features**:
  - Project overview
  - Quick access to project dashboards
  - Project management actions

## API Endpoints

### 1. `/api/generate-agent`

- **Purpose**: Generates AI-powered agent documentation
- **Methods**: POST
- **Parameters**:
  - `agentType`: Type of agent (reconnaissance, exploitation)
  - `machineData`: Machine information
  - `stepData`: Step-specific data
- **Returns**: Generated agent documentation

### 2. `/api/generate-documents`

- **Purpose**: Generates comprehensive project documentation
- **Methods**: POST
- **Parameters**:
  - `projectId`: Project identifier
  - `documentType`: Type of document (playbook, writeup)
- **Returns**: Generated document content

### 3. `/api/machines`

- **Purpose**: Manages machine data
- **Methods**: GET, POST, PUT, DELETE
- **Features**: CRUD operations for machine information

### 4. `/api/steps`

- **Purpose**: Manages step data
- **Methods**: GET, POST, PUT, DELETE
- **Features**: CRUD operations for step information

## Data Models

### Machine Interface

```typescript
interface Machine {
  id: string;
  name: string;
  ip: string;
  difficulty: string;
  os: string;
  points: number;
  releaseDate: string;
  creator: string;
  description: string;
  tags: string[];
}
```

### Step Interface

```typescript
interface Step {
  id: string;
  machineId: string;
  phase: "recon_enum" | "exploitation" | "privilege_escalation";
  title: string;
  description: string;
  commands: string[];
  screenshots: string[];
  status: "pending" | "in_progress" | "completed";
  createdAt: string;
  updatedAt: string;
}
```

### Project Interface

```typescript
interface Project {
  id: string;
  machine: Machine;
  steps: Step[];
  createdAt: string;
  updatedAt: string;
}
```

## File System Structure

### Project Directory Layout

```
projects/
└── [project-id]/
    ├── machine.json              # Machine information
    ├── playbook.md              # Generated playbook
    ├── writeup.md               # Generated writeup
    ├── agents/                  # Agent-specific documentation
    │   ├── reconnaissance.md    # Reconnaissance findings
    │   └── exploitation.md      # Exploitation details
    ├── screenshots/             # Screenshot storage
    │   ├── [step-id]/          # Step-specific screenshots
    │   └── [timestamp].png     # Individual screenshots
    └── steps/                   # Step-specific files
        ├── [step-id].json      # Step data
        └── [step-id].md        # Step documentation
```

## Utility Functions

### File System Utilities (`src/utils/fileUtils.ts`)

- `createProjectDirectory()`: Creates project directory structure
- `saveMachineData()`: Saves machine information to JSON
- `saveStepData()`: Saves step information to JSON
- `saveAgentData()`: Saves agent documentation
- `saveScreenshot()`: Saves and organizes screenshots
- `generateProjectId()`: Generates unique project identifiers

### Step Utilities (`src/utils/stepUtils.ts`)

- `createStep()`: Creates new step with validation
- `updateStep()`: Updates existing step information
- `deleteStep()`: Removes step and associated files
- `getStepsByPhase()`: Retrieves steps by phase
- `getStepProgress()`: Calculates project progress

## Development Setup

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn package manager
- Docker (for containerized deployment)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd htb-framework

# Install dependencies
npm install

# Start development server
npm run dev
```

### Environment Configuration

- No special environment variables required
- File system operations use relative paths
- API endpoints are configured for local development

## Usage Patterns

### Creating a New Project

1. Navigate to the main dashboard
2. Click "Create New Project"
3. Fill in machine information
4. Project directory is automatically created
5. Access project dashboard for further management

### Managing Steps

1. Navigate to project dashboard
2. Use "Add Step" button to create new steps
3. Categorize steps by phase
4. Track progress and status
5. Add commands and screenshots as needed

### Generating Documentation

1. Complete reconnaissance and exploitation steps
2. Use "Generate Agent" buttons to create documentation
3. Review and edit generated content
4. Export final documentation

### Command Execution

1. Use terminal interface in project dashboard
2. Execute commands with real-time output
3. Capture screenshots for documentation
4. Save command history for reference

## Integration Points

### AI Agent Integration

- OpenAI API integration for documentation generation
- Custom prompts for different agent types
- Template-based document generation
- Context-aware content creation

### File System Integration

- Automatic directory creation
- File organization by project and step
- Screenshot management and naming
- JSON data persistence

### Terminal Integration

- Real-time command execution
- Output formatting and display
- Command history tracking
- Screenshot capture integration

## Security Considerations

- File system operations use safe path resolution
- Input validation for all user inputs
- No sensitive data stored in plain text
- Proper error handling and logging

## Performance Optimizations

- Efficient file system operations
- Lazy loading of project data
- Optimized image handling for screenshots
- Minimal state management overhead

## Future Enhancements

- Integration with HTB API for machine data
- Advanced AI agent capabilities
- Collaboration features for team projects
- Export to multiple formats (PDF, HTML)
- Version control integration
- Cloud storage integration

## Troubleshooting

### Common Issues

1. **File permission errors**: Ensure proper file system permissions
2. **API connectivity**: Check network connectivity for AI agent generation
3. **Terminal execution**: Verify command availability in system PATH
4. **Screenshot capture**: Ensure proper image format support

### Debug Information

- Console logging for development
- Error boundaries for component failures
- File system operation logging
- API request/response logging

## Contributing

1. Follow TypeScript best practices
2. Maintain consistent component structure
3. Add appropriate type definitions
4. Include comprehensive documentation
5. Test file system operations thoroughly
6. Validate API integrations

## License

This project is licensed under the MIT License - see the LICENSE file for details.
