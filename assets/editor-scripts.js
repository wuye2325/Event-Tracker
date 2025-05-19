let timelineImages = []; // 用于图片上传

// 图片上传相关函数
function uploadImage() {
    if (timelineImages.length >= 9) {
        alert('最多只能上传9张图片');
        return;
    }
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                timelineImages.push(e.target.result);
                updateImagePreview();
            }
            reader.readAsDataURL(file);
        }
    }
    input.click();
}

function updateImagePreview() {
    const uploadArea = document.querySelector('.image-upload-area');
    uploadArea.innerHTML = '';

    timelineImages.forEach((img, index) => {
        const div = document.createElement('div');
        div.className = 'image-preview';
        div.innerHTML = `
            <img src="${img}" alt="预览图片">
            <div class="remove-btn" onclick="removeImage(${index})">
                <i class="fas fa-times"></i>
            </div>
        `;
        uploadArea.appendChild(div);
    });

    if (timelineImages.length < 9) {
        const upload = document.createElement('div');
        upload.className = 'image-upload-item';
        upload.onclick = uploadImage;
        upload.innerHTML = '<i class="fas fa-plus"></i>';
        uploadArea.appendChild(upload);
    }
}

function removeImage(index) {
    timelineImages.splice(index, 1);
    updateImagePreview();
}


// 富文本编辑相关脚本
document.addEventListener('DOMContentLoaded', function() {
    const editor = document.querySelector('.rich-editor');
    const hiddenTextarea = document.querySelector('.hidden-textarea');

    // 确保编辑器有初始内容，避免空内容问题
    if (editor && !editor.innerHTML.trim()) {
        editor.innerHTML = '<br>';
    }

    // 给编辑器一个初始焦点，然后再失去焦点
    if (editor) {
        editor.focus();
        setTimeout(() => {
            document.activeElement.blur();
        }, 100);
    }


    // 工具栏按钮点击事件
    document.querySelectorAll('.format-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const command = this.getAttribute('data-command');

            if (command === 'bold') {
                document.execCommand('bold', false, null);
                if(editor) editor.focus(); // 将焦点返回编辑器
            } else if (command === 'createLink') {
                 if(editor) editor.focus(); // 将焦点返回编辑器
                // 获取选中文本
                const selection = window.getSelection();
                const selectedText = selection ? selection.toString() : '';

                // 显示链接弹窗
                showRichLinkModal(selectedText);
            }
        });
    });

    // 显示链接弹窗
    function showRichLinkModal(text) {
        const modal = document.getElementById('linkModal');
        if (!modal) return; // Ensure modal exists

        const textInput = modal.querySelector('.link-text');
        const urlInput = modal.querySelector('.link-url');
        const editor = document.querySelector('.rich-editor');


        textInput.value = text;
        urlInput.value = ''; // Clear previous URL
        modal.classList.remove('hidden');

        // 设置确认按钮事件
        modal.querySelector('.confirm-btn').onclick = function() {
            const linkText = textInput.value || '链接文字';
            const linkUrl = urlInput.value;

            if (linkUrl) {
                // 确保编辑器有焦点
                if(editor) editor.focus();
                const selection = window.getSelection();

                // 如果有选中文本
                if (selection && selection.rangeCount > 0 && selection.toString()) {
                    // 直接创建链接
                     try {
                         document.execCommand('createLink', false, linkUrl);

                         // 添加属性到新创建的链接
                         // 需要延迟一下，确保链接元素已经生成
                         setTimeout(function() {
                             const links = editor.querySelectorAll(`a[href="${linkUrl}"]`);
                             if (links.length > 0) {
                                 // 找到最后创建的链接（或者更精确地查找，但这里假设是最后一个）
                                 const newLink = links[links.length - 1];
                                 newLink.setAttribute('target', '_blank');
                                 newLink.setAttribute('rel', 'noopener');
                             }
                         }, 50); // 短暂延迟
                     } catch (e) {
                         console.error("Error creating link with selection:", e);
                         // Fallback if execCommand fails with selection
                         insertLinkManually(editor, linkText, linkUrl);
                     }

                } else {
                    // 如果没有选中文本，直接插入HTML
                    insertLinkManually(editor, linkText, linkUrl);
                }

                // 关闭弹窗
                modal.classList.add('hidden');
                textInput.value = '';
                urlInput.value = '';
            } else {
                 alert('请输入URL地址'); // Prompt if URL is empty
            }
        };

        // 插入链接的辅助函数
        function insertLinkManually(editorElement, text, url) {
             if (!editorElement) return;
             const linkHTML = `<a href="${url}" target="_blank" rel="noopener" style="color:#1890ff;text-decoration:underline;">${text}</a>`;

             try {
                 // 尝试使用insertHTML命令插入
                 document.execCommand('insertHTML', false, linkHTML);
             } catch (e) {
                  console.error('Error inserting link HTML:', e);
                 // 如果execCommand失败，直接修改innerHTML (不推荐，会丢失光标位置和undo/redo历史)
                 editorElement.innerHTML += linkHTML;
                 // 尝试将光标移到末尾（用户体验不好）
                 const range = document.createRange();
                 range.selectNodeContents(editorElement);
                 range.collapse(false);
                 const selection = window.getSelection();
                 selection.removeAllRanges();
                 selection.addRange(range);
             }
         }

        // 其他弹窗逻辑保持不变
        modal.querySelector('.cancel-btn').onclick = function() {
            modal.classList.add('hidden');
             modal.querySelector('.link-url').value = ''; // Clear URL on cancel
        };

        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.classList.add('hidden');
                modal.querySelector('.link-url').value = ''; // Clear URL on click outside
            }
        });
    }


    // 在提交表单前将编辑器内容同步到隐藏的textarea
    // 你需要在 publish.html 中调用这个函数
    window.syncEditorContent = function() {
         const editor = document.querySelector('.rich-editor');
         const hiddenTextarea = document.querySelector('.hidden-textarea');
         if(editor && hiddenTextarea) {
            hiddenTextarea.value = editor.innerHTML;
            return hiddenTextarea.value; // 返回同步后的内容，方便验证
         }
         return ''; // Return empty string if elements not found
    }

    // Markdown语法自动转换（可选，如果不需要可以移除）
    // 注意：这里的实现比较基础，可能无法处理复杂情况
    if(editor) {
        editor.addEventListener('input', function() {
             // 实现Markdown转换逻辑，与create-timeline.html中的类似
             // 这里的实现可能需要根据实际需求调整
         });
    }


    // 帮助函数：将光标放在指定节点后面
    function placeCaretAfterNode(node) {
        if (!node) return;

        const range = document.createRange();
        const selection = window.getSelection();

        range.setStartAfter(node);
        range.collapse(true);

        selection.removeAllRanges();
        selection.addRange(range);
    }

});
