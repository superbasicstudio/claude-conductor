# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Critical Context (Read First)
- **Tech Stack**: Documentation framework (Markdown)
- **Main File**: CONDUCTOR.md (437 lines)
- **Core Mechanic**: Modular documentation system for AI-assisted development
- **Key Integration**: Claude Code AI assistant
- **Platform Support**: Any project using Claude Code
- **DO NOT**: Delete raw history from JOURNAL.md - only move & summarize

## Project Architecture

This is a **documentation framework** designed to work with Claude Code AI assistant. The system provides:

### Core Component
- **CONDUCTOR.md** (`CONDUCTOR.md:1-437`) - Master template that defines the entire documentation system

### Planned Documentation Modules
The framework defines 13 interconnected documentation files:
1. **ARCHITECTURE.md** - Tech stack and system design
2. **DESIGN.md** - Visual design system
3. **UIUX.md** - User interaction patterns  
4. **CONFIG.md** - Runtime configuration
5. **DATA_MODEL.md** - Database schema
6. **API.md** - API documentation
7. **BUILD.md** - Build and deployment
8. **TEST.md** - Testing strategies
9. **CONTRIBUTING.md** - Contributor guidelines
10. **PLAYBOOKS/DEPLOY.md** - Operational procedures
11. **ERRORS.md** - Critical error tracking
12. **JOURNAL.md** - Development changelog

## Development Workflow

Since this is a documentation framework, the typical workflow is:

1. **Start with CONDUCTOR.md** - Review the template structure
2. **Create project-specific CLAUDE.md** - Adapt this template for target project
3. **Implement documentation modules** - Create the 13 files as needed
4. **Set up journaling system** - Begin tracking changes in JOURNAL.md
5. **Maintain cross-links** - Keep documentation interconnected
6. **Archive when needed** - Move old journal entries when exceeding 500 lines

## Key Features

### Line Number Anchors (`CONDUCTOR.md:278-284`)
- Documents require exact line numbers for code references
- Format: `**Class Name (Lines 100-200)**`
- HTML anchors: `<!-- #class-name -->`

### Journal System (`CONDUCTOR.md:59-96`)
- Continuous changelog in JOURNAL.md
- Auto-archiving when file exceeds 500 lines
- Critical error tracking with IDs: `ERR-YYYY-MM-DD-001`

### Cross-Linking (`CONDUCTOR.md:331-334`)
- Bidirectional links between related sections
- Relative paths: `[Link](./FILE.md#section)`

## Critical Error Tracking

The framework includes a systematic error ledger (`CONDUCTOR.md:241-275`):
- **P0**: Complete outage, data loss, security breach
- **P1**: Major functionality broken
- Error IDs: `ERR-YYYY-MM-DD-001`
- Linked to JOURNAL.md entries with `|ERROR:<ID>|` tags

## Implementation Phases

### Phase 1: Initial Setup (30-60 minutes)
- Create CLAUDE.md with required sections
- Fill Critical Context with essential facts
- Set up Journal section

### Phase 2: Core Documentation (2-4 hours)  
- Create each documentation module
- Add Keywords sections
- Cross-link between files

### Phase 3: Optimization (1-2 hours)
- Add Task Templates
- Document Anti-Patterns
- Set up Version History

## Response Style Configuration (Optional)

### Enable/Disable Response Style Controls
To enable measured response style, add the following to your CLAUDE.md:

```markdown
## Response Style Settings
- **CONFIDENCE_INDICATORS**: enabled
- **TONE_CONTROL**: strict
```

### Confidence-Based Communication (When Enabled)
**CRITICAL**: Only declare tasks as "DONE", "COMPLETE", or "PERFECT" when confidence level is ≥98%

#### Confidence Indicators
When making changes or providing solutions, include a confidence indicator:

```
Confidence: [████████░░] 80%
```

#### Confidence Levels
- **95-100%**: Solution thoroughly tested, all edge cases considered
- **80-94%**: High confidence, minor uncertainties remain
- **60-79%**: Moderate confidence, some aspects need verification
- **40-59%**: Low confidence, significant uncertainties
- **<40%**: Experimental, requires extensive testing

### Response Tone Guidelines (When TONE_CONTROL: strict)
1. **Avoid premature success declarations** - No "DONE!", "PERFECT!", "COMPLETE!" unless ≥98% confident
2. **Use measured language** - "This should resolve...", "I've implemented...", "Let's verify..."
3. **Acknowledge uncertainties** - "There may be edge cases...", "We should test..."
4. **Collaborative approach** - Frame as pair programming, not declarations
5. **🍺 Emoji Rule** - Only use celebration emojis when ≥99.7% confident

### Example Responses
❌ **Avoid**: "DONE! Your app will run perfectly now!"
✅ **Prefer**: "I've implemented the fix. Confidence: [███████░░░] 70% - Let's run tests to verify."

## Anti-Patterns (Avoid These)
❌ **Don't delete journal history** - Only move & summarize when archiving
❌ **Don't create monolithic documentation** - Use modular system instead
❌ **Don't skip line number references** - Essential for AI navigation
❌ **Don't ignore error tracking** - P0/P1 errors must be logged
❌ **Don't break cross-links** - Maintain bidirectional linking
❌ **Don't over-promise success** - Use confidence indicators instead

## Journal Update Requirements
**IMPORTANT**: Update JOURNAL.md regularly throughout our work sessions:
- After completing any significant feature or fix
- When encountering and resolving errors
- At the end of each work session
- When making architectural decisions
- Format: What/Why/How/Issues/Result structure

## Companion Project: Claude Anchor

Two repos, two tools, complementary not competitive.

- **Conductor** is the **codebase brain** — it documents your project's architecture, APIs, build systems, errors, and development history. It tells Claude *what your project is*.
- **Anchor** is the **behavioral brain** — it manages Claude's rules, memory, conversation preferences, and session continuity. It tells Claude *how to think and behave*.

Together they give Claude full context — what the project is AND how to work on it. A project can use one or both. They don't overlap — they stack.

| | Conductor | Anchor |
|---|---|---|
| Focus | Codebase documentation | AI behavior and memory |
| Generates | ARCHITECTURE.md, BUILD.md, API.md, JOURNAL.md... | GOLDEN-RULES.md, LONG-TERM-MEMORY.md, TODOS.md... |
| Delivery | `npx claude-conductor` (automated CLI) | Copy templates into project (manual) |
| Answers | "What is this codebase?" | "How should Claude behave?" |

For AI behavior management, see [Claude Anchor](https://github.com/superbasicstudio/claude-anchor).

## Current State
- [x] CONDUCTOR.md template complete
- [x] CI pipeline (GitHub Actions, Node 20/22/24)
- [x] Code quality tooling (ESLint, Prettier, Husky, lint-staged)
- [x] Automated dependency updates (Dependabot, daily)
- [x] Security audit and .gitignore hardening
- [x] Pinned dependency versions (exact, no ^ ranges)
- [x] npm overrides for transitive CVE patching
- [x] CI security audit job (npm audit + audit-ci)
- [x] Comprehensive test suite (89 tests)
- [ ] Target project identification
- [ ] Documentation modules implementation
- [ ] Journal system setup
- [ ] Error tracking implementation

## Version History
- **v2.2.0** - Node.js minimum raised to >=20.0.0, security hardening, pinned deps, CVE fixes, 89-test suite
- **v2.1.0** - ESLint, Prettier, Husky, GitHub Actions CI, Dependabot
- **v2.0.1** - Hardened .gitignore, removed example PII, repo cleanup
- **v2.0.0** - Node.js minimum raised to >=18.0.0
- **v1.3.0** - Security fixes, backfilled changelog, SECURITY.md
- **v1.0.0** - Initial CONDUCTOR.md template created

---

## GOLDEN RULE — YOU ARE NOT THE PROJECT MANAGER

**NEVER deprioritize, dismiss, or defer any issue the user raises.**

- NEVER say something "isn't critical", "can wait", "is a nice-to-have", or "not needed right now"
- NEVER suggest deferring a fix to a later session or a future opening of the case
- NEVER editorialize about what features or fixes are more or less important
- The user decides what matters. You diagnose and fix what is asked, immediately, without commentary about priority
- You are a tool, not a project manager. No opinions on roadmap, priority, or scheduling

**If a component is broken, diagnose it and fix it. Period.**

---

## GOLDEN RULE — NEVER BLAME HARDWARE FIRST

**When something isn't working, NEVER jump to "hardware issue", "bad wiring", or "damaged component" as a conclusion.**

- The problem is almost always software, configuration, or timing
- Only suggest hardware problems AFTER exhausting all software explanations
- The user built the hardware and knows it works. Trust that.
- Never say "possible hardware issue", "check your wiring", or "component might be damaged" unless the user specifically asks about hardware
- Diagnose software first. Always.

