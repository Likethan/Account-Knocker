# Contributing to Account Knocker

Thank you for your interest in contributing to **Account Knocker**! We welcome bug reports, feature requests, documentation enhancements, and pull requests.

## Development Workflow

1. **Fork the Repository** on GitHub.
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/<your-username>/Account-Knocker.git
   cd Account-Knocker
   ```
3. **Create a Feature Branch**:
   ```bash
   git checkout -b feat/my-new-feature
   ```
4. **Follow Project Code Style**:
   - Python: Follow PEP 8 guidelines and type hints (`pydantic`, `FastAPI`).
   - TypeScript: Follow strict types, run `oxlint` before committing.
   - Commit Messages: Use [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `docs:`, `test:`, `refactor:`).

5. **Test Your Changes**:
   - Backend: run tests with `pytest`
   - Frontend: run `npm run build` and `npm run lint`

6. **Submit a Pull Request**:
   - Provide a clear description of the problem solved.
   - Link any related issue numbers.
