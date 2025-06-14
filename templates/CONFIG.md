# CONFIG.md

## Environment Variables

### Required Variables
```bash
# Application
APP_ENV=production|staging|development
APP_PORT=3000
APP_URL=https://example.com

# Database
DATABASE_URL=postgresql://user:pass@host:5432/dbname
DATABASE_POOL_SIZE=20

# Authentication
JWT_SECRET=your-secret-key-here
SESSION_SECRET=your-session-secret
```

### Optional Variables
```bash
# Features
ENABLE_FEATURE_X=true
ENABLE_BETA_FEATURES=false

# External Services
REDIS_URL=redis://localhost:6379
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=notifications@example.com
SMTP_PASS=password

# Monitoring
SENTRY_DSN=https://key@sentry.io/project
LOG_LEVEL=info|debug|error|warn

# Performance
CACHE_TTL=3600
MAX_UPLOAD_SIZE=10MB
REQUEST_TIMEOUT=30s
```

## Configuration Files

### Development
```json
// config/development.json
{
  "app": {
    "port": 3000,
    "debug": true
  },
  "database": {
    "host": "localhost",
    "logging": true
  }
}
```

### Production
```json
// config/production.json
{
  "app": {
    "port": 8080,
    "debug": false
  },
  "database": {
    "host": "prod-db.example.com",
    "logging": false
  }
}
```

## Feature Flags

### Current Flags
| Flag | Default | Description |
|------|---------|-------------|
| `NEW_UI` | false | Enable redesigned interface |
| `DARK_MODE` | true | Dark mode support |
| `API_V2` | false | Use v2 API endpoints |
| `ANALYTICS` | true | Enable analytics tracking |

### Usage
```javascript
if (config.features.NEW_UI) {
  // New UI code
}
```

## Security Configuration

### CORS Settings
```javascript
cors: {
  origin: ['https://example.com', 'https://app.example.com'],
  credentials: true,
  maxAge: 86400
}
```

### Rate Limiting
```javascript
rateLimit: {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per window
  skipSuccessfulRequests: false
}
```

## Performance Tuning

### Cache Configuration
```javascript
cache: {
  redis: {
    ttl: 3600,
    prefix: 'app:cache:'
  },
  memory: {
    max: 100,
    ttl: 600
  }
}
```

### Database Pool
```javascript
database: {
  pool: {
    min: 2,
    max: 20,
    acquireTimeout: 30000,
    idleTimeout: 10000
  }
}
```

## Common Configuration Patterns

### Loading Environment Variables
```javascript
// Using dotenv
require('dotenv').config();

// With validation
const config = {
  port: process.env.PORT || 3000,
  database: process.env.DATABASE_URL || throw new Error('DATABASE_URL required')
};
```

### Configuration by Environment
```javascript
const env = process.env.NODE_ENV || 'development';
const config = require(`./config/${env}.json`);
```

## Keywords <!-- #keywords -->
- configuration
- environment variables
- settings
- feature flags
- security