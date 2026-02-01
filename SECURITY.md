# Security Policy

## Supported Versions

| Version | Supported          | Node.js        |
|---------|--------------------|----------------|
| 2.x     | Yes                | >= 18.0.0      |
| 1.3.x   | Security fixes only| >= 16.0.0      |
| < 1.3   | No                 | -              |

## Reporting a Vulnerability

If you discover a security vulnerability in Claude Conductor, please report it responsibly.

### How to Report

- **Email**: Open a [GitHub Security Advisory](https://github.com/superbasicstudio/claude-conductor/security/advisories/new) (preferred)
- **Alternative**: Email the maintainers via the contact information on the [Super Basic Studio GitHub profile](https://github.com/superbasicstudio)

**Please do not open a public GitHub issue for security vulnerabilities.**

### What to Include

- Description of the vulnerability
- Steps to reproduce
- Affected versions
- Potential impact

### Response Timeline

- **Acknowledgment**: Within 48 hours
- **Initial assessment**: Within 1 week
- **Fix or mitigation**: Depends on severity
  - Critical/High: Target fix within 1 week
  - Medium: Target fix within 2 weeks
  - Low: Addressed in next scheduled release

### What Happens Next

1. We will acknowledge your report and begin investigation
2. We will work with you to understand the scope and impact
3. A fix will be developed and tested
4. A new release will be published with the fix
5. Credit will be given in the release notes (unless you prefer anonymity)

## Scope

The following are in scope for security reports:

- Command injection or arbitrary code execution via CLI inputs
- Path traversal in file operations (template copying, backup/restore)
- Dependency vulnerabilities in direct or transitive dependencies
- Prototype pollution or other JavaScript-specific attacks
- Unintended data exfiltration or network requests

The following are out of scope:

- Vulnerabilities in user-generated documentation content
- Issues requiring physical access to the machine
- Social engineering attacks
- Denial of service against local CLI usage

## Security Design Principles

Claude Conductor is designed with minimal attack surface:

- **No network requests** — The tool operates entirely offline (except for npm package installation)
- **No telemetry** — No data collection or phone-home behavior
- **Local-only file operations** — All reads and writes are scoped to the target project directory
- **No secrets handling** — The tool does not process, store, or transmit credentials
