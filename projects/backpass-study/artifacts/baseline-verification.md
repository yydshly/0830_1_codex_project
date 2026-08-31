# Windows baseline verification

## Subject

- Upstream: `https://github.com/kunchenguid/backpass.git`
- Locked commit: `d8cbdb68ca20a9ad6626810e0c24a576e43223c7`
- Package version: `0.1.14`
- License: MIT
- Verification date: 2026-08-30

## Environment

| Item | Value |
| --- | --- |
| OS | Microsoft Windows 11 家庭版 中文版, 10.0.26200 build 26200 |
| PowerShell | 7.6.4 |
| Node.js | 22.15.0 |
| npm | 10.9.2 |
| Git | 2.42.0.windows.2 |
| `acpx` | Not installed |
| `lavish-axi` | Not installed |

## Commands and results

### 1. Reproducible upstream checkout

```powershell
pwsh -NoProfile -File .\projects\backpass-study\scripts\fetch-upstream.ps1
```

Result: passed. The checkout was detached at the locked commit. The fetch script also refuses destinations outside the study's `upstream/` directory and verifies an existing checkout's origin before reuse.

### 2. Study capability contract

```powershell
node --test .\projects\backpass-study\tests\capability-contract.test.mjs
```

Result:

```text
tests 5
pass 5
fail 0
skipped 0
```

The checks cover upstream identity, package/runtime/license metadata, the pipeline and CLI surface, evidence gates, deterministic sampling, redaction markers, guarded writes, and project Skill participation in the memory surface.

### 3. Basic CLI startup

```powershell
node .\projects\backpass-study\upstream\backpass\bin\backpass.js --version
```

Result: passed; output was `0.1.14`.

### 4. Upstream test suite

```powershell
Push-Location .\projects\backpass-study\upstream\backpass
npm test
Pop-Location
```

Result: failed on Windows.

```text
tests 356
pass 266
fail 88
skipped 2
duration 36.763 s
```

Representative failure families:

1. Test isolation changes Unix-style home variables, while Windows discovery still observes real user profile stores; fixture-only expectations then include actual local session filenames.
2. Fake `acpx` and `lavish-axi` fixtures are extensionless Unix executables. Windows `spawn` reports `ENOENT`, causing many downstream CLI, apply, synthesis and usage-accounting tests to fail before the behavior under test is reached.
3. Symlink tests fail with `EPERM` in the current Windows configuration.
4. A Pi session test builds a POSIX-style encoded directory name from a Windows path; the resulting name contains a drive colon and cannot be created.

These 88 failures are not evidence of 88 independent production defects. Many are cascades from a few platform assumptions in the test harness. They are nevertheless sufficient to reject the hypothesis that the locked revision's complete upstream suite is Windows-clean.

## Baseline judgments

| Hypothesis | Judgment | Evidence |
| --- | --- | --- |
| H1 reproducible identity/runtime/license | Supported | Checkout and 5/5 study contract tests passed |
| H2 documented pipeline exists in code | Supported for static/source contract | Required stages, commands and gates were found |
| H3/H4 runtime evidence and apply gates | Not yet fully evaluated | Upstream test cascades prevent a clean Windows result; targeted fixtures are still needed |
| H5 Windows/Codex stability | Not supported at this revision | 88 upstream failures and explicit upstream macOS/Linux-only verification boundary |
| H6/H7 outcome improvement and project isolation | Evidence insufficient | Controlled replay and multi-project fixtures have not been implemented |

## Next experiment

Create synthetic, privacy-safe Codex JSONL fixtures that cover Windows drive paths, Git remote association, parent/child task correlation and two project directories. Run discovery and evidence folding without `acpx`, then add a deterministic fake analysis response to test proposal gates independently of the external model runner.
