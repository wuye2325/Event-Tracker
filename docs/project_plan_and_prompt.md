请了解我的项目 README.md

我正在迭代一个功能 debate.md

update-comment-0518.html 讨论结构图还不是我理想中的 ui 形式，请查看我给的截图，这是 kialo 手机端网页的 ui 界面，请查看上方的可视化的树状图来呈现讨论结构（类似向下展开的思维导图），这个可视化结构图就在页面中（不需要点击“查看”才可以看）。。。每个节点点击后，下方的讨论卡片就显示对应的信息卡片

我希望你能从产品角度再优化完善一下我的实现方案，然后生成 to do list，以便于一步步实现这个原型设计。。

另外，你的 to do list 中需要考虑用什么方式实现，原型 html 页面的可维护行，一个文件中的代码行数不要太多，不然 ai 大模型吃不消。



# 详细待办事项 (To-Do List)

我们已经完成了初步的准备工作，包括创建了用于讨论树的 CSS 和 JS 文件（assets/discussion-tree.css ；assets/discussion-tree.js），并将它们引入了主 HTML 文件中 update-comment-0518.html 。同时，也在 HTML 中预留了树状图的容器位置。

接下来是具体的实现步骤：

## To-Do List: 实现 Kialo 风格的可视化讨论树

1. 完善 assets/discussion-tree.css 样式
   
   - 目标 ：实现类似 Kialo 的层级清晰、可交互的树状图视觉效果。
   - 具体任务 ：
     - 设计节点（ tree-node ）样式：包括背景色、边框、圆角、内边距、字体等。
     - 设计激活节点（ tree-node.active ）的突出显示样式。
     - 实现节点间的连接线样式（可以使用伪元素 ::before , ::after 或者 SVG）。
     - 确保树状图在不同层级下有清晰的缩进和视觉区分。
     - 考虑响应式设计，确保在小屏幕上也能良好显示。
     - 添加展开/折叠子节点的图标（例如 + / - 或箭头）。

2. 增强 assets/discussion-tree.js 脚本功能
   
   - 目标 ：实现树状图的动态渲染、交互逻辑和与论点列表的联动。
   - 具体任务 ：
     - 数据转换 ：
       - 修改 sampleTreeData 或设计新的函数，使其能够从现有的 allArguments 数据（在 comment.js 中定义）转换成树状图需要的数据结构。每个节点应包含 id , title (简化的论点内容或用户昵称+标签), parentId , children (子节点ID列表), 以及原始论点数据 data 。
       - title 的生成逻辑需要仔细考虑，以便在树节点上简洁地展示论点核心信息。
     - 树的渲染 ( renderTree 和 renderTreeNode ) ：
       - 修改 renderTreeNode 以生成更丰富的 HTML 结构，而不仅仅是文本。节点内部可以包含一个小的图标（代表论点类型，如支持/反对）和简短的标题。
       - 实现点击节点展开/折叠子节点的逻辑。可以在节点数据中添加 isExpanded 状态。
       - 确保 renderTree 能正确处理根节点和子节点的递归渲染。
     - 与论点列表联动 ( updateArgumentList ) ：
       - 当点击树状图中的节点时， updateArgumentList 函数需要：
         - 获取被点击节点的 id 。
         - 根据 id 从 allArguments (或转换后的树数据) 中找到对应的论点数据。
         - 清空当前的 #argument-list 容器。
         - 显示当前选中节点的详细信息 ：如果选中的节点本身代表一个具体论点（而不仅仅是一个分类或父主题），则应将该论点的完整卡片渲染到 #argument-list 中。
         - 显示子论点列表 ：获取并渲染该节点所有直接子论点的卡片到 #argument-list 中。
         - 复用或参考 comment.js 中现有的 displayArguments 和 createArgumentCardHTML (或类似函数) 来生成论点卡片。
     - 面包屑导航更新 ( updateBreadcrumbs ) ：
       - 确保面包屑导航在点击树节点后能正确更新，反映当前的层级路径。
       - 点击面包屑中的链接，应能反向更新树状图的选中状态和论点列表的显示。
     - 初始化 ：
       - 在 DOMContentLoaded 中，确保从 comment.js 或全局获取 allArguments 数据，并用其初始化和渲染树状图。
       - 默认选中主议题或第一个主论点，并加载其对应的论点卡片。
3. 调整 update-comment-0518.html 结构与现有 comment.js 的兼容性
   
   - 目标 ：确保新的树状图逻辑与页面现有评论功能和谐共存。
   - 具体任务 ：
     - 数据共享/传递 ：
       - 思考 allArguments 数据如何在 comment.js 和 discussion-tree.js 之间共享。可以考虑将其提升为全局变量（简单但不推荐），或者通过事件、回调函数传递。更稳妥的方式可能是 discussion-tree.js 提供一个初始化函数，由 comment.js 在其数据准备好后调用，并将数据传入。
     - 移除或改造旧的结构图逻辑 ：
       - comment.js 中与旧的“查看结构图”按钮（ view-structure-button ）和相关的模态框（ viewStructureModal ）的逻辑可以被移除或大幅简化，因为树状图现在是常驻的。
       - generateTreeHTML 函数可能不再需要，或者其逻辑可以被新的 renderTreeNode 替代。
     - 发表新论点/回应的交互 ：
       - 当用户通过“发表新论点”按钮或在某个论点下“添加回应”后，新的论点数据需要被添加到 allArguments 中。
       - 之后，需要重新渲染或更新树状图以反映新增的节点。
       - 同时，论点列表和面包屑也需要相应更新。
4. 代码组织与可维护性
   
   - 目标 ：保持代码清晰，易于理解和修改。
   - 具体任务 ：
     - 模块化 ：尽量将功能拆分成小的、独立的函数。
     - 注释 ：为关键的函数和逻辑添加清晰的注释。
     - CSS 模块化 ： discussion-tree.css 只包含树状图相关的样式。通用样式仍在 styles.css 或 comment.css 。
     - JS 分离 ： discussion-tree.js 专注于树的逻辑， comment.js 专注于论点卡片渲染、数据管理、表单交互等。它们之间通过明确的接口（函数调用、事件）通信。
     - 避免过长的文件 ：如果 discussion-tree.js 变得非常复杂，可以考虑将其内部逻辑进一步拆分（例如，树的渲染逻辑、数据处理逻辑、事件处理逻辑等可以分别组织）。但对于原型阶段，一个文件通常是可接受的，只要内部结构清晰。
     
下一步行动建议：

我建议我们从 步骤 1（完善 CSS 样式） 和 步骤 2（增强 JS 脚本功能中的数据转换和初步渲染） 开始。这样可以先让一个基本的、静态的树状图显示出来，然后再逐步添加交互和联动。

如果你同意，我可以先为你生成 assets/discussion-tree.css 的基础样式代码，以及 assets/discussion-tree.js 中数据结构和基础渲染函数的骨架。

## 四、给大模型的任务提示词模板

你好！我们正在进行一个名为“事件脉络追踪”的微信小程序的产品迭代项目。
当前任务核心目标：
当前项目阶段/已完成工作：我们已经完成了初步的准备工作，包括创建了用于讨论树的 CSS 和 JS 文件（assets/discussion-tree.css ；assets/discussion-tree.js），并将它们引入了主 HTML 文件中 update-comment-0518.html 。同时，也在 HTML 中预留了树状图的容器位置。

请你协助我完成以下工作：

请确保你的输出符合上述要求，特别是代码部分可以直接运行和使用。感谢！


产品角度优化与核心思路：
树状图直接可见性：
目的：让用户无需额外操作即可看到整个讨论的结构，降低理解门槛。
实现：将原先通过按钮触发的模态框中的树状图，直接嵌入到主页面特定位置（例如，面包屑导航下方，"发表新论点"按钮上方）。
Kialo 式树状图渲染：
目的：提供清晰、直观、层级分明的讨论结构可视化。Kialo 的截图显示的是一种每层节点水平展开，整体垂直向下的布局。
实现：
节点：使用简单的矩形框代表每个论点。节点背景色/边框颜色可以根据论点类型（如 PRD 中定义的“支持”、“反对”）进行区分，呼应 Kialo 截图中的颜色区分（例如绿色代表支持，红色代表反对）。
布局：
根节点（主议题）位于最上方。
其直接子论点在其下方水平排列。
每个子论点下的孙论点，同样在其父节点下方水平排列。
PRD 中提到最多3层观点嵌套，这会使可视化相对简洁。
连接线：使用简单的直线连接父节点和子节点。
技术选型：优先考虑使用 HTML 结构（如嵌套 div) 结合 Tailwind CSS (或自定义 CSS in assets/css/discussion-tree.css) 的 Flexbox/Grid 布局来实现。连接线是最具挑战性的部分，可以尝试使用 CSS 伪元素 (::before, ::after) 或细长的 div 元素来模拟。如果纯 CSS 过于复杂，可以考虑使用 JavaScript 动态生成 SVG 元素来绘制更精确的线条，但这会增加复杂度。对于原型阶段，以 HTML/CSS 为主，简化连接线可能是个好起点。
交互性：
目的：实现树状图与下方论点列表的联动。
实现：
点击树状图中的任一节点：
该节点在树状图中高亮显示（例如，改变边框或背景）。
下方的论点列表（div#argument-list）更新，仅显示被点击节点的直接子论点。这可以复用你现有的 displayArguments(parentId) 逻辑。
面包屑导航 (div.breadcrumb-nav) 更新，以反映当前在树状结构中的路径。
代码可维护性与模块化：
目的：避免单个 HTML 文件过于臃肿，方便 AI 理解和后续迭代。
实现：
将 update-comment-0518.html 中与结构化讨论相关的 JavaScript 逻辑（目前在 <script> 标签内）剥离到外部文件 assets/js/structured-discussion.js 中。
所有与新树状图相关的 CSS 样式集中到 assets/css/discussion-tree.css 文件中（需要新建）。

To-Do List:
Phase 1: 结构调整与核心树状图展示
修改 @update-comment-0518.html 页面布局：
移除旧的树状图入口：删除触发“查看结构图”模态框的按钮（在你的 JS 中可能是 elements.viewStructureButton）以及对应的 viewStructureModal HTML 结构 (id viewStructureModal 的 div)。
嵌入树状图容器：确保 div#discussion-tree-container (在 @update-comment-0518.html 中 L90) 是直接可见的，并调整其在页面中的位置，建议放在面包屑导航 (.breadcrumb-nav) 之下，"发表新论点"按钮 (#add-main-argument-button) 之上。
创建/更新 assets/js/structured-discussion.js：
迁移现有逻辑：将 update-comment-0518.html 中 <script> 标签内 (约 L765 至 L1141) 的所有 JavaScript 代码（包括 argumentsData 初始化、renderArgumentCard, displayArguments, renderBreadcrumb, 模态框处理等）移动到此新文件中。
HTML 引用脚本：在 @update-comment-0518.html 的 </body> 前添加 <script src="assets/js/structured-discussion.js" defer></script>。
新的树状图渲染函数 renderVisualTree(data, containerElement, parentId = null)：
此函数将负责在 div#discussion-tree-container 中生成 Kialo 风格的树状图。
输入：论点数据 argumentsData，树容器 DOM 元素，当前要渲染节点的 parentId。
输出：在容器中动态创建 HTML 元素（例如，每个节点一个 div.tree-visual-node，内含节点信息；子节点容器 div.node-children-container）。
节点内容：每个可视树节点至少应显示论点类型（如“支持”、“反对”，可通过不同颜色/图标表示）和简短的论点摘要。可以给每个节点添加 data-arg-id 属性，值为其论点 ID。
布局逻辑：使用嵌套的 div 和 CSS Flexbox/Grid 实现。例如，一个父节点下，其子节点们通过一个 flex 容器水平排列。
递归生成：函数应递归调用自身来渲染子节点，直到达到最大层级（PRD 中定义为3层）或没有更多子节点。
更新 assets/css/discussion-tree.css 样式：
节点样式 (.tree-visual-node)：定义节点的宽度、高度、内边距、边框、背景色（根据论点类型，可复用 tagClasses 的颜色定义）、文字样式等。
布局样式：
.node-children-container：使用 Flexbox 使子节点水平排列并居中。
整体树的对齐和间距。
连接线样式：这是挑战点。
CSS 方案：尝试使用父节点的伪元素 (::before / ::after) 绘制向下的垂直线，再用子节点（或其容器）的伪元素绘制连接到父节点的水平短线或连接到父节点垂直线的“T”型结构。这对于固定层级的树可能相对容易些。
对于原型，如果CSS连接线过于复杂，可以先保证节点正确布局和交互，连接线可以简化或暂时省略。
高亮样式 (.tree-visual-node.selected)：为被选中的树节点定义一个独特的视觉样式（例如，更粗的边框或不同的背景色）。


Phase 2: 交互实现与细化
实现树状图节点交互 (在 assets/js/structured-discussion.js 中)：
事件委托：在 div#discussion-tree-container 上添加点击事件监听器，捕获对 .tree-visual-node 的点击。
点击处理逻辑：
获取被点击节点的 data-arg-id。
移除其他所有树节点的 .selected 类，给当前点击的节点添加 .selected 类。
调用 displayArguments(clickedArgId) 更新下方的论点卡片列表。
调用 renderBreadcrumb() 更新面包屑导航。需要调整 currentBreadcrumb 的构建逻辑，使其能根据树节点的点击正确生成路径。
初始化渲染：页面加载时，调用 renderVisualTree 渲染整个树，并默认展示主议题下的第一层子论点列表。
确保论点添加流程的兼容性：
当用户通过“发表新论点”或“发表新回应”按钮（已通过 openAddArgumentModal 函数处理）添加新论点后：
新论点数据应正确添加到 argumentsData 数组中。
重新渲染树状图 (renderVisualTree) 以包含新节点。
更新下方的论点列表 (displayArguments)。


Phase 3: 测试与优化
测试：
在 iPhone 13 mini 尺寸下测试显示效果和交互。
测试不同层级论点的点击和内容更新。
测试添加新论点后的刷新。
优化（可选，根据原型需求）：
如果树在小屏幕上过宽，考虑容器的 overflow-x: auto 允许水平滚动。
优化连接线的视觉效果。