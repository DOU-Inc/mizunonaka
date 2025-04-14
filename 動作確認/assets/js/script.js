function setupToggle(sectionSelector, buttonSelector) {
    const section = document.querySelector(sectionSelector);
    if (!section) return;

    const blurLayer = section.querySelector('.blur-layer'); // 各セクションに分けた方が安全
    const textBox = section.querySelector('.all-text-box');
    const text = section.querySelector('.js-text');
    const allText = section.querySelector('.js-all-text');
    const title = section.querySelector('.js-title');
    const btn = section.querySelector('.js-btn');

    const buttons = section.querySelectorAll(buttonSelector);

    buttons.forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault();

            blurLayer.classList.toggle('-active');
            section.classList.toggle('-active');
            textBox.classList.toggle('-active');
            text.classList.toggle('-active');
            allText.classList.toggle('-active');
            title.classList.toggle('-active');
            btn.classList.toggle('-active');
        });
    });
}

// 各セクションで設定
setupToggle('#intro', '.button');
setupToggle('#story', '.button');



const target = document.querySelector('.footer');

window.addEventListener('scroll', () => {
    const rect = target.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    // 要素の下端が、画面の下端に「ほぼ」一致するタイミング
    const isBottomTouching = Math.abs(rect.bottom - windowHeight) < 5;

    if (isBottomTouching) {
        target.classList.add('end');
    } else {
        target.classList.remove('end'); // 必要なら消す処理も
    }
});

//文字数制御
function truncateHTMLText(maxChars, removeBr = false) {
    const elements = document.querySelectorAll(".text");

    elements.forEach(el => {
        const originalHTML = el.getAttribute("data-original-html") || el.innerHTML;

        if (!el.getAttribute("data-original-html")) {
            el.setAttribute("data-original-html", originalHTML);
        }

        const temp = document.createElement("div");
        temp.innerHTML = originalHTML;

        let charCount = 0;
        let truncatedHTML = "";

        function traverse(node) {
            if (charCount >= maxChars) return;

            if (node.nodeType === Node.TEXT_NODE) {
                const text = node.textContent;
                const remaining = maxChars - charCount;

                if (text.length <= remaining) {
                    truncatedHTML += text;
                    charCount += text.length;
                } else {
                    truncatedHTML += text.slice(0, remaining) + "…";
                    charCount = maxChars;
                }

            } else if (node.nodeType === Node.ELEMENT_NODE) {
                const tag = node.nodeName.toLowerCase();

                // <br> をモバイル時だけスキップ
                if (tag === "br") {
                    if (!removeBr) {
                        truncatedHTML += "<br>";
                    }
                    return;
                }

                // 開始タグ
                truncatedHTML += `<${tag}${[...node.attributes].map(attr => ` ${attr.name}="${attr.value}"`).join('')}>`;

                node.childNodes.forEach(child => {
                    if (charCount < maxChars) {
                        traverse(child);
                    }
                });

                truncatedHTML += `</${tag}>`;
            }
        }

        traverse(temp);
        el.innerHTML = truncatedHTML;
    });
}

function applyTruncate() {
    const isMobile = window.innerWidth <= 768;
    const maxChars = isMobile ? 263 : 290;
    const removeBr = isMobile; // モバイルなら <br> を除去

    truncateHTMLText(maxChars, removeBr);
}

// 初回実行
applyTruncate();

// リサイズにも対応
window.addEventListener("resize", applyTruncate);







//ーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーー
// swiper
//ーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーー

const castSwiper = new Swiper('.cast-swiper', {
    effect: 'fade', // フェードアニメーションを適用
    loop: true, // ループ設定
    speed: 4000,
    autoplay: {
        delay: 4000,
        disableOnInteraction: false,
    },
});

const sectionSwiper = new Swiper('.section-swiper', {
    // effect: 'fade', // フェードアニメーションを適用
    mousewheel: true,
    allowTouchMove: false,
    direction: 'vertical', // 縦スクロールに設定
    loop: false, // ループ設定
    speed: 1000,
    slidesPerView: 1,

});




function watchSectionActive() {
    const targets = ['.intro .all-text-box', '.story .all-text-box']; // 他にもあれば追加してOK

    function checkActive() {
        const isAnyActive = targets.some(selector => {
            const el = document.querySelector(selector);
            return el && el.classList.contains('-active');
        });

        sectionSwiper.allowTouchMove = !isAnyActive;
    }

    // MutationObserverでクラス変化を監視
    const observer = new MutationObserver(checkActive);

    targets.forEach(selector => {
        const el = document.querySelector(selector);
        if (el) {
            observer.observe(el, { attributes: true, attributeFilter: ['class'] });
        }
    });

    // 初回チェック
    checkActive();
}

// Swiper初期化後に実行
watchSectionActive();

if (section.classList.contains('-active')) {
    sectionSwiper.allowTouchMove = false;
} else {
    sectionSwiper.allowTouchMove = true;
}
