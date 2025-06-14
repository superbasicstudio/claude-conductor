# DEPLOY.md - Deployment Playbook

## Pre-Deployment Checklist

### Code Readiness
- [ ] All tests passing in CI/CD
- [ ] Code review approved
- [ ] No console errors/warnings
- [ ] Performance benchmarks met
- [ ] Security scan passed
- [ ] Documentation updated

### Communication
- [ ] Team notified of deployment window
- [ ] Customer support informed
- [ ] Status page updated (if applicable)
- [ ] Rollback plan reviewed

### Environment Checks
- [ ] Database migrations ready
- [ ] Environment variables confirmed
- [ ] Dependencies up to date
- [ ] Disk space adequate
- [ ] Backup completed

## Deployment Steps

### Option 1: Standard Deployment

```bash
# 1. Pull latest code
git checkout main
git pull origin main

# 2. Install dependencies
npm ci --production

# 3. Run database migrations
npm run migrate:up

# 4. Build application
npm run build

# 5. Run health checks
npm run health-check

# 6. Start/restart application
pm2 restart ecosystem.config.js

# 7. Verify deployment
curl https://api.example.com/health
```

### Option 2: Blue-Green Deployment

```bash
# 1. Deploy to green environment
./scripts/deploy.sh green

# 2. Run smoke tests on green
npm run test:smoke -- --env=green

# 3. Switch traffic to green
./scripts/switch-traffic.sh green

# 4. Monitor for 15 minutes
watch -n 5 'curl -s https://api.example.com/metrics'

# 5. If stable, terminate blue environment
./scripts/terminate.sh blue
```

### Option 3: Canary Deployment

```bash
# 1. Deploy canary version
kubectl set image deployment/api api=api:canary

# 2. Route 10% traffic to canary
kubectl patch virtualservice api --type merge -p '
  {"spec":{"http":[{"weight":10,"destination":{"version":"canary"}}]}}'

# 3. Monitor metrics
./scripts/monitor-canary.sh

# 4. Gradually increase traffic
# 10% -> 25% -> 50% -> 100%

# 5. Promote canary to stable
kubectl set image deployment/api api=api:stable
```

## Post-Deployment Verification

### Health Checks
```bash
# API health
curl https://api.example.com/health

# Database connectivity
npm run db:ping

# External services
npm run check:external-services

# Performance baseline
npm run perf:quick-test
```

### Monitoring Checklist
- [ ] Error rates normal
- [ ] Response times acceptable
- [ ] CPU/Memory usage stable
- [ ] No unusual log entries
- [ ] User reports monitored

### Smoke Tests
```bash
# Run critical path tests
npm run test:smoke

# Test key user flows
- User registration
- Login/logout
- Core feature functionality
- Payment processing (if applicable)
```

## Rollback Procedures

### Immediate Rollback (< 5 minutes)
```bash
# 1. Revert deployment
pm2 restart ecosystem.config.js --update-env

# OR for container deployments
kubectl rollout undo deployment/api

# 2. Verify rollback
curl https://api.example.com/version

# 3. Notify team
./scripts/notify-rollback.sh
```

### Database Rollback
```bash
# 1. Stop application
pm2 stop all

# 2. Rollback database migrations
npm run migrate:down

# 3. Deploy previous version
git checkout tags/v1.2.3
npm ci --production
npm run build

# 4. Restart application
pm2 restart ecosystem.config.js

# 5. Verify data integrity
npm run db:verify
```

### Emergency Procedures
```bash
# If complete failure:

# 1. Switch to maintenance mode
./scripts/maintenance-mode.sh on

# 2. Restore from backup
./scripts/restore-backup.sh latest

# 3. Redeploy last known good version
./scripts/emergency-deploy.sh v1.2.3

# 4. Exit maintenance mode
./scripts/maintenance-mode.sh off
```

## Troubleshooting

### Common Issues

#### Application Won't Start
```bash
# Check logs
pm2 logs api --lines 100

# Verify port availability
lsof -i :3000

# Check environment variables
pm2 env 0
```

#### Database Connection Errors
```bash
# Test connection
psql $DATABASE_URL -c "SELECT 1"

# Check connection pool
npm run db:pool-status

# Restart database connections
npm run db:reset-pool
```

#### High Memory Usage
```bash
# Check memory usage
pm2 monit

# Analyze heap dump
npm run heap-dump
npm run analyze-heap

# Restart with increased memory
pm2 restart api --max-memory-restart 2G
```

## Deployment Schedule

### Regular Deployments
- **Production**: Tuesdays & Thursdays, 2 PM UTC
- **Staging**: Daily, 10 AM UTC
- **Hotfixes**: As needed (follow emergency procedure)

### Deployment Windows
- **Preferred**: 2 PM - 4 PM UTC (lowest traffic)
- **Acceptable**: 10 AM - 6 PM UTC (weekdays)
- **Avoid**: Fridays, weekends, holidays

### Notification Timeline
- **T-24h**: Initial deployment notice
- **T-2h**: Final reminder
- **T-0**: Deployment begins
- **T+30m**: Deployment complete notification

## Contact Information

### Escalation Path
1. **On-call Engineer**: Check PagerDuty
2. **Team Lead**: @teamlead
3. **CTO**: @cto (emergencies only)

### External Contacts
- **Hosting Provider**: +1-800-XXX-XXXX
- **DNS Provider**: support@dns.example
- **CDN Support**: support@cdn.example

## Keywords <!-- #keywords -->
- deployment
- rollback
- production
- staging
- emergency
- playbook