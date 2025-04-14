function setupToggle(sectionSelector, buttonSelector) {
    const section = document.querySelector(sectionSelector);
    if (!section) return;

    const blurLayer = section.querySelector('.blur-layer'); // 各セクションに分けた方が安全
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
// gsap
//ーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーー

gsap.registerPlugin(ScrollTrigger);
gsap.fromTo(
    "#story video", // アニメーションしたい要素
    {
        autoAlpha: 0, // アニメーション開始前（透明）
    },
    {
        autoAlpha: 1, // アニメーション後（表示）
        duration: 1, // アニメーションの時間
        ease: "power2.out",
        scrollTrigger: {
            trigger: "#story", // アニメーションを発動させるトリガー要素
            start: "top center", // #story の上端が画面の上端に来たら発動
            toggleActions: "play reverse play reverse",
        },
    }
);

gsap.fromTo(
    "#trailer video", // アニメーションしたい要素
    {
        autoAlpha: 0, // アニメーション開始前（透明）
    },
    {
        autoAlpha: 1, // アニメーション後（表示）
        duration: 1, // アニメーションの時間
        ease: "power2.out",
        scrollTrigger: {
            trigger: "#trailer", // アニメーションを発動させるトリガー要素
            start: "top center", // #story の上端が画面の上端に来たら発動
            toggleActions: "play reverse play reverse",
        },
    }
);

gsap.fromTo(
    ".cast .swiper", // アニメーションしたい要素
    {
        autoAlpha: 0, // アニメーション開始前（透明）
    },
    {
        autoAlpha: 1, // アニメーション後（表示）
        duration: 1, // アニメーションの時間
        ease: "power2.out",
        scrollTrigger: {
            trigger: ".cast", // アニメーションを発動させるトリガー要素
            start: "top center", // #story の上端が画面の上端に来たら発動
            toggleActions: "play reverse play reverse",
        },
    }
);


gsap.fromTo(
    "#footer video", // アニメーションしたい要素
    {
        autoAlpha: 0, // アニメーション開始前（透明）
    },
    {
        autoAlpha: 1, // アニメーション後（表示）
        duration: 1, // アニメーションの時間
        ease: "power2.out",
        scrollTrigger: {
            trigger: "#footer", // アニメーションを発動させるトリガー要素
            start: "top center", // #story の上端が画面の上端に来たら発動
            toggleActions: "play reverse play reverse",
        },
    }
);

window.addEventListener('load', () => {
    const tl = gsap.timeline();

    // 1. 文字をフェードイン
    tl.to('.catch', {
        duration: 3,
        opacity: 1,
        ease: 'power2.out',
        delay: 0.5,
    });

    // 2. 文字を右にスライド
    tl.to('.catch', {
        left: '95%',
        ease: 'power1.out',
        duration: 3,
        delay: 1.5,
    }, '-=1.0');

    // 3. littie再生
    tl.to('#lottie-animation', {
        opacity: 1,
        onComplete: () => {
            lottie.loadAnimation({
                container: document.getElementById('lottie-animation'),
                renderer: 'svg',
                loop: false,
                autoplay: true,
                path: './assets/json/data.json'
            });
        }
    }, '-=1.0');

    // 4. 黒背景をフェードアウト（透明に）
    tl.to('.bg-black', {
        duration: 4,
        opacity: 0,
        ease: 'power2.inOut',
        delay: 4,
    });

    // 5. SNS出す
    tl.to('.sns', {
        opacity: 1,
        ease: 'power2.inOut',
    });


    // 6. 劇場情報出す
    tl.to('.theater', {
        opacity: 1,
        ease: 'power2.inOut',
    });


});




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
    direction: 'vertical', // 縦スクロールに設定
    loop: true, // ループ設定
    speed: 4000,
});




