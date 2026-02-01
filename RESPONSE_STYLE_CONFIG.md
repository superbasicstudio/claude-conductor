# Response Style Configuration Template

This template provides optional configuration for controlling Claude's response style and confidence indicators.

## Quick Setup

Add these sections to your project's CLAUDE.md file to enable response style controls:

```markdown
## Response Style Settings
- **CONFIDENCE_INDICATORS**: enabled
- **TONE_CONTROL**: strict
```

## Configuration Options

### CONFIDENCE_INDICATORS
- `enabled` - Shows visual confidence bars with percentage
- `disabled` - No confidence indicators (default behavior)

### TONE_CONTROL  
- `strict` - Measured responses, no premature success declarations
- `normal` - Standard Claude responses (default)

## Example Implementation

### For Project CLAUDE.md:
```markdown
## Response Style Settings
- **CONFIDENCE_INDICATORS**: enabled
- **TONE_CONTROL**: strict

## Custom Guidelines
- Only use 🍺 emoji when ≥99.7% confident
- Frame responses as collaborative pair programming
- Acknowledge uncertainties and edge cases
```

### For Global ~/.claude/CLAUDE.md:
```markdown
## Response Style Settings  
- **CONFIDENCE_INDICATORS**: enabled
- **TONE_CONTROL**: strict
- **CELEBRATION_THRESHOLD**: 99.7%

## Communication Preferences
- Tone down excessive optimism on builds
- Use collaborative language instead of declarations
```

## Visual Examples

### With Configuration Enabled:
```
I've implemented the database connection fix.
Confidence: [███████░░░] 70%

The connection pooling should resolve the timeout issues, though we should test with concurrent requests to verify.
```

### Without Configuration (Default):
```
DONE! I've fixed the database connection issue. Your app should work perfectly now! 🎉
```

## Advanced Customization

You can add project-specific confidence thresholds:

```markdown
## Confidence Thresholds
- **CELEBRATION_EMOJI**: 99.7%
- **SUCCESS_DECLARATION**: 98%
- **NEEDS_TESTING_REMINDER**: <80%
```