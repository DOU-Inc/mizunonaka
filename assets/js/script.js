
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


// window.addEventListener('resize', () => {
//     if (section.classList.contains('-active')) {
//         moveTitleSmoothly(titleElement); // 再調整
//     }
// });

function disableScroll() {
    document.documentElement.classList.add('noscroll');
    document.body.classList.add('noscroll');
    lenis.stop();
  }
  
  function enableScroll() {
    document.documentElement.classList.remove('noscroll');
    document.body.classList.remove('noscroll');
    lenis.start();
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

function setVideoSourceById(id) {
    const video = document.getElementById(id);
    if (!video) return;
  
    const isMobile = isMobileTouchDevice();
    const src = isMobile ? videoMap[id].sp : videoMap[id].pc;
  
    // src がすでに同じなら何もしない
    if (video.getAttribute("src") === src) return;
  
    // 属性を明示的にセット（iOS Instagram内ではこれが超重要）
    video.setAttribute("muted", "");
    video.setAttribute("autoplay", "");
    video.setAttribute("playsinline", "");
    video.setAttribute("loop", "");
    video.setAttribute("src", src);
  
    // 動画を再読み込み・再生
    video.poster = ""; // ← 追加
    video.load();
    video.play().catch((e) => {
      console.warn(`Autoplay failed for ${id}:`, e);
    });
  }
  

// window.addEventListener("DOMContentLoaded", setAllVideoSources);
// window.addEventListener("resize", () => {
//     setTimeout(setAllVideoSources, 100);
// });


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

    const trailer = document.querySelector('#trailer');
    const story = document.querySelector('#story');
    const intro = document.querySelector('#intro'); // ← intro 追加！

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

           
            const trailer = document.querySelector('#trailer');
const story = document.querySelector('#story');
const intro = document.querySelector('#intro'); // ← intro 追加！

const isActive = section.classList.contains('-active');
if (isActive) {
  disableScroll();
  moveTitleSmoothly(title);
  html.classList.add('noscroll');

  if (section.id === 'story') {
    if (trailer) {
      trailer.style.opacity = '0';
      trailer.style.pointerEvents = 'none';
    }
    if (intro) {
      intro.style.opacity = '0';
      intro.style.pointerEvents = 'none';
    }
  }

  if (section.id === 'intro' && story) {
    story.style.opacity = '0';
    story.style.pointerEvents = 'none';
  }

} else {
  enableScroll();
  resetTitlePosition(title);
  html.classList.remove('noscroll');

  if (section.id === 'story') {
    if (trailer) {
      trailer.style.opacity = '1';
      trailer.style.pointerEvents = 'auto';
    }
    if (intro) {
      intro.style.opacity = '1';
      intro.style.pointerEvents = 'auto';
    }
  }

  if (section.id === 'intro' && story) {
    story.style.opacity = '1';
    story.style.pointerEvents = 'auto';
  }
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
            start: "10% center", // #story の上端が画面の上端に来たら発動
            toggleActions: "play reverse play reverse",
            onEnter: () => {    // 潜る映像は頭から再生
                const video = document.querySelector("#footer video");
                if (video) {
                  video.currentTime = 0; // ← ここで先頭に戻す！
                  video.play().catch((e) => {
                    console.warn("footer動画の再生失敗", e);
                  });
                }
            },
        },
    }
);


ScrollTrigger.create({
    trigger: ".cast",
    start: "top center", // castが画面中央に来たとき
    onEnter: () => {
      const video = document.querySelector("#footer video");
      if (video) {
        video.pause();
        video.currentTime = 0;
        console.log("castに来たのでfooter動画をリセット");
      }
    }
});


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
        autoAlpha: .9,
        duration: 1,
    }, '<');

    // TODO: 劇場情報はGW後に公開！
    tl.add(() => {
        document.querySelector(".js-theater")?.classList.add("-disp");
    }, "<");


    tl.call(() => {
        document.body.classList.remove("noscroll-preload");
        document.documentElement.classList.remove("noscroll-preload");
        lenis.start(); // ← ここでlenisも解放！
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



// モバイルタッチデバイス判定関数
function isMobileTouchDevice() {
    return window.innerWidth <= 768 && ('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }
  


  function setVideoWithPoster(id, spPoster, pcPoster) {
    const video = document.getElementById(id);
    if (!video) return;
  
    const isMobile = isMobileTouchDevice();
    const src = isMobile ? videoMap[id].sp : videoMap[id].pc;
    const poster = isMobile ? spPoster : pcPoster;
  
    // 1. まずposterをセット（ここ超重要！）
    video.setAttribute("poster", poster);
  
    // 2. すでに同じsrcならスキップ
    if (video.getAttribute("src") === src) return;
  
    // 3. 属性を明示的にセット
    video.setAttribute("muted", "");
    video.setAttribute("autoplay", "");
    video.setAttribute("playsinline", "");
    video.setAttribute("loop", "");
    video.setAttribute("src", src);
  
    // 4. 再読み込み＆再生
    video.load();
    video.play().catch((e) => {
      console.warn(`Autoplay failed for ${id}:`, e);
    });
  }
  
//   function setResponsivePoster(videoId, spPath, pcPath) {
//     const video = document.getElementById(videoId);
//     if (!video) return;
  
//     const isMobile = isMobileTouchDevice();
//     const posterPath = isMobile ? spPath : pcPath;
  
//     video.setAttribute("poster", posterPath);
//   }

//   // 動画の読み込み関数（条件付き）
//   function setVideoSourceById(id) {
//     const video = document.getElementById(id);
//     if (!video) return;
  
//     const isMobile = isMobileTouchDevice();
//     const src = isMobile ? videoMap[id].sp : videoMap[id].pc;
  
//     if (video.getAttribute("src") === src) return;
  
//     video.setAttribute("muted", "");
//     video.setAttribute("autoplay", "");
//     video.setAttribute("playsinline", "");
//     video.setAttribute("loop", "");
  
//     video.poster = ""; // ← これ追加！
//     video.setAttribute("src", src);
  
//     video.load();
//     video.play().catch((e) => {
//       console.warn(`Autoplay failed for ${id}:`, e);
//     });
//   }
  

  function isInstagramBrowser() {
    const ua = navigator.userAgent || navigator.vendor || window.opera;
    return ua.includes("Instagram");
  }

  window.addEventListener("DOMContentLoaded", () => {
    const isInsta = isInstagramBrowser();
  
    // poster切り替え
    setVideoWithPoster(
        "mv-video",
        "./assets/img/01_sp_poster_v2.jpg",
        "./assets/img/01_pc_poster.jpg"
    );
    setVideoWithPoster(
        "story-video",
        "./assets/img/02_sp_poster_v2.jpg",
        "./assets/img/02_pc_poster.jpg"
    );    
    setVideoWithPoster(
        "trailer-video",
        "./assets/img/03_sp_poster.jpg",
        "./assets/img/03_pc_poster.jpg"
    );    
    setVideoWithPoster(
        "footer-video",
        "./assets/img/04_sp_poster_v2.jpg",
        "./assets/img/04_pc_poster.jpg"
    );    
  
    if (isInsta) {
      // instaでは1本だけでも明示的にロード
      setVideoSourceById("mv-video");
  
      setTimeout(() => {
        setVideoSourceById("footer-video");
      }, 800);
    } else {
      setVideoSourceById("mv-video");
    }
  
    // 他の動画をScrollTriggerでロード
    Object.keys(videoMap).forEach(id => {
      if (id === "mv-video") return;
  
      const triggerSelector = `#${id.replace("-video", "")}`;
      ScrollTrigger.create({
        trigger: triggerSelector,
        start: "top 100%",
        once: true,
        onEnter: () => setVideoSourceById(id),
      });
    });
  });