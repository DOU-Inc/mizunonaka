
window.addEventListener('beforeunload', () => {
    window.scrollTo(0, 0);
    if (lenis) lenis.scrollTo(0, { immediate: true });
});


function handleBgSpFadeOnScroll() {
    const bgSp = document.querySelector('.bg-sp');
    if (!bgSp) return;
    let isHidden = false;

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;

        if (scrollY > 10 && !isHidden) {
            bgSp.style.opacity = '0';
            isHidden = true;
        } else if (scrollY <= 10 && isHidden) {
            bgSp.style.opacity = '0.3';
            isHidden = false;
        }
    });
}

handleBgSpFadeOnScroll();

function moveTitleSmoothly(titleElement) {
    const rect = titleElement.getBoundingClientRect();
    const currentX = rect.left;
    const currentY = rect.top;

    // 画面幅で条件分岐（スマホは768px以下とする）
    const isMobile = window.innerWidth <= 768;

    // 目標位置（スマホとPCで分ける）
    const targetX = isMobile ? 20 : 60;
    const targetY = isMobile ? 96 : 60;

    const deltaX = targetX - currentX;
    const deltaY = targetY - currentY;

    // 初期化（今の位置にピタッと固定）
    titleElement.style.transform = `translate(0, 0)`;
    titleElement.style.transition = 'none';

    // 次のフレームでアニメーション発動
    requestAnimationFrame(() => {
        titleElement.style.transition = 'transform 1s ease';
        titleElement.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
    });
}

function resetTitlePosition(titleElement) {
    titleElement.style.transition = 'transform 1s ease';
    titleElement.style.transform = `translate(0, 0)`; // 元の位置に戻すだけ！
}


window.addEventListener('resize', () => {
    if (section.classList.contains('-active')) {
        moveTitleSmoothly(titleElement); // 再調整
    }
});

function disableScroll() {
    document.body.classList.add('-noscroll');
    lenis.stop(); // ← Lenisも止める！
}

function enableScroll() {
    document.body.classList.remove('-noscroll');
    lenis.start(); // ← Lenis再開！
}


//ーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーー
//PC版とSP版の動画切り替え
//ーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーー

const videoMap = {
    "mv-video": {
        pc: "./assets/video/01_pc.mp4",
        sp: "./assets/video/01_sp.mp4",
    },
    "story-video": {
        pc: "./assets/video/02_pc.mp4",
        sp: "./assets/video/02_sp.mp4",
    },
    "trailer-video": {
        pc: "./assets/video/03_pc.mp4",
        sp: "./assets/video/03_sp.mp4",
    },
    "footer-video": {
        pc: "./assets/video/04_pc.mp4",
        sp: "./assets/video/04_sp.mp4",
    },
};

function setAllVideoSources() {
    const isMobile = window.innerWidth <= 768;

    Object.entries(videoMap).forEach(([id, paths]) => {
        const video = document.getElementById(id);
        if (!video) return;

        const currentSrc = video.currentSrc;
        const newSrc = isMobile ? paths.sp : paths.pc;

        if (currentSrc.includes(newSrc)) return;

        video.pause();
        video.src = newSrc;
        video.load();
        video.play().catch((e) => {
            console.warn(`Autoplay failed for ${id}:`, e);
        });
    });
}

window.addEventListener("DOMContentLoaded", setAllVideoSources);
window.addEventListener("resize", () => {
    setTimeout(setAllVideoSources, 100);
});


//ーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーー
//intro,storyのモーダルのアニメーション
//ーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーー
function setupToggle(sectionSelector, buttonSelector) {
    const section = document.querySelector(sectionSelector);
    if (!section) return;

    const blurLayer = section.querySelector('.blur-layer'); // 各セクションに分けた方が安全
    const text = section.querySelector('.js-text');
    const inner = section.querySelector('.js-inner');

    const allText = section.querySelector('.js-all-text');
    const textBox = section.querySelector('.js-text-box');
    const title = section.querySelector('.js-title');
    const btn = section.querySelector('.js-btn');

    const buttons = section.querySelectorAll(buttonSelector);


    const html = document.documentElement;
    buttons.forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault();

            blurLayer.classList.toggle('-active');
            section.classList.toggle('-active');
            text.classList.toggle('-active');
            allText.classList.toggle('-active');
            textBox.classList.toggle('-active');
            title.classList.toggle('-active');
            btn.classList.toggle('-active');

            const isActive = section.classList.contains('-active');
            if (isActive) {
                disableScroll();
                moveTitleSmoothly(title);
                html.classList.add('noscroll'); // ← ここで追加！
            } else {
                enableScroll();
                resetTitlePosition(title);
                html.classList.remove('noscroll'); // ← ここで削除！
            }
        });
    });
}

// 各セクションで設定
setupToggle('#intro', '.button');
setupToggle('#story', '.button');

//ーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーー
//intro,storyのPCとSPの文字数制御
//ーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーー

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

const container = document.querySelector('.container');
const inners = document.querySelectorAll('.inner'); // ← 複数

gsap.fromTo(
    ".cast .swiper",
    {
        autoAlpha: 0,
    },
    {
        autoAlpha: 1,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
            trigger: ".cast",
            start: "top center",
            toggleActions: "play reverse play reverse",
            onEnter: () => {
                container.style.overflow = "visible";
                inners.forEach(inner => {
                    inner.style.overflow = "hidden"; // ← 各.innerに適用
                });
            },
            onLeaveBack: () => {
                container.style.overflow = "hidden";
                inners.forEach(inner => {
                    inner.style.overflow = "visible"; // ← 各.innerに適用
                });
            },
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

gsap.fromTo(
    "#footer .img-box", // アニメーションしたい要素
    {
        autoAlpha: 0, // アニメーション開始前（透明）
    },
    {
        autoAlpha: 1, // アニメーション後（表示）
        duration: 1, // アニメーションの時間
        ease: "power2.out",
        scrollTrigger: {
            trigger: "#footer", // アニメーションを発動させるトリガー要素
            start: "60% top", // #footer の上端が画面の上端に来たら発動
            toggleActions: "play reverse play reverse",
        },
    }
);



window.addEventListener('load', () => {
    lenis.stop();
    const isMobile = window.innerWidth <= 768;
    const tl = gsap.timeline();

    gsap.set(".mv-sns", {
        autoAlpha: 0,
    });

    tl.to('.catch', {
        duration: 2,
        opacity: 1,
        ease: 'power2.out',
    });


    tl.to('.catch', {
        opacity: 0,
        ease: 'power1.out',
        duration: 2,
    });

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

    tl.to('.bg-black', {
        duration: 6,
        opacity: 0,
        ease: 'power2.inOut',
        delay: 3,
    }, '-=4.0');

    tl.to('.catch2', {
        opacity: 1,
        ease: 'power1.out',
        duration: 2,
    });


    tl.to(".mv-sns", {
        autoAlpha: 1,
        duration: 1,
    }, '<');

    tl.to(".js-theater", {
        duration: 1,
        y: isMobile ? '-132%' : '-85%',
        ease: 'power1.out',
    }, '<');


    // // 最後にスクロール解放！
    tl.call(() => {
        lenis.start(); // ← ここでスクロールを解放！
    });


});

gsap.to(
    ".sns-box", // アニメーションしたい要素
    {
        autoAlpha: 0,
        duration: 1, // アニメーションの時間
        ease: "power2.inout",
        scrollTrigger: {
            trigger: "#news", // アニメーションを発動させるトリガー要素
            start: "center center", // #newsの上端が画面の上端に来たら発動
            toggleActions: "play none none reverse"
        },
    }
);





const lenis = new Lenis({
    smooth: true,
    lerp: 0.06, // 数値小さいほどぬるぬる（0〜1）
})

function raf(time) {
    lenis.raf(time)
    requestAnimationFrame(raf)
}

requestAnimationFrame(raf)


//ーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーー
// swiper
//ーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーー

const swiper = new Swiper('.swiper', {
    effect: 'fade', // フェードアニメーションを適用
    loop: true, // ループ設定
    speed: 4000,
    autoplay: {
        delay: 4000,
        disableOnInteraction: false,
    },
});



