// 结构化讨论区核心逻辑
// 迁移自 update-comment-0518.html <script> 标签
// 包含：数据初始化、论点渲染、面包屑、添加论点、树状图生成、事件监听等

document.addEventListener('DOMContentLoaded', () => {
    // 1. 论点数据初始化
    let argumentsData = [
        {
            id: 'arg1', parentId: null, user: { name: '业主张三', avatar: 'https://randomuser.me/api/portraits/men/35.jpg' }, timestamp: '2小时前', content: '我非常支持安装电瓶车门禁！能有效规范停车，减少乱停放现象，对小区的整体安全和美观都有好处。', tag: '支持', upvotes: 25, downvotes: 2, replyCount: 1,
        },
        { id: 'arg1_1', parentId: 'arg1', user: { name: '物业小李', avatar: 'https://randomuser.me/api/portraits/men/36.jpg' }, timestamp: '1小时前', content: '感谢张三业主的积极反馈，我们正在收集各方意见。', tag: '澄清', upvotes: 10, downvotes: 0, replyCount: 0 },
        {
            id: 'arg2', parentId: null, user: { name: '居民李女士', avatar: 'https://randomuser.me/api/portraits/women/60.jpg' }, timestamp: '1小时前', content: '坚决反对！我家有两辆电瓶车，来客人了怎么办？高峰期会不会堵在门口？物业有考虑过这些实际问题吗？', tag: '反对', upvotes: 5, downvotes: 18, replyCount: 2,
        },
        { id: 'arg2_1', parentId: 'arg2', user: { name: '访客赵先生', avatar: 'https://randomuser.me/api/portraits/men/40.jpg' }, timestamp: '30分钟前', content: '确实，访客停车是个问题，希望能有临时解决方案。', tag: '担忧', upvotes: 15, downvotes: 1, replyCount: 1 },
        { id: 'arg2_1_1', parentId: 'arg2_1', user: { name: '物业小陈', avatar: 'https://randomuser.me/api/portraits/men/11.jpg' }, timestamp: '10分钟前', content: '针对访客问题，我们计划设置临时二维码扫描进入，每次有效2小时。', tag: '建议', upvotes: 5, downvotes: 0, replyCount: 0 },
        { id: 'arg2_2', parentId: 'arg2', user: { name: '业主王芳', avatar: 'https://randomuser.me/api/portraits/women/41.jpg' }, timestamp: '20分钟前', content: '关于高峰期拥堵，可以考虑错峰进入或者加宽入口。', tag: '建议', upvotes: 8, downvotes: 0, replyCount: 0 },
        {
            id: 'arg3', parentId: null, user: { name: '好奇的王大爷', avatar: 'https://randomuser.me/api/portraits/men/42.jpg' }, timestamp: '45分钟前', content: '这个门禁系统具体是什么牌子的？识别率高不高？如果坏了维修响应快吗？费用是谁出？', tag: '提问', upvotes: 10, downvotes: 0, replyCount: 1,
        },
        { id: 'arg3_1', parentId: 'arg3', user: { name: '物业小陈', avatar: 'https://randomuser.me/api/portraits/men/11.jpg' }, timestamp: '20分钟前', content: '针对王大爷的提问：我们选用的门禁系统是XX品牌，识别率99.5%，有24小时维保。首次安装费用由公共维修基金支出，后续维护从业委会划拨。', tag: '澄清', upvotes: 8, downvotes: 0, replyCount: 0 },
        {
            id: 'arg4', parentId: null, user: { name: '热心邻居周姐', avatar: 'https://randomuser.me/api/portraits/women/7.jpg' }, timestamp: '30分钟前', content: '我建议在门禁旁边设置一个临时访客通道，并由保安手动登记，这样既能管理也能兼顾临时需求。另外，可以对多车家庭提供第二辆车半价的月卡优惠。', tag: '建议', upvotes: 22, downvotes: 1, replyCount: 0,
        },
        {
            id: 'arg5', parentId: null, user: { name: '信息通小赵', avatar: 'https://randomuser.me/api/portraits/women/25.jpg' }, timestamp: '15分钟前', content: '我查了一下，隔壁XX小区去年就装了类似的系统，据说效果还不错，初期有些小问题，后面都解决了。他们当时还公示了费用明细。', tag: '补充信息', upvotes: 12, downvotes: 0, replyCount: 0,
        },
        {
            id: 'arg6', parentId: null, user: { name: '老刘师傅', avatar: 'https://randomuser.me/api/portraits/men/50.jpg' }, timestamp: '10分钟前', content: '我担心这个门禁系统会不会影响消防车的进出？紧急情况下能保证快速开启吗？安全第一啊！', tag: '担忧', upvotes: 30, downvotes: 0, replyCount: 0,
        },
        {
            id: 'arg7', parentId: null, user: { name: '路过的观察员', avatar: 'https://randomuser.me/api/portraits/women/33.jpg' }, timestamp: '5分钟前', content: '这个事情讨论得挺激烈。任何方案都有利有弊，关键看怎么权衡和后续管理。期待最终的方案能让大多数人满意。', tag: '中立/观察', upvotes: 3, downvotes: 0, replyCount: 0,
        }
    ];

    // 2. tag 样式映射
    const tagClasses = {
        '支持': 'bg-green-100 text-green-700',
        '反对': 'bg-red-100 text-red-700',
        '提问': 'bg-yellow-100 text-yellow-700',
        '建议': 'bg-blue-100 text-blue-700',
        '澄清': 'bg-indigo-100 text-indigo-700',
        '补充信息': 'bg-purple-100 text-purple-700',
        '担忧': 'bg-pink-100 text-pink-700',
        '中立/观察': 'bg-gray-200 text-gray-700'
    };

    // 3. 论点卡片渲染
    function renderArgumentCard(arg) {
        const tagStyle = tagClasses[arg.tag] || 'bg-gray-100 text-gray-600';
        const replyButtonText = arg.replyCount > 0 ? `查看回应 (${arg.replyCount})` : '添加回应';
        return `
            <div class="argument-card bg-white p-3 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-150" data-argument-id="${arg.id}">
                <div class="flex items-start space-x-3">
                    <img src="${arg.user.avatar}" alt="用户头像" class="w-10 h-10 rounded-full border-2 border-gray-100">
                    <div class="flex-1">
                        <div class="flex justify-between items-center">
                            <span class="font-semibold text-sm text-gray-800">${arg.user.name}</span>
                            <span class="text-xs text-gray-400">${arg.timestamp}</span>
                        </div>
                        <p class="text-sm text-gray-700 mt-1 mb-2 leading-relaxed">${arg.content}</p>
                        <div class="mb-2">
                            <span class="text-xs px-2 py-0.5 rounded-full ${tagStyle} font-medium">${arg.tag}</span>
                        </div>
                        <div class="flex items-center text-xs text-gray-500 space-x-4">
                            <button class="hover:text-green-600 flex items-center transition-colors duration-150"><i class="fas fa-thumbs-up mr-1"></i> ${arg.upvotes}</button>
                            <button class="hover:text-red-600 flex items-center transition-colors duration-150"><i class="fas fa-thumbs-down mr-1"></i> ${arg.downvotes}</button>
                            <button class="view-replies-btn hover:text-blue-600 flex items-center transition-colors duration-150" data-arg-id="${arg.id}" data-arg-name="${arg.user.name}的论点">
                                <i class="fas fa-reply mr-1"></i> ${replyButtonText}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // 4. 论点列表渲染
    function displayArguments(parentId) {
        const argumentList = document.getElementById('argument-list');
        const filteredArguments = argumentsData.filter(arg => arg.parentId === parentId);
        argumentList.innerHTML = filteredArguments.map(renderArgumentCard).join('');
    }

    // 5. 面包屑渲染
    let currentBreadcrumb = [{ id: null, name: '主议题', type: 'root' }];
    function renderBreadcrumb() {
        const breadcrumbNav = document.querySelector('.breadcrumb-nav');
        let html = '';
        currentBreadcrumb.forEach((item, index) => {
            if (index > 0) html += ' &gt; ';
            if (index === currentBreadcrumb.length - 1) {
                html += `<span class="font-semibold text-gray-700">${item.name}</span>`;
            } else {
                html += `<a href="#" class="breadcrumb-link text-blue-500 hover:underline" data-target-id="${item.id}" data-index="${index}">${item.name}</a>`;
            }
        });
        breadcrumbNav.innerHTML = html;
    }

    // 6. 树状图递归渲染
    function renderVisualTree(data, container, parentId = null, level = 0, selectedId = null) {
        if (level > 2) return; // 最多3层嵌套
        const children = data.filter(arg => arg.parentId === parentId);
        if (!children.length) return;
        const childrenContainer = document.createElement('div');
        childrenContainer.className = 'node-children-container';
        children.forEach(arg => {
            const node = document.createElement('div');
            node.className = 'tree-visual-node';
            node.setAttribute('data-arg-id', arg.id);
            node.setAttribute('data-tag', arg.tag);
            node.innerHTML = `<div class="font-bold text-xs mb-1">${arg.tag}</div><div class="truncate text-xs">${arg.content.substring(0, 18)}${arg.content.length > 18 ? '...' : ''}</div>`;
            if (selectedId && arg.id === selectedId) node.classList.add('selected');
            childrenContainer.appendChild(node);
            // 递归渲染子节点
            renderVisualTree(data, node, arg.id, level + 1, selectedId);
        });
        container.appendChild(childrenContainer);
    }

    // 7. 树状图初始化渲染
    function initTree(selectedId = null) {
        const treeContainer = document.getElementById('discussion-tree-container');
        treeContainer.innerHTML = '';
        renderVisualTree(argumentsData, treeContainer, null, 0, selectedId);
    }

    // 8. 交互：点击树节点高亮并联动下方论点列表
    document.getElementById('discussion-tree-container').addEventListener('click', function(e) {
        const node = e.target.closest('.tree-visual-node');
        if (!node) return;
        // 高亮
        this.querySelectorAll('.tree-visual-node').forEach(n => n.classList.remove('selected'));
        node.classList.add('selected');
        // 联动论点列表
        const argId = node.getAttribute('data-arg-id');
        displayArguments(argId);
        // 联动面包屑
        updateBreadcrumbByArgId(argId);
        renderBreadcrumb();
    });

    // 9. 面包屑联动逻辑
    function updateBreadcrumbByArgId(argId) {
        const path = [];
        let current = argumentsData.find(arg => arg.id === argId);
        while (current) {
            path.unshift({ id: current.id, name: current.content.substring(0, 15) + (current.content.length > 15 ? '...' : ''), type: 'argument' });
            current = argumentsData.find(arg => arg.id === current.parentId);
        }
        path.unshift({ id: null, name: '主议题', type: 'root' });
        currentBreadcrumb = path;
    }

    // 10. 面包屑点击事件
    document.querySelector('.breadcrumb-nav').addEventListener('click', function(e) {
        const link = e.target.closest('.breadcrumb-link');
        if (!link) return;
        e.preventDefault();
        const targetId = link.getAttribute('data-target-id');
        // 高亮树节点
        const tree = document.getElementById('discussion-tree-container');
        tree.querySelectorAll('.tree-visual-node').forEach(n => n.classList.remove('selected'));
        if (targetId !== 'null') {
            const node = tree.querySelector(`.tree-visual-node[data-arg-id="${targetId}"]`);
            if (node) node.classList.add('selected');
        }
        // 联动论点列表
        displayArguments(targetId === 'null' ? null : targetId);
        // 联动面包屑
        updateBreadcrumbByArgId(targetId === 'null' ? null : targetId);
        renderBreadcrumb();
    });

    // 11. 论点添加相关逻辑
    let nextArgId = 100;
    function handleSubmitNewArgument(parentId, content, tag) {
        const newArg = {
            id: 'arg' + nextArgId++,
            parentId: parentId,
            user: { name: '当前用户', avatar: 'https://randomuser.me/api/portraits/lego/1.jpg' },
            timestamp: '刚刚',
            content: content,
            tag: tag,
            upvotes: 0,
            downvotes: 0,
            replyCount: 0
        };
        argumentsData.push(newArg);
        // 更新父节点的 replyCount
        if (parentId) {
            const parentArg = argumentsData.find(arg => arg.id === parentId);
            if (parentArg) parentArg.replyCount = (parentArg.replyCount || 0) + 1;
        }
        // 刷新树状图、论点列表、面包屑，并高亮新节点
        initTree(newArg.id);
        displayArguments(newArg.id);
        updateBreadcrumbByArgId(newArg.id);
        renderBreadcrumb();
    }
    // 示例：你可以在"发表新论点"按钮点击时调用 handleSubmitNewArgument(null, '论点内容', '支持')
    // 或在"添加回应"时调用 handleSubmitNewArgument(parentId, '回应内容', '反对')

    // 12. 页面加载时默认高亮第一个主论点
    function getFirstMainArgumentId() {
        const first = argumentsData.find(arg => arg.parentId === null);
        return first ? first.id : null;
    }
    // 初始化渲染
    const defaultId = getFirstMainArgumentId();
    initTree(defaultId);
    displayArguments(defaultId);
    updateBreadcrumbByArgId(defaultId);
    renderBreadcrumb();
}); 