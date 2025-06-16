# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Privacy policy link in README
- Patreon support link for donations
- Comprehensive installation instructions for npm, pnpm, yarn, and bun
- CONTRIBUTING.md with contribution guidelines
- CHANGELOG.md for tracking version history
- PRIVACY.md and TERMS.md for legal clarity
- `claude-conduct` shorthand command alias for quicker usage

### Changed
- Updated README subtitle to emphasize lightweight and modular nature
- Clarified network request policy (allowing npm package installation)
- Updated footer links to point to superbasic.studio website

## [1.0.1] - 2025-01-06

### Added
- Deep scan feature (`--deepscan` flag) for comprehensive codebase analysis
- Framework detection (React, Vue, Angular, Express, Next.js)
- Dependency analysis with version information
- API endpoint discovery and documentation
- Component mapping for React/Vue projects
- Database schema detection (Prisma, SQL files)
- Security audit improvements
- Logo and branding assets

### Changed
- Enhanced codebase analysis with more detailed tech stack detection
- Improved BUILD.md template with discovered npm scripts
- Better ARCHITECTURE.md population with framework-specific details

### Security
- Added privacy policy and security commitments
- Confirmed zero network requests (except npm installation)
- No telemetry or data collection

## [1.0.0] - 2025-01-05

### Added
- Initial release of Claude Conductor
- Core documentation templates (CONDUCTOR.md, CLAUDE.md, ARCHITECTURE.md, BUILD.md)
- Full template set with `--full` flag (13 documentation files)
- Intelligent codebase analysis
- Auto-creation of JOURNAL.md with first entry
- Line number anchoring system
- Cross-linking between documentation files
- Error tracking system with P0/P1 classifications
- CLI with options for force overwrite and custom directories

### Features
- Modular documentation framework
- AI-optimized navigation with keywords and anchors
- Development journal with auto-archiving at 500 lines
- Critical error ledger
- Support for multiple package managers (npm, npx, yarn, pnpm, bun)

[Unreleased]: https://github.com/superbasicstudio/claude-conductor/compare/v1.0.1...HEAD
[1.0.1]: https://github.com/superbasicstudio/claude-conductor/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/superbasicstudio/claude-conductor/releases/tag/v1.0.0