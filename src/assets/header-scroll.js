// ヘッダーのスクロール時表示/非表示制御
(function() {
    let lastScrollTop = 0;
    const header = document.querySelector('header');
    const scrollThreshold = 100; // スクロール開始の閾値（px）
    const scrollDelta = 5; // 反応するスクロール量（px）

    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        // スクロール量が閾値に達していない場合は常に表示
        if (scrollTop < scrollThreshold) {
            header.classList.remove('header-hidden');
            lastScrollTop = scrollTop;
            return;
        }

        // スクロール量の差が小さい場合は無視（誤動作防止）
        if (Math.abs(lastScrollTop - scrollTop) <= scrollDelta) {
            return;
        }

        // 下にスクロール
        if (scrollTop > lastScrollTop) {
            header.classList.add('header-hidden');
        }
        // 上にスクロール
        else {
            header.classList.remove('header-hidden');
        }

        lastScrollTop = scrollTop;
    });
})();
