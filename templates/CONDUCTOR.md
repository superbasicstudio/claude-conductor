# CONDUCTOR.md

> _Read me first. Every other doc is linked below._

## Critical Context (Read First)
- **Tech Stack**: [List core technologies]
- **Main File**: [Primary code file and line count]
- **Core Mechanic**: [One-line description]
- **Key Integration**: [Important external services]
- **Platform Support**: [Deployment targets]
- **DO NOT**: [Critical things to avoid]

## Table of Contents
1. [Architecture](ARCHITECTURE.md) - Tech stack, folder structure, infrastructure
2. [Design Tokens](DESIGN.md) - Colors, typography, visual system
3. [UI/UX Patterns](UIUX.md) - Components, interactions, accessibility
4. [Runtime Config](CONFIG.md) - Environment variables, feature flags
5. [Data Model](DATA_MODEL.md) - Database schema, entities, relationships
6. [API Contracts](API.md) - Endpoints, request/response formats, auth
7. [Build & Release](BUILD.md) - Build process, deployment, CI/CD
8. [Testing Guide](TEST.md) - Test strategies, E2E scenarios, coverage
9. [Operational Playbooks](PLAYBOOKS/DEPLOY.md) - Deployment, rollback, monitoring
10. [Contributing](CONTRIBUTING.md) - Code style, PR process, conventions
11. [Error Ledger](ERRORS.md) - Critical P0/P1 error tracking

## Quick Reference
**Main Constants**: `[file:lines]` - Description  
**Core Class**: `[file:lines]` - Description  
**Key Function**: `[file:lines]` - Description  
[Include 10-15 most accessed code locations]

## Current State
- [x] Feature complete
- [ ] Feature in progress
- [ ] Feature planned
[Track active work]

## Development Workflow
[5-6 steps for common workflow]

## Task Templates
### 1. [Common Task Name]
1. Step with file:line reference
2. Step with specific action
3. Test step
4. Documentation update

[Include 3-5 templates]

## Anti-Patterns (Avoid These)
❌ **Don't [action]** - [Reason]  
[List 5-6 critical mistakes]

## Version History
- **v1.0.0** - Initial release
- **v1.1.0** - Feature added (see JOURNAL.md YYYY-MM-DD)  
[Link major versions to journal entries]

## Continuous Engineering Journal <!-- do not remove -->

Claude, keep an ever-growing changelog in [`JOURNAL.md`](JOURNAL.md).

### What to Journal
- **Major changes**: New features, significant refactors, API changes
- **Bug fixes**: What broke, why, and how it was fixed
- **Frustration points**: Problems that took multiple attempts to solve
- **Design decisions**: Why we chose one approach over another
- **Performance improvements**: Before/after metrics
- **User feedback**: Notable issues or requests
- **Learning moments**: New techniques or patterns discovered

### Journal Format
\```
## YYYY-MM-DD HH:MM

### [Short Title]
- **What**: Brief description of the change
- **Why**: Reason for the change
- **How**: Technical approach taken
- **Issues**: Any problems encountered
- **Result**: Outcome and any metrics

### [Short Title] |ERROR:ERR-YYYY-MM-DD-001|
- **What**: Critical P0/P1 error description
- **Why**: Root cause analysis
- **How**: Fix implementation
- **Issues**: Debugging challenges
- **Result**: Resolution and prevention measures
\```

### Compaction Rule
When `JOURNAL.md` exceeds **500 lines**:
1. Claude summarizes the oldest half into `JOURNAL_ARCHIVE/<year>-<month>.md`
2. Remaining entries stay in `JOURNAL.md` so the file never grows unbounded

> ⚠️ Claude must NEVER delete raw history—only move & summarize.

### 2. ARCHITECTURE.md
**Purpose**: System design, tech stack decisions, and code structure with line numbers.

**Required Elements**:
- Technology stack listing
- Directory structure diagram
- Key architectural decisions with rationale
- Component architecture with exact line numbers
- System flow diagram (ASCII art)
- Common patterns section
- Keywords for search optimization

**Line Number Format**:
\```
#### ComponentName Structure <!-- #component-anchor -->
\```typescript
// Major classes with exact line numbers
class MainClass { /* lines 100-500 */ }    // <!-- #main-class -->
class Helper { /* lines 501-600 */ }       // <!-- #helper-class -->
\```
\```

### 3. DESIGN.md
**Purpose**: Visual design system, styling, and theming documentation.

**Required Sections**:
- Typography system
- Color palette (with hex values)
- Visual effects specifications
- Character/entity design
- UI/UX component styling
- Animation system
- Mobile design considerations
- Accessibility guidelines
- Keywords section

### 4. DATA_MODEL.md
**Purpose**: Database schema, application models, and data structures.

**Required Elements**:
- Database schema (SQL)
- Application data models (TypeScript/language interfaces)
- Validation rules
- Common queries
- Data migration history
- Keywords for entities

### 5. API.md
**Purpose**: Complete API documentation with examples.

**Structure for Each Endpoint**:
\```
### Endpoint Name

\```http
METHOD /api/endpoint
\```

#### Request
\```json
{
  "field": "type"
}
\```

#### Response
\```json
{
  "field": "value"
}
\```

#### Details
- **Rate limit**: X requests per Y seconds
- **Auth**: Required/Optional
- **Notes**: Special considerations
\```

### 6. CONFIG.md
**Purpose**: Runtime configuration, environment variables, and settings.

**Required Sections**:
- Environment variables (required and optional)
- Application configuration constants
- Feature flags
- Performance tuning settings
- Security configuration
- Common patterns for configuration changes

### 7. BUILD.md
**Purpose**: Build process, deployment, and CI/CD documentation.

**Include**:
- Prerequisites
- Build commands
- CI/CD pipeline configuration
- Deployment steps
- Rollback procedures
- Troubleshooting guide

### 8. TEST.md
**Purpose**: Testing strategies, patterns, and examples.

**Sections**:
- Test stack and tools
- Running tests commands
- Test structure
- Coverage goals
- Common test patterns
- Debugging tests

### 9. UIUX.md
**Purpose**: Interaction patterns, user flows, and behavior specifications.

**Cover**:
- Input methods
- State transitions
- Component behaviors
- User flows
- Accessibility patterns
- Performance considerations

### 10. CONTRIBUTING.md
**Purpose**: Guidelines for contributors.

**Include**:
- Code of conduct
- Development setup
- Code style guide
- Commit message format
- PR process
- Common patterns

### 11. PLAYBOOKS/DEPLOY.md
**Purpose**: Step-by-step operational procedures.

**Format**:
- Pre-deployment checklist
- Deployment steps (multiple options)
- Post-deployment verification
- Rollback procedures
- Troubleshooting

### 12. ERRORS.md (Critical Error Ledger)
**Purpose**: Track and resolve P0/P1 critical errors with full traceability.

**Required Structure**:
\```
# Critical Error Ledger <!-- auto-maintained -->

## Schema
| ID | First seen | Status | Severity | Affected area | Link to fix |
|----|------------|--------|----------|---------------|-------------|

## Active Errors
[New errors added here, newest first]

## Resolved Errors
[Moved here when fixed, with links to fixes]
\```

**Error ID Format**: `ERR-YYYY-MM-DD-001` (increment for multiple per day)

**Severity Definitions**:
- **P0**: Complete outage, data loss, security breach
- **P1**: Major functionality broken, significant performance degradation
- **P2**: Minor functionality (not tracked in ERRORS.md)
- **P3**: Cosmetic issues (not tracked in ERRORS.md)

**Claude's Error Logging Process**:
1. When P0/P1 error occurs, immediately add to Active Errors
2. Create corresponding JOURNAL.md entry with details
3. When resolved:
   - Move to Resolved Errors section
   - Update status to "resolved"
   - Add commit hash and PR link
   - Add `|ERROR:<ID>|` tag to JOURNAL.md entry
   - Link back to JOURNAL entry from ERRORS.md

## Documentation Optimization Rules

### 1. Line Number Anchors
- Add exact line numbers for every class, function, and major code section
- Format: `**Class Name (Lines 100-200)**`
- Add HTML anchors: `<!-- #class-name -->`
- Update when code structure changes significantly

### 2. Quick Reference Card
- Place in CLAUDE.md after Table of Contents
- Include 10-15 most common code locations
- Format: `**Feature**: `file:lines` - Description`

### 3. Current State Tracking
- Use checkbox format in CLAUDE.md
- `- [x] Completed feature`
- `- [ ] In-progress feature`
- Update after each work session

### 4. Task Templates
- Provide 3-5 step-by-step workflows
- Include specific line numbers
- Reference files that need updating
- Add test/verification steps

### 5. Keywords Sections
- Add to each major .md file
- List alternative search terms
- Format: `## Keywords <!-- #keywords -->`
- Include synonyms and related terms

### 6. Anti-Patterns
- Use ❌ emoji for clarity
- Explain why each is problematic
- Include 5-6 critical mistakes
- Place prominently in CLAUDE.md

### 7. System Flow Diagrams
- Use ASCII art for simplicity
- Show data/control flow
- Keep visual and readable
- Place in ARCHITECTURE.md

### 8. Common Patterns
- Add to relevant docs (CONFIG.md, ARCHITECTURE.md)
- Show exact code changes needed
- Include before/after examples
- Reference specific functions

### 9. Version History
- Link to JOURNAL.md entries
- Format: `v1.0.0 - Feature (see JOURNAL.md YYYY-MM-DD)`
- Track major changes only

### 10. Cross-Linking
- Link between related sections
- Use relative paths: `[Link](./FILE.md#section)`
- Ensure bidirectional linking where appropriate

## Journal System Setup

### JOURNAL.md Structure
\```
# Engineering Journal

## YYYY-MM-DD HH:MM

### [Descriptive Title]
- **What**: Brief description of the change
- **Why**: Reason for the change
- **How**: Technical approach taken
- **Issues**: Any problems encountered
- **Result**: Outcome and any metrics

---

[Entries continue chronologically]
\```

### Journal Best Practices
1. **Entry Timing**: Add entry immediately after significant work
2. **Detail Level**: Include enough detail to understand the change months later
3. **Problem Documentation**: Especially document multi-attempt solutions
4. **Learning Moments**: Capture new techniques discovered
5. **Metrics**: Include performance improvements, time saved, etc.

### Archive Process
When JOURNAL.md exceeds 500 lines:
1. Create `JOURNAL_ARCHIVE/` directory
2. Move oldest 250 lines to `JOURNAL_ARCHIVE/YYYY-MM.md`
3. Add summary header to archive file
4. Keep recent entries in main JOURNAL.md

## Implementation Steps

### Phase 1: Initial Setup (30-60 minutes)
1. **Create CLAUDE.md** with all required sections
2. **Fill Critical Context** with 6 essential facts
3. **Create Table of Contents** with placeholder links
4. **Add Quick Reference** with top 10-15 code locations
5. **Set up Journal section** with formatting rules

### Phase 2: Core Documentation (2-4 hours)
1. **Create each .md file** from the list above
2. **Add Keywords section** to each file
3. **Cross-link between files** where relevant
4. **Add line numbers** to code references
5. **Create PLAYBOOKS/ directory** with DEPLOY.md
6. **Create ERRORS.md** with schema table

### Phase 3: Optimization (1-2 hours)
1. **Add Task Templates** to CLAUDE.md
2. **Create ASCII system flow** in ARCHITECTURE.md
3. **Add Common Patterns** sections
4. **Document Anti-Patterns**
5. **Set up Version History**

### Phase 4: First Journal Entry
Create initial JOURNAL.md entry documenting the setup:
\```
## YYYY-MM-DD HH:MM

### Documentation Framework Implementation
- **What**: Implemented CLAUDE.md modular documentation system
- **Why**: Improve AI navigation and code maintainability
- **How**: Split monolithic docs into focused modules with cross-linking
- **Issues**: None - clean implementation
- **Result**: [Number] documentation files created with full cross-referencing
\```

## Maintenance Guidelines

### Daily
- Update JOURNAL.md with significant changes
- Mark completed items in Current State
- Update line numbers if major refactoring

### Weekly
- Review and update Quick Reference section
- Check for broken cross-links
- Update Task Templates if workflows change

### Monthly
- Review Keywords sections for completeness
- Update Version History
- Check if JOURNAL.md needs archiving

### Per Release
- Update Version History in CLAUDE.md
- Create comprehensive JOURNAL.md entry
- Review all documentation for accuracy
- Update Current State checklist

## Benefits of This System

1. **AI Efficiency**: Claude can quickly navigate to exact code locations
2. **Modularity**: Easy to update specific documentation without affecting others
3. **Discoverability**: New developers/AI can quickly understand the project
4. **History Tracking**: Complete record of changes and decisions
5. **Task Automation**: Templates reduce repetitive instructions
6. **Error Prevention**: Anti-patterns prevent common mistakes