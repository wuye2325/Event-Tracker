// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 处理底部标签栏点击事件
    const tabItems = document.querySelectorAll('.tab-item');
    if (tabItems.length > 0) {
        tabItems.forEach(item => {
            item.addEventListener('click', function() {
                // 移除所有active类
                tabItems.forEach(tab => tab.classList.remove('active'));
                // 添加active类到当前点击的标签
                this.classList.add('active');
            });
        });
    }
    
    // 处理发布按钮点击事件
    const fabButton = document.querySelector('.fab');
    if (fabButton) {
        fabButton.addEventListener('click', function() {
            // 在实际应用中，这里会跳转到发布页面
            console.log('跳转到发布页面');
        });
    }
    
    // 处理事件卡片点击事件
    const eventCards = document.querySelectorAll('.event-card');
    if (eventCards.length > 0) {
        eventCards.forEach(card => {
            card.addEventListener('click', function() {
                // 在实际应用中，这里会跳转到事件详情页面
                console.log('跳转到事件详情页面');
            });
        });
    }
});