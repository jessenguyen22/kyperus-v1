document.addEventListener('DOMContentLoaded', () => {
  // Thời gian trễ giữa mỗi lần shuffle (ms)
  const VELOCITY = 40;

  // Chọn tất cả link của menu chính trên desktop/mobile
  const menuLinks = document.querySelectorAll('.m-menu__link--main');

  // Lưu text gốc vào data attribute (để khôi phục nhanh)
  menuLinks.forEach((link) => {
    if (!link.dataset.text) {
      link.dataset.text = link.textContent.trim();
    }
  });

  // Hàm xáo trộn mảng ký tự
  function shuffle(arr) {
    const clone = arr.slice();
    for (let i = clone.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [clone[i], clone[j]] = [clone[j], clone[i]];
    }
    return clone;
  }

  // Shuffle text cho 1 phần tử
  function shuffleText(el, original) {
    const chars = original.split('');

    function step(index) {
      if (index > chars.length) {
        el.textContent = original;
        return;
      }

      setTimeout(() => {
        const randomChars = shuffle(chars);
        // Giữ nguyên các ký tự đã khôi phục
        for (let i = 0; i < index; i++) {
          randomChars[i] = original[i];
        }
        el.textContent = randomChars.join('');
        step(index + 1);
      }, VELOCITY);
    }

    step(0);
  }

  // Gắn listener hover
  menuLinks.forEach((link) => {
    link.addEventListener('mouseenter', () => {
      shuffleText(link, link.dataset.text);
    });
  });

  // --- Tối ưu hiệu ứng SCRAMBLE Text ---
  // Sử dụng random charset + cố định chiều rộng phần tử để tránh layout shift
  (() => {
    const VELOCITY = 40; // tốc độ (ms) mỗi frame
    const CHARSET = '!<>-_\\/[]{}—=+*^?#________';

    // Lấy tất cả link menu chính
    const menuLinks = document.querySelectorAll('.m-menu__link--main');

    menuLinks.forEach((link) => {
      if (!link.dataset.text) {
        link.dataset.text = link.textContent.trim();
      }

      // Đảm bảo có thể set width cố định
      link.style.display = 'inline-block';

      link.addEventListener('mouseenter', () => startScramble(link));
    });

    function randomChar() {
      return CHARSET[Math.floor(Math.random() * CHARSET.length)];
    }

    function startScramble(el) {
      const original = el.dataset.text;
      const length = original.length;

      // Prevent multiple simultaneous animations
      if (el.__scrambleFrame) cancelAnimationFrame(el.__scrambleFrame);

      // Cố định width để tránh giật layout
      const width = el.offsetWidth;
      el.style.width = width + 'px';

      let revealedCount = 0;
      let lastTime = 0;

      function step(time) {
        if (time - lastTime < VELOCITY) {
          el.__scrambleFrame = requestAnimationFrame(step);
          return;
        }
        lastTime = time;

        let output = '';
        for (let i = 0; i < length; i++) {
          if (i < revealedCount) {
            output += original[i];
          } else {
            output += randomChar();
          }
        }
        el.textContent = output;
        revealedCount++;

        if (revealedCount <= length) {
          el.__scrambleFrame = requestAnimationFrame(step);
        } else {
          // hoàn tất
          el.textContent = original;
          el.style.width = '';
          el.__scrambleFrame = null;
        }
      }

      requestAnimationFrame(step);
    }
  })();
}); 