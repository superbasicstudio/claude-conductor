# CONTRIBUTING.md

## Welcome Contributors! 👋

We're excited that you're interested in contributing to this project. This document provides guidelines and instructions for contributing.

## Code of Conduct

### Our Standards
- Be respectful and inclusive
- Welcome newcomers and help them get started
- Accept constructive criticism gracefully
- Focus on what's best for the community
- Show empathy towards other contributors

### Unacceptable Behavior
- Harassment or discriminatory language
- Personal attacks or trolling
- Publishing others' private information
- Other conduct deemed inappropriate

## Getting Started

### Prerequisites
```bash
# Required tools
- Node.js >= 16.0.0
- Git
- [Other requirements]

# Optional but recommended
- VS Code or similar editor
- [Development tools]
```

### Development Setup
```bash
# 1. Fork the repository
# 2. Clone your fork
git clone https://github.com/YOUR_USERNAME/PROJECT_NAME.git
cd PROJECT_NAME

# 3. Add upstream remote
git remote add upstream https://github.com/ORIGINAL_OWNER/PROJECT_NAME.git

# 4. Install dependencies
npm install

# 5. Create a branch
git checkout -b feature/your-feature-name

# 6. Start development server
npm run dev
```

## Development Workflow

### Branch Naming
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Test additions/updates
- `chore/` - Maintenance tasks

### Making Changes
1. **Update your fork**
   ```bash
   git fetch upstream
   git checkout main
   git merge upstream/main
   ```

2. **Create feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Make your changes**
   - Write clean, readable code
   - Follow existing patterns
   - Add tests for new features
   - Update documentation

4. **Test your changes**
   ```bash
   npm test
   npm run lint
   npm run build
   ```

## Code Style Guide

### JavaScript/TypeScript
```javascript
// Use meaningful variable names
const userEmail = 'user@example.com'; // ✅
const e = 'user@example.com'; // ❌

// Prefer const over let
const MAX_RETRIES = 3; // ✅
let MAX_RETRIES = 3; // ❌

// Use async/await over promises
async function fetchUser(id) {
  const user = await api.getUser(id); // ✅
  return user;
}

// Add JSDoc comments for functions
/**
 * Calculates the total price including tax
 * @param {number} price - Base price
 * @param {number} taxRate - Tax rate as decimal
 * @returns {number} Total price with tax
 */
function calculateTotal(price, taxRate) {
  return price * (1 + taxRate);
}
```

### File Organization
```
src/
├── components/      # Reusable components
│   ├── Button/
│   │   ├── Button.js
│   │   ├── Button.test.js
│   │   └── Button.css
├── services/        # API and external services
├── utils/          # Helper functions
├── hooks/          # Custom React hooks (if applicable)
└── types/          # TypeScript types/interfaces
```

### Naming Conventions
- **Files**: camelCase for JS/TS, PascalCase for components
- **Variables**: camelCase
- **Constants**: UPPER_SNAKE_CASE
- **Classes/Types**: PascalCase
- **CSS Classes**: kebab-case or BEM

## Commit Guidelines

### Commit Message Format
```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Code style changes (formatting, etc)
- `refactor`: Code change that neither fixes a bug nor adds a feature
- `perf`: Performance improvement
- `test`: Adding missing tests
- `chore`: Changes to build process or auxiliary tools

### Examples
```bash
# Good commit messages
feat(auth): add OAuth2 login support
fix(api): handle null response in user endpoint
docs: update installation instructions
refactor(utils): simplify date formatting logic

# Bad commit messages
fix: fixed stuff
update code
WIP
```

### Commit Best Practices
- Keep commits atomic (one logical change per commit)
- Write clear, descriptive commit messages
- Reference issues when applicable: `fixes #123`

## Pull Request Process

### Before Submitting
- [ ] Code follows style guidelines
- [ ] Self-review of code performed
- [ ] Comments added for complex logic
- [ ] Documentation updated
- [ ] Tests added/updated
- [ ] All tests passing
- [ ] Lint checks passing
- [ ] Build successful

### PR Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed

## Checklist
- [ ] My code follows the project style
- [ ] I've added tests for my changes
- [ ] I've updated documentation
- [ ] I've added changeset if needed

## Related Issues
Fixes #(issue number)

## Screenshots (if applicable)
```

### Review Process
1. Submit PR with clear description
2. Address reviewer feedback
3. Keep PR updated with main branch
4. Squash commits if requested
5. Delete branch after merge

## Testing Guidelines

### Writing Tests
```javascript
// Test file naming
- component.test.js
- service.spec.js
- utils.test.ts

// Test structure
describe('ComponentName', () => {
  describe('methodName', () => {
    it('should do something specific', () => {
      // Arrange
      const input = 'test';
      
      // Act
      const result = functionUnderTest(input);
      
      // Assert
      expect(result).toBe('expected');
    });
  });
});
```

### Test Coverage
- Aim for 80%+ coverage
- Test edge cases
- Test error scenarios
- Don't test implementation details

## Documentation

### Code Documentation
- Add JSDoc comments to public APIs
- Include examples in documentation
- Keep README up to date
- Document breaking changes

### API Documentation
```javascript
/**
 * @api {post} /users Create user
 * @apiName CreateUser
 * @apiGroup User
 * 
 * @apiParam {String} email User email
 * @apiParam {String} password User password
 * 
 * @apiSuccess {String} id User ID
 * @apiSuccess {String} email User email
 * 
 * @apiError {Object} 400 Validation error
 * @apiError {Object} 409 Email already exists
 */
```

## Release Process

### Versioning
We use [Semantic Versioning](https://semver.org/):
- MAJOR: Breaking changes
- MINOR: New features (backwards compatible)
- PATCH: Bug fixes

### Creating a Release
1. Update version in package.json
2. Update CHANGELOG.md
3. Create git tag: `git tag v1.2.3`
4. Push tag: `git push origin v1.2.3`

## Getting Help

### Resources
- [Project Documentation](./docs)
- [Issue Tracker](https://github.com/owner/repo/issues)
- [Discussions](https://github.com/owner/repo/discussions)
- [Discord/Slack Community](#)

### Asking Questions
- Search existing issues first
- Use discussions for questions
- Provide context and examples
- Be patient and respectful

## Recognition

### Contributors
All contributors are recognized in:
- README.md contributors section
- GitHub contributors page
- Release notes

### First-Time Contributors
We especially welcome first-time contributors! Look for issues labeled:
- `good first issue`
- `help wanted`
- `beginner friendly`

## Keywords <!-- #keywords -->
- contributing
- development
- workflow
- pull request
- code style
- testing