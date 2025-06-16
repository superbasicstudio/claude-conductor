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

## Anti-Patterns (Avoid These)
❌ **Don't delete journal history** - Only move & summarize when archiving
❌ **Don't create monolithic documentation** - Use modular system instead
❌ **Don't skip line number references** - Essential for AI navigation
❌ **Don't ignore error tracking** - P0/P1 errors must be logged
❌ **Don't break cross-links** - Maintain bidirectional linking

## Journal Update Requirements
**IMPORTANT**: Update JOURNAL.md regularly throughout our work sessions:
- After completing any significant feature or fix
- When encountering and resolving errors
- At the end of each work session
- When making architectural decisions
- Format: What/Why/How/Issues/Result structure

## Current State
- [x] CONDUCTOR.md template complete
- [ ] Target project identification
- [ ] Documentation modules implementation
- [ ] Journal system setup
- [ ] Error tracking implementation

## Version History
- **v1.0.0** - Initial CONDUCTOR.md template created