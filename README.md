<p align="center">
  <img src="https://raw.githubusercontent.com/superbasicstudio/claude-conductor/main/logo.png" alt="Claude Conductor Logo" width="120">
</p>

<h1 align="center">Claude Conductor</h1>

<p align="center">
  <em>for Claude Code command line</em>
</p>

<p align="center">
  <em>A lightweight + modular documentation framework designed for AI-assisted development with Claude Code.</em>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/claude-conductor">
    <img src="https://img.shields.io/npm/v/claude-conductor.svg" alt="npm version">
  </a>
  <a href="https://www.npmjs.com/package/claude-conductor">
    <img src="https://img.shields.io/npm/dm/claude-conductor.svg" alt="npm downloads">
  </a>
  <a href="https://github.com/superbasicstudio/claude-conductor/blob/main/LICENSE">
    <img src="https://img.shields.io/npm/l/claude-conductor.svg" alt="license">
  </a>
</p>

---

> [!IMPORTANT]
> ## ⚠️ Open Source Project Notice
> 
> **This is open source software currently maintained by ONE individual in their free time** (which isn't much at the moment! 😅)
> 
> While the code is tested thoroughly before releases to npm, you should **ALWAYS** have:
> - ✅ A proper GitHub/Git strategy in place
> - ✅ Regular backups of your work  
> - ✅ Version control before running ANY script from the internet
> 
> *Especially from someone you don't know!* 🕵️
> 
> ---
> 
> 💡 **Note for Vibe Coders & Open Source Newcomers:** This isn't meant to scare you away! It's a friendly PSA about best practices. Think of it like wearing a seatbelt - probably won't need it, but always good to have one... just in case. 🚗💥

---

Create a comprehensive, interconnected scaffolded documentation system that helps Claude Code understand and navigate your codebase more effectively, and retain better context.

## Quick Start

```bash
# Initialize with core templates (recommended)
npx claude-conductor
# Or use the shorthand
npx claude-conduct

# Initialize in a specific directory
npx claude-conductor ./my-project
npx claude-conduct /Users/thomas/projects/myapp

# Initialize with all 12 documentation templates
npx claude-conductor --full

# Force overwrite existing files
npx claude-conductor --force

# Perform deep codebase analysis (slower but more detailed)
npx claude-conductor --deepscan

# Combine path and options
npx claude-conduct ./docs --full --deepscan
```

## What It Does

Claude Conductor creates a structured documentation framework that:

- 📚 **Organizes** your project documentation into focused, interconnected modules
- 🤖 **Optimizes** for AI navigation with line numbers, anchors, and keywords
- 📝 **Tracks** development history with an auto-archiving journal system
- 🚨 **Monitors** critical errors with a dedicated error ledger
- 🔍 **Analyzes** your codebase to pre-populate documentation

## Documentation Templates

### Core Templates (Default)
- **CONDUCTOR.md** - Master navigation hub and framework reference
- **CLAUDE.md** - AI assistant guidance tailored to your project
- **ARCHITECTURE.md** - System design and tech stack
- **BUILD.md** - Build, test, and deployment commands
- **JOURNAL.md** - Development changelog (auto-created)

### Full Template Set (--full flag)
All core templates plus:
- **API.md** - API endpoints and contracts
- **CONFIG.md** - Configuration and environment variables
- **DATA_MODEL.md** - Database schema and models
- **DESIGN.md** - Visual design system
- **UIUX.md** - User interface patterns
- **TEST.md** - Testing strategies and examples
- **CONTRIBUTING.md** - Contribution guidelines
- **ERRORS.md** - Critical error tracking
- **PLAYBOOKS/DEPLOY.md** - Deployment procedures

## Installation Options

### Option 1: npx (Recommended)
```bash
npx claude-conductor
```

### Option 2: Global Install

Install globally with your preferred package manager:

```bash
# npm
npm install -g claude-conductor

# pnpm
pnpm add -g claude-conductor

# yarn
yarn global add claude-conductor

# bun
bun add -g claude-conductor
```

Once installed globally, you can run `claude-conductor` or `claude-conduct` from anywhere on your computer:

```bash
# Run from anywhere - no need to cd into the project first!
claude-conduct /path/to/your/project
claude-conduct ./my-project --full
claude-conduct ~/Documents/myapp --deepscan

# Or navigate to a project and run it there
cd /path/to/your/project
claude-conduct

# Use with optional flags and paths:
claude-conduct ./docs --full        # Create all templates in ./docs
claude-conduct ./frontend --deepscan # Deep scan the frontend directory
claude-conduct ../backend --force    # Force overwrite in parent's backend folder
```

### Option 3: Add to Project
```bash
npm install --save-dev claude-conductor
```

Add to package.json:
```json
{
  "scripts": {
    "docs:init": "claude-conductor"
  }
}
```

## Features

### 🔍 Intelligent Codebase Analysis

#### Default Analysis (Fast - 2-3 seconds)
- Detects your tech stack automatically
- Identifies main files and entry points
- Counts lines of code
- Maps directory structure

#### Deep Scan Analysis (--deepscan, 30-60 seconds)
All default features plus:
- **Framework Detection**: React, Vue, Angular, Express, Next.js versions
- **Dependency Analysis**: Lists all dependencies with versions
- **API Mapping**: Finds and documents API endpoints
- **Component Discovery**: Maps React/Vue components
- **Build Scripts**: Extracts all npm scripts
- **Database Schema**: Detects Prisma schemas, SQL files, models
- **Updates Multiple Files**: ARCHITECTURE.md and BUILD.md get detailed updates

### 📋 Modular Documentation
- Each aspect gets its own focused file
- Cross-linked for easy navigation
- Optimized for AI comprehension
- Keyword sections for searchability

### 📖 Development Journal
- Continuous changelog in JOURNAL.md
- Auto-archives when exceeding 500 lines
- Tracks major changes, bug fixes, and decisions
- Links to error tracking system

### 🚨 Error Tracking
- P0/P1 critical error ledger
- Systematic error ID format
- Links between errors and fixes
- Resolution tracking

## CLI Options

```bash
claude-conductor [options] [target-dir]

Options:
  -V, --version      Output version number
  -f, --force        Overwrite existing files
  --full             Create all 12 documentation templates
  --deepscan         Perform comprehensive codebase analysis
  --no-analyze       Skip codebase analysis
  -h, --help         Display help
```

## Example Output

After running `npx claude-conductor`, you'll have:

```
your-project/
├── CONDUCTOR.md       # Master template reference
├── CLAUDE.md          # AI guidance (customized)
├── ARCHITECTURE.md    # Tech stack documentation
├── BUILD.md          # Build instructions
└── JOURNAL.md        # Dev changelog (first entry)
```

With `--full` flag:

```
your-project/
├── CONDUCTOR.md
├── CLAUDE.md
├── ARCHITECTURE.md
├── BUILD.md
├── API.md
├── CONFIG.md
├── DATA_MODEL.md
├── DESIGN.md
├── UIUX.md
├── TEST.md
├── CONTRIBUTING.md
├── ERRORS.md
├── JOURNAL.md
└── PLAYBOOKS/
    └── DEPLOY.md
```

## Default vs Deep Scan Comparison

### ARCHITECTURE.md with Default Scan:
```markdown
## Tech Stack
- **Language**: Node.js/npm
- **Main File**: src/index.js (234 lines)
- **Line Count**: 5,432 total lines
```

### ARCHITECTURE.md with --deepscan:
```markdown
## Tech Stack
- **React 18.2.0**
- **TypeScript 5.1.6**
- **Tailwind CSS 3.3.3**
- **Express 4.18.2**

### Key Dependencies
- axios: ^1.4.0
- react-router-dom: ^6.14.2
- @reduxjs/toolkit: ^1.9.5

## API Endpoints
- POST /api/auth/login (src/routes/auth.js)
- GET /api/users/:id (src/routes/users.js)
- GET /api/posts (src/routes/posts.js)
```

## Best Practices

### Start Lean
Begin with core templates and let your documentation grow organically:
```bash
npx claude-conductor
```

### Use Deep Scan for Existing Projects
For mature codebases, use deep scan to capture comprehensive details:
```bash
npx claude-conductor --deepscan
```

### Review and Customize
After initialization:
1. Review CLAUDE.md and update the Critical Context section
2. Customize templates to match your project's needs
3. Remove sections that don't apply

### Maintain Your Journal
The JOURNAL.md file is your development history:
- Add entries for significant changes
- Document debugging sessions
- Track architectural decisions
- Link to error resolutions

### Use with Claude Code
When working with Claude Code:
1. Claude will reference your documentation automatically
2. Updates happen organically during development
3. Cross-links help Claude navigate efficiently

## 🚀 Next Steps After Installation

After running `npx claude-conductor`, your documentation templates contain placeholders. To populate them with your project details:

### Option 1: Quick Setup (Recommended)
Simply ask Claude:
```
"Please review this codebase and update the CLAUDE.md and CONDUCTOR.md files with the actual project details. Also perform a security health check and list any potential vulnerabilities or concerns (like exposed .env files, API keys in code, missing .gitignore entries, outdated dependencies with known vulnerabilities, or insecure configurations) - just list them as warnings, don't fix anything."
```

### Option 2: Comprehensive Setup
For a more thorough initialization, ask Claude:
```
"Please thoroughly review this codebase, update CLAUDE.md with project context, and use CONDUCTOR.md as a guide to fill out all the documentation files. Also check for any syntax errors, bugs, or suggestions for improvement. Additionally, perform a comprehensive security health check and list any potential vulnerabilities or concerns (like exposed .env files, API keys in code, missing .gitignore entries, outdated dependencies with known vulnerabilities, insecure configurations, or other security best practice violations) - just list them as warnings, don't fix anything."
```

### What Claude Will Do:
- ✅ Analyze your codebase structure and dependencies
- ✅ Fill in the Critical Context section with actual project details
- ✅ Update file references with real line numbers
- ✅ Populate architecture, build, and API documentation
- ✅ Create meaningful task templates based on your workflow
- ✅ Set up proper cross-linking between documents
- 🔍 **Security Health Check** (New): Scan for common vulnerabilities and security concerns
- ⚠️ **Warning List**: Flag any security issues found (without making changes)

**Note**: Claude sees the CLAUDE.md file automatically when it's in your codebase, but won't populate the templates unless asked. This one-time setup ensures your documentation is tailored to your specific project.

## Framework Philosophy

1. **Modular > Monolithic** - Separate concerns into focused files
2. **Practical > Theoretical** - Include real examples and patterns
3. **Maintained > Stale** - Regular updates through development
4. **Navigable > Comprehensive** - Easy to find what you need

## Contributing

We welcome contributions! See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## Privacy & Security

### 🔒 Your Data Stays Private

**Claude Conductor is a completely offline tool that:**
- ✅ **Never collects or transmits any data**
- ✅ **Makes zero network requests**
- ✅ **Has no analytics or telemetry**
- ✅ **Works entirely on your local machine**
- ✅ **Only reads/writes files you explicitly specify**

### What This Tool Does:
- Creates markdown documentation templates in your project
- Analyzes your local codebase structure (file names and patterns only)
- Updates documentation based on what it finds locally

### What This Tool Does NOT Do:
- ❌ Send any data to external servers
- ❌ Collect personal information
- ❌ Track usage or metrics
- ❌ Make network requests (except for package installation from npmjs)
- ❌ Access environment variables or credentials
- ❌ Execute arbitrary commands

### Website Local Storage
Our documentation website (not the CLI tool) uses browser local storage solely to:
- 💡 Remember your light/dark theme preference
- 🔒 This data never leaves your browser
- 🚫 No cookies or tracking of any kind

### Open Source Transparency
This entire codebase is open source. You can verify our privacy commitment by reviewing the source code at [github.com/superbasicstudio/claude-conductor](https://github.com/superbasicstudio/claude-conductor).

For our full privacy policy, visit [PRIVACY.md](https://github.com/superbasicstudio/claude-conductor/blob/main/PRIVACY.md).

For terms of service, see [TERMS.md](https://github.com/superbasicstudio/claude-conductor/blob/main/TERMS.md).

**Super Basic Studio, LLC** is committed to developer privacy. This tool is simply a collection of markdown templates designed to help Claude Code AI assistant better understand and navigate your codebase.

## License

MIT © Super Basic Studio

---

Made with ❤️ by [Super Basic Studio](https://superbasic.studio)

Support this project on [Patreon](https://patreon.com/superbasicstudio)

## Keywords

claude, claude code, documentation, ai development, conductor, framework, claude conductor, vibe coding, super basic studio