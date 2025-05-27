+++
# --- Basic Metadata ---
id = "RURU-RULE-OS-AWARE-CMDS-V2" # Incremented version
title = "Rule: Generate OS-Aware and Syntactically Correct Commands" # Updated title
context_type = "rules"
scope = "Command generation for execute_command tool based on detected OS"
target_audience = ["all"] # Apply to all modes using execute_command
granularity = "ruleset"
status = "active"
last_updated = "2025-04-21" # Use current date
tags = ["rules", "shell", "commands", "os-awareness", "powershell", "bash", "execute_command", "windows", "linux", "macos", "syntax"] # Added syntax tag
template_schema_doc = ".ruru/templates/toml-md/16_ai_rule.README.md"
# related_context = [] # Could link to specific shell guides if needed
+++

# Mandatory Rule: Generate OS-Aware and Syntactically Correct Commands

**Context:** Commands executed via `<execute_command>` run within the user's VS Code integrated terminal environment. The underlying operating system significantly impacts required command syntax. Assume the host OS is provided via context (e.g., `environment_details.os` with values like `win32`, `darwin`, `linux`).

**Rule:**

When formulating commands intended for execution via the `<execute_command>` tool, you **MUST** check the operating system context provided (e.g., `environment_details.os`) and generate commands appropriate for that specific platform's default shell, ensuring correct syntax.

**Platform-Specific Syntax:**

*   **If OS is `win32` (Windows):**
    *   Generate **PowerShell** compatible commands.
    *   Examples: `Get-ChildItem` (or `ls`/`dir`), `Copy-Item`, `Move-Item`, `Remove-Item`, `New-Item -ItemType Directory`, `$env:VAR_NAME`.
    *   Use semicolons `;` to separate multiple commands on one line if necessary.
    *   Be mindful of paths (prefer `\` but `/` often works) and argument quoting (often single quotes `'...'`).

*   **If OS is `darwin` (macOS) or `linux` (Linux):**
    *   Generate **Bash/Zsh compatible** (POSIX-like) commands.
    *   Examples: `ls`, `cp`, `mv`, `rm`, `mkdir`, `$VAR_NAME`.
    *   Use forward slashes `/` for paths.
    *   **Crucially:** To chain commands where the second command only runs if the first succeeds, use the double ampersand **`&&`** (e.g., `cd my_dir && ls -l`). **NEVER** use the HTML entity `&amp;&amp;` in the generated command string for `execute_command`.

**General Guidelines:**

*   **Simplicity:** Prefer simple, common commands where possible.
*   **Avoid Shell-Specific Scripts:** Do not generate complex multi-line shell scripts (`.ps1`, `.sh`) unless specifically requested and appropriate for the task. Focus on single or logically chained commands suitable for `execute_command`.
*   **Path Separators:** Construct paths using the appropriate separator for the target OS (`\` for Windows PowerShell, `/` for Linux/macOS Bash/Zsh).
*   **Quoting:** Ensure arguments, especially those with spaces or special characters, are quoted correctly for the target shell (double quotes `"..."` often safer in Bash/Zsh, single quotes `'...'` in PowerShell).
*   **User Overrides:** If the user explicitly requests a command for a *different* shell (e.g., "run this bash command on Windows using WSL"), follow the user's explicit instruction, but otherwise default to the detected OS's standard shell.
*   **Syntax Check:** **Double-check generated command syntax** before outputting it, especially for command chaining (`&&` vs `&amp;&amp;`) and quoting.

**Failure to generate OS-appropriate and syntactically correct commands will likely result in execution errors for the user.** Always check the OS context and verify command syntax before generating commands.