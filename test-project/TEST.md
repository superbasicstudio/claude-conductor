# TEST.md

## Testing Strategy

### Test Pyramid
```
         /\
        /  \  E2E Tests (10%)
       /----\
      /      \  Integration Tests (30%)
     /--------\
    /          \  Unit Tests (60%)
   /____________\
```

## Test Stack

### Testing Frameworks
- **Unit Tests**: [Jest/Mocha/Vitest]
- **Integration Tests**: [Testing Library/Supertest]
- **E2E Tests**: [Cypress/Playwright/Selenium]
- **Performance Tests**: [k6/Artillery]
- **Accessibility Tests**: [axe-core/Pa11y]

## Running Tests

### Commands
```bash
# Run all tests
npm test

# Run unit tests only
npm run test:unit

# Run integration tests
npm run test:integration

# Run E2E tests
npm run test:e2e

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- user.test.js

# Run tests matching pattern
npm test -- --grep "authentication"
```

## Test Structure

### Unit Test Example
```javascript
// user.test.js
describe('User Model', () => {
  describe('validation', () => {
    it('should require email', () => {
      const user = new User({ name: 'John' });
      const errors = user.validate();
      expect(errors.email).toBe('Email is required');
    });

    it('should validate email format', () => {
      const user = new User({ email: 'invalid-email' });
      const errors = user.validate();
      expect(errors.email).toBe('Invalid email format');
    });
  });

  describe('methods', () => {
    it('should hash password correctly', async () => {
      const user = new User({ password: 'secret123' });
      await user.hashPassword();
      expect(user.passwordHash).toBeDefined();
      expect(user.passwordHash).not.toBe('secret123');
    });
  });
});
```

### Integration Test Example
```javascript
// api.test.js
describe('POST /api/users', () => {
  it('should create a new user', async () => {
    const response = await request(app)
      .post('/api/users')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.email).toBe('test@example.com');
  });

  it('should return 400 for invalid data', async () => {
    const response = await request(app)
      .post('/api/users')
      .send({ email: 'invalid' });

    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
  });
});
```

### E2E Test Example
```javascript
// login.e2e.js
describe('User Login Flow', () => {
  it('should allow user to login', () => {
    cy.visit('/login');
    
    cy.get('[data-test="email-input"]')
      .type('user@example.com');
    
    cy.get('[data-test="password-input"]')
      .type('password123');
    
    cy.get('[data-test="login-button"]')
      .click();
    
    cy.url().should('include', '/dashboard');
    cy.contains('Welcome back!').should('be.visible');
  });
});
```

## Test Patterns

### Setup and Teardown
```javascript
beforeAll(async () => {
  // Global setup
  await db.connect();
});

beforeEach(async () => {
  // Reset database state
  await db.seed();
});

afterEach(async () => {
  // Clean up
  await db.clear();
});

afterAll(async () => {
  // Global cleanup
  await db.disconnect();
});
```

### Test Data Factories
```javascript
// factories/user.factory.js
const createUser = (overrides = {}) => ({
  id: faker.datatype.uuid(),
  email: faker.internet.email(),
  name: faker.name.fullName(),
  createdAt: new Date(),
  ...overrides
});

// Usage
const testUser = createUser({ email: 'test@example.com' });
```

### Mocking
```javascript
// Mock external services
jest.mock('../services/email');

// Mock implementation
emailService.send.mockImplementation(() => 
  Promise.resolve({ messageId: '123' })
);

// Verify calls
expect(emailService.send).toHaveBeenCalledWith({
  to: 'user@example.com',
  subject: 'Welcome!'
});
```

## Coverage Goals

### Minimum Coverage Targets
```
Statements: 80%
Branches: 75%
Functions: 80%
Lines: 80%
```

### Coverage Report
```bash
----------------------|---------|----------|---------|---------|
File                  | % Stmts | % Branch | % Funcs | % Lines |
----------------------|---------|----------|---------|---------|
All files             |   85.71 |    82.35 |   88.89 |   85.71 |
 src/                 |     100 |      100 |     100 |     100 |
  index.js            |     100 |      100 |     100 |     100 |
 src/models/          |   83.33 |       75 |   85.71 |   83.33 |
  user.js             |   83.33 |       75 |   85.71 |   83.33 |
 src/services/        |   85.71 |    83.33 |   88.89 |   85.71 |
  auth.js             |   85.71 |    83.33 |   88.89 |   85.71 |
----------------------|---------|----------|---------|---------|
```

## Common Test Scenarios

### Authentication Tests
- Valid login
- Invalid credentials
- Account lockout
- Password reset
- Token expiration
- Session management

### API Tests
- CRUD operations
- Validation errors
- Authentication required
- Rate limiting
- Pagination
- Filtering/sorting

### UI Tests
- Form submission
- Navigation flows
- Error states
- Loading states
- Responsive behavior
- Accessibility

## Debugging Tests

### Debug Commands
```bash
# Run tests in debug mode
node --inspect-brk ./node_modules/.bin/jest --runInBand

# Run single test with console output
npm test -- --verbose user.test.js

# Show full error details
npm test -- --no-coverage --verbose
```

### Common Issues
1. **Flaky Tests**: Use explicit waits, mock time
2. **Database State**: Reset between tests
3. **Async Issues**: Always await async operations
4. **Mock Leaks**: Clear mocks in afterEach

## Performance Testing

### Load Test Example
```javascript
// k6 script
import http from 'k6/http';
import { check } from 'k6';

export let options = {
  vus: 100, // 100 virtual users
  duration: '30s',
};

export default function() {
  let response = http.get('https://api.example.com/users');
  check(response, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });
}
```

## Keywords <!-- #keywords -->
- testing
- unit tests
- integration tests
- e2e tests
- coverage
- mocking