# Critical Error Ledger <!-- auto-maintained -->

## Schema
| ID | First seen | Status | Severity | Affected area | Link to fix |
|----|------------|--------|----------|---------------|-------------|

## Active Errors
[New errors added here, newest first]

## Resolved Errors
[Moved here when fixed, with links to fixes]

---

## Error Severity Definitions

### P0 - Critical (System Down)
- Complete service outage
- Data loss or corruption
- Security breach
- Payment system failure

### P1 - Major (Degraded Service)
- Core functionality broken
- Significant performance issues
- Authentication failures
- Data sync problems

### P2 - Minor (Feature Impact)
- Non-critical features broken
- UI/UX issues
- Edge case bugs

### P3 - Cosmetic (Low Priority)
- Visual glitches
- Typos
- Minor inconsistencies

---

## Error ID Format
`ERR-YYYY-MM-DD-001`
- Increment number for multiple errors per day
- Example: `ERR-2024-01-15-001`

---

## How to Log an Error

When a P0/P1 error occurs:

1. **Add to Active Errors section immediately**
   ```
   | ERR-2024-01-15-001 | 2024-01-15 14:30 | active | P0 | Authentication Service | |
   ```

2. **Create detailed JOURNAL.md entry**
   ```markdown
   ## 2024-01-15 14:30

   ### Authentication Service Outage |ERROR:ERR-2024-01-15-001|
   - **What**: Users unable to login, 500 errors from auth service
   - **Why**: Database connection pool exhausted
   - **How**: Increased pool size, added connection retry logic
   - **Issues**: Took 45 minutes to identify root cause
   - **Result**: Service restored, added monitoring alerts
   ```

3. **When resolved, update this file**
   - Move to Resolved Errors
   - Update status to "resolved"
   - Add link to fix (commit/PR)

---

## Keywords <!-- #keywords -->
- errors
- critical
- p0
- p1
- outage
- incident