# 👑 Roo Commander：一个用于 Roo Code 的高级多智能体框架

Roo Commander 通过实施一个复杂的框架，使用结构化的 **多智能体方法** 来管理软件开发项目，从而改变您的 [Roo Code](https://github.com/roocode/roo) 体验。想象一下，在您的 VS Code 工作区中拥有一个虚拟的、专业的软件团队，由 👑 Roo Commander 协调，以处理具有特定专业知识的任务并维护清晰的项目历史记录。

---

**🐾 加入社区：** [Roo Commander Discord](https://discord.gg/f77YYF3S)

---

## Roo Commander 是什么？

Roo Commander 不仅仅是模式的集合；它是一个构建在 Roo Code 之上的 **具有明确主张的工作流和项目管理系统**。它通过以下方式解决了复杂项目和 LLM 上下文限制的挑战：

*   **专业角色：** 将任务分配给具有特定专业知识的 AI 智能体（模式）（例如，React、API 设计、Git、AWS、测试）。
*   **结构化沟通：** 使用定义的任务委派和报告系统。
*   **持久化上下文：** 利用结构化的项目日志（`.ruru/tasks/`、`.ruru/decisions/` 等）和标准化的文档格式（TOML+Markdown）来有效维护状态和历史记录。
*   **标准化流程：** 为常见的开发活动定义可重用的工作流和程序。

目标是将结构、一致性、可追溯性和专业 AI 技能的力量带入您的开发过程。

## 为什么使用 Roo Commander？

*   **🧠 专业知识：** 将任务委派给合适的 AI 专家（例如，让 `framework-react` 模式处理 React 代码，而不是通用模式）。
*   **🏗️ 结构化工作流：** 使用定义的系统（MDTM）将复杂目标分解为可管理、可跟踪的任务。
*   **💾 增强的上下文管理：** 通过结构化日志记录和专用的上下文检索智能体来缓解 LLM 上下文窗口限制。
*   **🔍 可追溯性与可审计性：** 在您的项目存储库中创建清晰的任务、决策（ADR）和操作历史记录。
*   **⚙️ 一致性：** 促进一致的项目结构、文档格式和开发流程。
*   **🚀 自动化潜力：** 结构化的特性使得复杂开发序列的自动化更加可靠。

## 核心概念

理解这些概念是有效使用 Roo Commander 的关键：

1.  **多智能体系统（“团队”）：**
    *   **层级结构：** 模式大致分为以下角色：Commander（协调）、Managers（规划）、Leads（领域监督）、Agents（支持）和 Specialists（执行）。
    *   **委派：** Commander 分析用户目标，并使用 `new_task` 工具将任务委派给最合适的 Manager、Lead 或 Specialist 模式。
    *   **（有关当前构建中的角色列表，请参阅 `.ruru/modes/roo-commander/kb/kb-available-modes-summary.md`）。**

2.  **结构化项目工件（TOML+Markdown）：**
    *   **标准文件夹：** 对特定工件类型使用隐藏文件夹，如 `.ruru/tasks`、`.ruru/decisions`、`.ruru/docs`、`.ruru/context`、`.ruru/workflows`、`.ruru/processes`。（请参阅 `.roo/rules/02-workspace-default-folders.md`）。
    *   **TOML+MD 格式：** 在任务和 ADR 等文件中，将机器可读的 TOML 元数据（用于状态、ID、标签等）与人类可读的 Markdown 内容相结合。确保一致性并促进自动化。（请参阅 `.roo/rules/01-standard-toml-md-format.md`）。

3.  **知识库（KB）与规则：**
    *   **规则 (`.roo/rules-/`)：** 定义每个模式的核心操作逻辑、标准程序和触发器。加载到 AI 的上下文中。
    *   **知识库 (`.ruru/modes/<slug>/kb/`)：** 包含特定于模式的详细参考信息、复杂程序、模板和示例。根据规则*按需*查找。这在上下文大小和详细知识访问之间取得了平衡。

## 主要特性

*   **👑 中央协调器：** Roo Commander 协调工作流并委派任务。
*   **🚦 项目引导：** 用于初始化新项目或分析现有项目的简化流程。
*   **📋 任务管理（MDTM）：** 使用 `.ruru/tasks/` 中的 TOML+Markdown 文件进行结构化任务跟踪。
*   **📖 上下文管理：** 专用的智能体（`agent-context-resolver`、`agent-context-condenser`）帮助管理和总结项目信息。
*   **🛠️ 专业模式：** 涵盖各种框架（React、Vue、Angular、Next.js、Laravel、Django、FastAPI 等）、云平台（AWS、Azure、GCP）、数据库（SQL、NoSQL）、设计工具（Tailwind、MUI、Bootstrap）、测试、DevOps、安全和实用工具的广泛模式。
*   **📝 决策记录（ADR）：** 在 `.ruru/decisions/` 中记录重要架构决策的正式流程。
*   **🧩 标准化工作流与流程：** 在 `.ruru/workflows/` 和 `.ruru/processes/` 中的可重用定义。

## 开始使用（安装）

**先决条件：** 您需要安装 [Roo Code](https://marketplace.visualstudio.com/items?itemName=RooCode.roo-code) VS Code 扩展。

推荐的安装方法是使用预构建的发布版本：

1.  **下载：** 前往 [GitHub 项目构建] [[最新发布链接](https://github.com/jezweb/roo-commander/tree/main/.builds)] 目录，下载最新的 `roo-commander-vX.Y.Z-Codename.zip` 文件。（*当前版本：`roo-commander-v7.0.6-Wallaby.zip`*）
2.  **解压：** 将内容直接解压到您的 VS Code 项目工作区的 **根目录**。这是包含您的代码、`.git` 目录（如果适用）等的顶级文件夹。
3.  **重新加载 VS Code：** 重新加载 VS Code 窗口（`Ctrl+Shift+P` 或 `Cmd+Shift+P` -> "Developer: Reload Window"）以确保 Roo Code 识别新的模式配置。

这将添加/覆盖必要的隐藏配置文件夹（`.ruru/modes`、`.roo`、`.ruru/templates` 等）和文件（`.roomodes`）。

## 基本用法

1.  **激活 Commander：** 在 Roo Code 聊天界面中选择“👑 Roo Commander”模式。
2.  **陈述您的目标：** 告诉 Commander 您想实现什么（例如，“开始规划一个使用 FastAPI 的新 Python API”，“根据 .docs/designs/login.md 中的设计实现登录 UI”，“修复任务 BUG-123 中描述的错误”）。
3.  **交互：** 跟随 Commander 的引导。它可能会：
    *   提出澄清问题。
    *   提出计划或工作流。
    *   将任务委派给专业模式（使用 `<new_task>`）。
    *   就步骤或结果征求您的批准或反馈。
4.  **审查：** 检查模式创建/修改的文件，尤其是 `.ruru/tasks/` 目录中的文件，以了解进度和详细信息。

## 贡献

*（可选：如果您欢迎贡献，请添加指南）*

## 许可证

本项目根据 MIT 许可证授权 - 有关详细信息，请参阅 [LICENSE](./LICENSE) 文件。

---

指挥您的虚拟团队，构建卓越的应用！