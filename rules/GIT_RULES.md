# Git Rules for AI Agents

These rules define how an AI assistant must commit and push code to this repository. Follow them exactly. When in doubt, stop and ask the human before committing or pushing.

---

## 1. Commit Message Format

All commits follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<optional scope>): <subject>

<optional body>

<optional footer>
```

Example:

```
feat(auth): add password reset via email

Adds a /reset-password endpoint that sends a one-time token.
Tokens expire after 30 minutes.

Closes #142
```

---

## 2. Commit Types

Always use one of these types. Never invent new ones.

| Type       | Use when…                                                        | Example                                         |
|------------|------------------------------------------------------------------|-------------------------------------------------|
| `feat`     | Adding a new feature or user-facing capability                   | `feat(cart): add discount code input`           |
| `fix`      | Fixing a bug                                                     | `fix(api): handle null user in profile route`   |
| `docs`     | Documentation only (README, comments, guides)                    | `docs: update setup instructions`               |
| `style`    | Formatting, whitespace, semicolons — no logic change             | `style: apply prettier to src/`                 |
| `refactor` | Restructuring code without changing behavior                     | `refactor(db): extract query builder`           |
| `perf`     | Improving performance                                            | `perf(search): cache index lookups`             |
| `test`     | Adding or updating tests only                                    | `test(auth): add login failure cases`           |
| `build`    | Build system or dependency changes (npm, pip, webpack, Docker)   | `build: bump react to 18.3.1`                   |
| `ci`       | CI/CD config changes (GitHub Actions, GitLab CI, etc.)           | `ci: add lint step to PR workflow`              |
| `chore`    | Maintenance that doesn't touch src or tests (configs, cleanup)   | `chore: remove unused env example`              |
| `revert`   | Reverting a previous commit                                      | `revert: feat(cart): add discount code input`   |

**Choosing between types:**
- New behavior the user can see or use → `feat`
- Something was broken and now works → `fix`
- Same behavior, cleaner code → `refactor`
- If a change fits two types, split it into two commits.

---

## 3. Subject Line Rules

- Use the **imperative mood**: "add", "fix", "remove" — not "added", "fixes", "removing".
- Start with a **lowercase** letter after the colon.
- **No period** at the end.
- Keep it **72 characters or fewer** (aim for ~50).
- Describe **what** changed, not how you felt about it.

✅ `fix(parser): handle empty input string`
❌ `Fixed the parser bug.`
❌ `fix: stuff`
❌ `feat: Updated some files and improved things`

---

## 4. Scope

- Optional, but use it when the change is limited to one area.
- Use a short, lowercase noun matching a module, folder, or feature: `auth`, `api`, `ui`, `db`, `deps`, `config`.
- Stay consistent with scopes already used in the git history (`git log --oneline` to check).

---

## 5. Body

Add a body when the change isn't obvious from the subject.

- Leave **one blank line** between subject and body.
- Wrap lines at **72 characters**.
- Explain **why** the change was made and any important side effects.
- Use bullet points (`-`) for multiple items.

---

## 6. Footer

- Reference issues: `Closes #123`, `Fixes #45`, `Refs #78`.
- Mark breaking changes (see below).
- If an AI generated the commit, add a co-author trailer when the project requires it:
  `Co-authored-by: AI Assistant <ai@example.com>`

---

## 7. Breaking Changes

Any change that breaks existing APIs, configs, or behavior must be flagged in **both** ways:

```
feat(api)!: remove v1 endpoints

BREAKING CHANGE: /api/v1/* routes are removed. Use /api/v2/* instead.
```

---

## 8. Commit Granularity

- **One logical change per commit.** Don't mix a feature, a bug fix, and formatting in one commit.
- Each commit should leave the project in a **working state** (builds and passes tests).
- Don't create noise commits like `wip`, `update`, `fix typo again` — squash them before pushing.

---

## 9. Branch Naming

Create a branch for every task. Never commit directly to `main` or `master`.

```
<type>/<short-description>
```

| Example                          | Purpose                    |
|----------------------------------|----------------------------|
| `feat/user-profile-page`         | New feature                |
| `fix/login-redirect-loop`        | Bug fix                    |
| `docs/api-reference`             | Documentation              |
| `refactor/payment-service`       | Refactor                   |
| `chore/update-dependencies`      | Maintenance                |

Use lowercase and hyphens. Include the issue number if available: `fix/142-login-redirect`.

---

## 10. Pre-Commit Checklist

Before every commit, the AI must:

1. Run `git status` and `git diff --staged` to review exactly what's being committed.
2. Stage only files related to the change — never blindly `git add .` without reviewing.
3. Run the linter and formatter if the project has them.
4. Run tests if they exist, and confirm they pass.
5. Confirm no secrets, credentials, or personal data are staged.

---

## 11. Pre-Push Checklist

Before every push:

1. `git fetch` and rebase on the latest target branch (`git pull --rebase origin main`).
2. Resolve conflicts carefully; if unsure, stop and ask the human.
3. Re-run tests after rebasing.
4. Confirm the branch name is correct (`git branch --show-current`).
5. Push with: `git push -u origin <branch-name>`

---

## 12. Forbidden Actions

The AI must **never**, unless the human explicitly asks:

- ❌ Push directly to `main`, `master`, `production`, or `release/*`.
- ❌ Use `git push --force` (if a rewrite is truly needed, use `--force-with-lease` and only on your own branch).
- ❌ Rewrite history that has already been pushed to a shared branch.
- ❌ Commit `.env`, API keys, tokens, passwords, private keys, or credentials.
- ❌ Commit build output, `node_modules/`, `__pycache__/`, `dist/`, or other files covered by `.gitignore`.
- ❌ Commit large binaries or datasets without asking.
- ❌ Skip hooks with `--no-verify`.
- ❌ Delete branches, tags, or remote refs.
- ❌ Amend or rebase commits authored by someone else.

---

## 13. Pull Requests

- PR title follows the same Conventional Commits format as the main commit.
- PR description includes:
  - **What** changed
  - **Why** it changed
  - **How to test** it
  - Linked issue(s)
- Keep PRs small and focused; split large work into multiple PRs.

---

## 14. Quick Reference

```bash
# Start work
git checkout main && git pull
git checkout -b feat/short-description

# Commit
git status
git add <specific files>
git diff --staged
git commit -m "feat(scope): short imperative summary"

# Push
git pull --rebase origin main
git push -u origin feat/short-description
```

---

## 15. When to Stop and Ask

Pause and ask the human before:

- Resolving a merge conflict you don't fully understand.
- Committing changes to files outside the task's scope.
- Any action in the **Forbidden Actions** list.
- Pushing when tests are failing.
