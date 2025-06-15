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
> **DISCLAIMER**: This software is provided "as is" without warranty of any kind. Super Basic Studio and the maintainers of Claude Conductor are not responsible for any issues, data loss, or damages that may occur from using this tool. By using Claude Conductor, you acknowledge that you run it at your own risk and take full responsibility for backing up your code and using proper version control.
> 
> ---
> 
> 💡 **Note for Vibe Coders & Open Source Newcomers:** This isn't meant to scare you away! These warnings are standard practice in open source. We're just being transparent about responsibilities - like how every tool comes with safety instructions. Follow the backup advice above and you'll be fine! 🛡️

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

# Run security checkup
npx claude-conductor checkup
npx claude-conduct checkup
npx claude-conduct checkup -p ./src  # Check specific directory
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

## CLI Commands

### Initialize Documentation (Default)
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

### Security & Health Checkup 🪄
```bash
claude-conductor checkup [options]
claude-conduct checkup [options]

Options:
  -p, --path <path>  Path to check (defaults to current directory)
  -h, --help         Display help
```

The `checkup` command generates a prompt for Claude Code to perform a security and health checkup of your codebase. It checks for:
- Exposed .env files or API keys in code
- Unsafe innerHTML usage that could lead to XSS
- Missing .gitignore entries for sensitive files
- Hardcoded credentials or secrets
- Common security anti-patterns

**Note**: This checkup is informational only and will never modify your code.

### Ultra-Safe Upgrade System 🔄

> [!WARNING]
> **⚠️ EARLY ALPHA FEATURE - USE WITH EXTREME CAUTION**
> 
> The backup/restore upgrade system is **NEW and EXPERIMENTAL**. While extensively tested, it has not been used by many users in production yet.
> 
> **BEFORE USING THE UPGRADE SYSTEM:**
> - ✅ **ALWAYS create a full backup of your entire project**
> - ✅ **Commit all changes to Git first** 
> - ✅ **Test on a copy of your project first**
> - ✅ **Have a rollback plan ready**
> 
> This feature will be marked stable after more real-world usage. **You have been warned!** 🚨

Claude Conductor features a bulletproof 3-step upgrade process that **guarantees zero data loss**:

#### Step 1: Backup Your Data
```bash
claude-conductor backup
```
- Safely backs up your `JOURNAL.md` and `CLAUDE.md` to `./conductor-backup/`
- Idempotent - safe to run multiple times
- Gracefully handles missing files

#### Step 2: Clean Installation  
```bash
claude-conductor upgrade --clean
```
- Requires `--clean` flag for safety (prevents accidental runs)
- Requires backup first (refuses to run without backup unless `--force`)
- Deletes ALL conductor files and reinstalls fresh templates
- Add `--full` to install all 12 templates

#### Step 3: Restore Your Data
```bash
claude-conductor restore
```
- Restores your backed up files exactly as they were
- Adds upgrade journal entry to document the upgrade
- Cleans up backup folder after successful restore

#### Complete Upgrade Example
```bash
# Safe upgrade process for any version
npx claude-conductor backup
npx claude-conductor upgrade --clean
npx claude-conductor restore

# Upgrade to full template set
npx claude-conductor backup
npx claude-conductor upgrade --clean --full
npx claude-conductor restore
```

#### Why This Approach?
- **Zero Risk**: Your data is physically moved out of harm's way
- **Clear Process**: "Save work → Get fresh templates → Put work back"
- **Works for Any Upgrade**: Same process for minor or major versions
- **User Confidence**: You can see your backup folder and know data is safe
- **No Complex Merging**: Avoids bugs that could corrupt your files

#### Safety Features
- **Backup validation** before each step
- **Clear error messages** for every failure scenario
- **Step-by-step guidance** with visual progress indicators
- **Edge case handling** for permissions, disk space, corrupted files
- **Comprehensive test coverage** ensuring reliability

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

## How Your Project's ARCHITECTURE.md Will Look

These are **EXAMPLES** showing how Claude Conductor populates ARCHITECTURE.md for a hypothetical React/Express project (not Claude Conductor's own dependencies):

### Example: ARCHITECTURE.md with Default Scan
```markdown
## Tech Stack
- **Language**: Node.js/npm
- **Main File**: src/index.js (234 lines)
- **Line Count**: 5,432 total lines
```

### Example: ARCHITECTURE.md with --deepscan
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

**Note**: Claude Conductor itself only uses Commander, fs-extra, glob, and chalk. The above shows what YOUR project's ARCHITECTURE.md might contain.

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

### If You Already Have a CLAUDE.md File

If Claude Conductor detects an existing CLAUDE.md file, it will preserve it and skip creating a new one. To ensure optimal integration with the Conductor framework, please manually add this section to your existing CLAUDE.md:

```markdown
## Journal Update Requirements
**IMPORTANT**: Update JOURNAL.md regularly throughout our work sessions:
- After completing any significant feature or fix
- When encountering and resolving errors
- At the end of each work session
- When making architectural decisions
- Format: What/Why/How/Issues/Result structure
```

This ensures Claude maintains a detailed development history in JOURNAL.md, which is a core feature of the Conductor framework.

**For Security Checkups**: Use the `npx claude-conduct checkup` command whenever you want to check for vulnerabilities.

## Framework Philosophy

1. **Modular > Monolithic** - Separate concerns into focused files
2. **Practical > Theoretical** - Include real examples and patterns
3. **Maintained > Stale** - Regular updates through development
4. **Navigable > Comprehensive** - Easy to find what you need

## Contributing

We welcome contributions! See our [Contributing Guide](https://superbasicstudio.github.io/claude-conductor/contributing.html) for guidelines.

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

For our full privacy policy, visit our [Privacy Policy](https://superbasicstudio.github.io/claude-conductor/privacy.html).

For terms of service, see our [Terms of Service](https://superbasicstudio.github.io/claude-conductor/terms.html).

**Super Basic Studio, LLC** is committed to developer privacy. This tool is simply a collection of markdown templates designed to help Claude Code AI assistant better understand and navigate your codebase.

## License

MIT © Super Basic Studio

---

Made with ❤️ by [Super Basic Studio](https://superbasic.studio)

Support this project on [Patreon](https://patreon.com/superbasicstudio)

## Keywords

claude, claude code, documentation, ai development, conductor, framework, claude conductor, vibe coding, super basic studio