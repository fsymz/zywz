document.addEventListener('DOMContentLoaded', function() {
  const startModal = document.getElementById('startModal');
  const openBtn = document.getElementById('openBtn');
  const popupContainer = document.getElementById('popupContainer');
  const bgMusic = document.getElementById('bgMusic');

  // 祝福语句
  const wishes = [
    "每天都要笑",
    "记得吃早饭",
    "不要怀疑自己",
    "遇到难题别慌",
    "今天也辛苦啦",
    "放松最重要",
    "降温了，记得穿厚一点",
    "立冬快乐",
    "好好照顾自己",
    "别忘了喝水",
    "立冬快乐",
    "慢慢来，不要焦虑",
    "累了就歇会儿",
    "你那边下雪了吗",
    "别想太多，你已经做得很好了",
    "每天都要开开心心",
    "按时吃饭",
    "注意好自己的身体",
    "要早睡早起",
    "立冬快乐",
    "今天也特别的好看",
    "天凉了，被子要盖好",
    "再坚持一下，好事会来的",
    "别给自己太大压力，尽力就好",
    "少吃辣的",
    "少喝饮料",
    "少喝凉的",
    "不开心的时候多出门逛逛",
    "相信自己",
    "今天也要为自己加油哦",
    "别熬夜了",
    "财源滚滚",
    "一切都会变好的",
  ];

  // 主题色
  const themes = [
    'theme-pink', 'theme-green', 'theme-yellow', 'theme-purple', 'theme-orange',
    'theme-cyan', 'theme-navy', 'theme-rose', 'theme-mint',
    'theme-brown', 'theme-deep-purple', 'theme-coral', 'theme-olive', 'theme-ice-blue'
  ];

  // 点击"打开"按钮触发弹窗
  openBtn.addEventListener('click', function() {
    // 隐藏初始弹窗
    startModal.style.opacity = '0';
    setTimeout(() => {
      startModal.style.display = 'none';
    }, 500);

    // 播放背景音乐
    bgMusic.play().catch(err => {
      alert('请点击页面任意位置开启音乐～');
      document.body.addEventListener('click', () => bgMusic.play(), { once: true });
    });

    // 开始生成弹窗
    startPopupGeneration();
  });

  // 弹窗生成函数
  function startPopupGeneration() {
    // 根据屏幕宽度动态计算弹窗大小
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    
    // 弹窗宽度设为屏幕宽度的40%，最小200px，最大260px
    const popupWidth = Math.min(260, Math.max(200, screenWidth * 0.4));
    
    // 批次设置
    const totalPopups = 520;
    const batchSize = 10;
    const batchInterval = 1500;
    const innerInterval = 150;
    
    let createdCount = 0;
    let usedPositions = [];
    
    function generateBatch() {
      if (createdCount >= totalPopups) return;
      
      const currentBatchSize = Math.min(batchSize, totalPopups - createdCount);
      
      // 生成当前批次的所有弹窗
      for (let i = 0; i < currentBatchSize; i++) {
        setTimeout(() => {
          createPopup();
          createdCount++;
        }, i * innerInterval);
      }
      
      // 安排下一批次
      setTimeout(generateBatch, batchInterval);
    }
    
    // 创建弹窗
    function createPopup() {
      try {
        // 随机选择文字
        const randomText = wishes[Math.floor(Math.random() * wishes.length)];
        
        // 随机选择主题色
        const randomTheme = themes[Math.floor(Math.random() * themes.length)];
        
        // 计算随机位置 - 确保在屏幕内
        let x, y;
        let attempts = 0;
        const maxAttempts = 30;
        
        do {
          // 使用随机位置，确保弹窗完全在屏幕内
          // 考虑弹窗宽度，确保不会超出屏幕边缘
          const minX = (popupWidth / 2 / screenWidth) * 100;
          const maxX = 100 - minX;
          const minY = 5; // 距离顶部至少5%
          const maxY = 95; // 距离底部至少5%
          
          x = Math.random() * (maxX - minX) + minX;
          y = Math.random() * (maxY - minY) + minY;
          
          // 简单重叠检测
          let isOverlap = false;
          for (let pos of usedPositions) {
            const distance = Math.sqrt(Math.pow(x - pos.x, 2) + Math.pow(y - pos.y, 2));
            // 根据弹窗大小动态调整重叠阈值
            const threshold = (popupWidth / screenWidth) * 100 * 1.5;
            if (distance < threshold) {
              isOverlap = true;
              break;
            }
          }
          
          if (!isOverlap || attempts >= maxAttempts) break;
          attempts++;
        } while (true);
        
        // 记录位置
        usedPositions.push({x, y});
        if (usedPositions.length > 50) {
          usedPositions.shift();
        }
        
        // 创建弹窗元素
        const popup = document.createElement('div');
        popup.className = `popup ${randomTheme}`;
        popup.style.width = `${popupWidth}px`;
        popup.style.left = `${x}%`;
        popup.style.top = `${y}%`;
        
        // 随机旋转角度
        const randomRotate = (Math.random() * 10 - 5) + 'deg';
        popup.style.setProperty('--rotate', randomRotate);
        
        popup.innerHTML = `
          <div class="top-part">
            <div class="to-label">To 纸鱼丸子🐟</div>
          </div>
          <div class="divider"></div>
          <div class="bottom-part">
            <div class="popup-text">${randomText}</div>
          </div>
        `;
        
        popupContainer.appendChild(popup);
        
        // 延迟显示动画
        setTimeout(() => {
          popup.style.opacity = '1';
        }, 10);
        
      } catch (error) {
        console.error('创建弹窗时出错:', error);
      }
    }
    
    // 开始生成
    generateBatch();
  }
});
