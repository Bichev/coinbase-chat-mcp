# Contributing to Coinbase Chat MCP

Thank you for your interest in contributing to Coinbase Chat MCP! This document provides guidelines and instructions for contributing to this project.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm 9+
- Git

### Development Setup

1. **Fork and clone the repository**
   ```bash
   git clone https://github.com/your-username/coinbase-chat-mcp.git
   cd coinbase-chat-mcp
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Start development servers**
   ```bash
   npm run dev
   ```

## 🏗️ Project Structure

```
coinbase-chat-mcp/
├── mcp-server/          # MCP Protocol Server (TypeScript)
├── api-server/          # REST API Server (Express.js)
├── frontend/            # React Frontend (Vite + TypeScript)
├── docs/                # Documentation
└── shared/              # Shared utilities (planned)
```

## 🔄 Development Workflow

### Making Changes

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Follow the existing code style and patterns
   - Write tests for new functionality
   - Update documentation as needed

3. **Test your changes**
   ```bash
   npm run test
   npm run lint
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

5. **Push and create a Pull Request**
   ```bash
   git push origin feature/your-feature-name
   ```

### Commit Message Convention

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

Examples:
```
feat: add historical price analysis tool
fix: resolve rate limiting issue in coinbase client
docs: update API documentation for new endpoints
```

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm run test

# Test specific workspace
npm run test --workspace=mcp-server
npm run test --workspace=api-server
npm run test --workspace=frontend
```

### Writing Tests

- Write unit tests for new functions and components
- Include integration tests for API endpoints
- Test MCP tool functionality
- Ensure error handling is tested

## 📝 Code Style

### TypeScript/JavaScript

- Use TypeScript for all new code
- Follow ESLint configuration
- Use meaningful variable and function names
- Add JSDoc comments for public APIs
- Prefer `const` over `let` when possible

### React Components

- Use functional components with hooks
- Implement proper TypeScript interfaces for props
- Use meaningful component and file names
- Follow React best practices

### API Design

- Follow RESTful conventions
- Use proper HTTP status codes
- Include comprehensive error handling
- Document all endpoints with OpenAPI/Swagger

## 🔧 Adding New Features

### MCP Server Features

1. **New Tools**: Add to `mcp-server/src/index.ts`
2. **New Resources**: Define resource templates and handlers
3. **New Prompts**: Create reusable prompt templates

### API Endpoints

1. **Add route**: Create new endpoint in `api-server/src/index.ts`
2. **Add Swagger docs**: Document with JSDoc comments
3. **Add validation**: Use Zod schemas for input validation
4. **Add tests**: Create integration tests

### Frontend Features

1. **New pages**: Add to `frontend/src/pages/`
2. **New components**: Add to `frontend/src/components/`
3. **API integration**: Use React Query for data fetching
4. **Styling**: Use Tailwind CSS classes

## 📋 Pull Request Guidelines

### Before Submitting

- [ ] Code follows project style guidelines
- [ ] Tests pass locally
- [ ] Documentation is updated
- [ ] Commit messages follow convention
- [ ] No merge conflicts with main branch

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing performed

## Screenshots (if applicable)
Add screenshots of UI changes

## Related Issues
Fixes #123
```

## 🐛 Reporting Issues

### Bug Reports

Include:
- Steps to reproduce
- Expected behavior
- Actual behavior
- Environment details (OS, Node.js version, etc.)
- Error messages or logs

### Feature Requests

Include:
- Problem description
- Proposed solution
- Use case examples
- Alternatives considered

## 🏷️ Release Process

1. **Version Bump**: Update version in all package.json files
2. **Changelog**: Update CHANGELOG.md with new features and fixes
3. **Tag Release**: Create git tag with version number
4. **Build**: Ensure all builds pass
5. **Deploy**: Deploy to staging for testing

## 📖 Documentation

### API Documentation

- Use Swagger/OpenAPI for REST API
- Include examples for all endpoints
- Document error responses

### MCP Documentation

- Document all tools, resources, and prompts
- Include usage examples
- Explain integration steps

### Code Documentation

- Use JSDoc for TypeScript functions
- Include README files in each workspace
- Keep documentation up to date

## 🤝 Code of Conduct

This project follows the [Contributor Covenant](https://www.contributor-covenant.org/) Code of Conduct. By participating, you agree to uphold this code.

## ❓ Questions?

- Open a [GitHub Discussion](https://github.com/your-username/coinbase-chat-mcp/discussions)
- Check existing [Issues](https://github.com/your-username/coinbase-chat-mcp/issues)
- Review the [README](./README.md) and documentation

## 🙏 Recognition

Contributors will be recognized in:
- Repository README
- Release notes
- Contributors page

Thank you for contributing to Coinbase Chat MCP! 