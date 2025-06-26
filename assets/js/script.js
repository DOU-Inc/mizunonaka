//ーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーー
//ローディング画面切り替え
//ーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーー
window.__loadingStart = performance.now();

document.addEventListener("DOMContentLoaded", () => {
    const loader = document.getElementById("loading");
    const progressEl = document.getElementById("progress-bar");

    let progress = 0;
    let loadingComplete = false;

    // ページ全体が読み込み完了したらフラグを立てる
    window.addEventListener("load", () => {
        loadingComplete = true;
    });

    const interval = setInterval(() => {
        if (progress < 99 || loadingComplete) {
            progress++;
            progressEl.value = progress;
        }

        if (progress >= 100 && loadingComplete) {
            clearInterval(interval);

            const minDisplayTime = 2000;
            const elapsed = performance.now() - window.__loadingStart;
            const delay = Math.max(minDisplayTime - elapsed, 0);

            setTimeout(() => {
                loader.classList.add("loaded");
            }, delay);
        }
    }, 20); // バーの進行速度
});


function handleBgSpFadeOnScroll() {
    const mvVideo = document.querySelector('.mv-video'); // MVの動画
    const mvCatch = document.querySelector('.catch2'); // MVのキャッチコピー
    const mvAward = document.querySelector('.mv-award'); // MVの受賞歴
    const mvSection = document.querySelector('#mv'); // MVセクション（基準位置）
    const header = document.querySelector('#header'); // ヘッダー

    if (!mvVideo || !mvSection || !header) return;

    let isBlurRemoved = false;
    let isHeaderShown = false;

    // ヘッダー初期状態は非表示
    header.style.opacity = '0';
    header.style.pointerEvents = 'none';


    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const mvBottom = mvSection.offsetTop + mvSection.offsetHeight;

        // ① blur 処理（10px → none）
        if (scrollY > 10 && !isBlurRemoved) {
            mvVideo.style.filter = 'none';
            mvCatch.style.opacity = '0';
            mvAward.style.opacity = '0';
            isBlurRemoved = true;
        } else if (scrollY <= 10 && isBlurRemoved) {
            mvVideo.style.filter = 'blur(5px)';
            mvCatch.style.opacity = '1';
            mvAward.style.opacity = '0.8';
            isBlurRemoved = false;
        }

        // ② MVを過ぎたらヘッダー表示
        if (scrollY > mvBottom && !isHeaderShown) {
            header.style.opacity = '1';
            header.style.pointerEvents = 'auto';
            isHeaderShown = true;
        } else if (scrollY <= mvBottom && isHeaderShown) {
            header.style.opacity = '0';
            header.style.pointerEvents = 'none';
            isHeaderShown = false;
        }
    });
}

handleBgSpFadeOnScroll();



//ーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーー
//各タイトルがモーダル開閉時の動き
//ーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーー
function moveTitleSmoothly(titleElement) {
    const rect = titleElement.getBoundingClientRect();
    const currentX = rect.left;
    const currentY = rect.top;

    // 画面幅で条件分岐（スマホは768px以下とする）
    const isMobile = window.innerWidth <= 768;

    // 目標位置（スマホとPCで分ける）
    const targetX = isMobile ? 20 : 60;
    const targetY = isMobile ? 96 : 60;
    const targetCSC = isMobile ? 20 : 60;

    const deltaX = targetX - currentX;
    const deltaY = targetY - currentY;
    const deltaCSC = targetCSC - currentY;

    // 初期化（今の位置にピタッと固定）
    titleElement.style.transform = `translate(0, 0)`;
    titleElement.style.transition = 'none';

    // 次のフレームでアニメーション発動
    requestAnimationFrame(() => {
        if (
            titleElement.matches('#cast .js-title') ||
            titleElement.matches('#staff .js-title') ||
            titleElement.matches('#comment .js-title')
        ) {
            // transform と font-size 両方の transition をまとめる
            titleElement.style.transition = 'transform 1s ease';

            // 子要素 .title にも font-size の transition を適用
            const childTitle = titleElement.querySelector('.title');
            if (childTitle) {
                childTitle.style.transition = 'font-size 1s ease';
            }

            titleElement.style.transform = `translate(${deltaX}px, ${deltaCSC}px)`;

            // #comment .js-title のときだけ子要素 .title の font-size を変更
            if (titleElement.matches('#comment .js-title') && childTitle) {
                childTitle.classList.add('-open'); // ← 追加
            }

        } else {
            titleElement.style.transition = 'transform 1s ease';
            titleElement.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
        }
    });
}

function resetTitlePosition(titleElement) {
    titleElement.style.transition = 'transform 2s ease';
    titleElement.style.transform = `translate(0, 0)`; // 元の位置に戻すだけ！

    // #comment .js-title の場合、子要素 .title の font-size も戻す
    if (titleElement.matches('#comment .js-title')) {
        const childTitle = titleElement.querySelector('.title');
        if (childTitle) {
            childTitle.style.transition = 'font-size 2s ease';
            childTitle.classList.remove('-open'); // ← 追加
        }
    }
}


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

// window.addEventListener('resize', () => {
//     if (section.classList.contains('-active')) {
//         moveTitleSmoothly(titleElement); // 再調整
//     }
// });


//ーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーー
//PC版とSP版の動画切り替え
//ーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーー

const videoMap = {
    "mv-video": {
        pc: "./assets/video/01_pc_v3.mp4",
        sp: "./assets/video/01_sp_v3.mp4",
    },
    "story-video": {
        pc: "./assets/video/02_pc_v3.mp4",
        sp: "./assets/video/02_sp_v3.mp4",
    },
    "normal": {
        pc: "./assets/video/03_pc_v3.mp4",
        sp: "./assets/video/03_sp_v3.mp4",
    },
    "teaser": {
        pc: "./assets/video/05_pc.mp4",
        sp: "./assets/video/05_sp.mp4",
    },
    "footer-video": {
        pc: "./assets/video/04_pc_v3.mp4",
        sp: "./assets/video/04_sp_v3.mp4",
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

    const blurLayer = section.querySelector('.blur-layer');
    const navList = section.querySelector('.js-nav-logo');
    const text = section.querySelector('.js-text');
    const inner = section.querySelector('.js-inner');
    const allText = section.querySelector('.js-all-text');
    const textBox = section.querySelector('.js-text-box');
    const title = section.querySelector('.js-title');
    const btn = section.querySelector('.js-btn');
    const sns = section.querySelector('.js-sns');
    const ModalBox = section.querySelector('.js-modal-box');

    // 他のセクションをまとめて取得
    const trailer = document.querySelector('#trailer');
    const story = document.querySelector('#story');
    const intro = document.querySelector('#intro');
    const header = document.querySelector('#header');

    // セクション配列
    const sections = [trailer, story, intro, header];
    const html = document.documentElement;

    const buttons = section.querySelectorAll(buttonSelector);

    buttons.forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault();

            // 対象要素を一括トグル
            blurLayer?.classList.toggle('-active');
            navList?.classList.toggle('-active');
            text?.classList.toggle('-active');
            inner?.classList.toggle('-active');
            allText?.classList.toggle('-active');
            textBox?.classList.toggle('-active');
            title?.classList.toggle('-active');
            btn?.classList.toggle('-active');
            ModalBox?.classList.toggle('-active');
            sns?.classList.toggle('-active');
            section.classList.toggle('-active');

            const isActive = section.classList.contains('-active');

            if (isActive) {
                disableScroll();
                moveTitleSmoothly?.(title);
                html.classList.add('noscroll');

                // 他のセクションだけ opacity:0 に
                sections.forEach(s => {
                    if (s && s !== section) {
                        s.style.setProperty('opacity', '0');
                        s.style.setProperty('pointer-events', 'none');
                    }
                });

            } else {
                enableScroll();
                resetTitlePosition?.(title);
                html.classList.remove('noscroll');

                // 全セクションを戻す
                sections.forEach(s => {
                    if (s) {
                        s.style.setProperty('opacity', '1');
                        s.style.setProperty('pointer-events', 'auto');
                    }
                });
            }
        });
    });
}

// 各セクションに適用
setupToggle('#header', '#header .button');
setupToggle('#intro', '#intro .button');
setupToggle('#story', '#story .button');



//ーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーー
// ハンバーガーメニュー内リンククリック時の処理
//ーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーZ

document.querySelectorAll('#header .nav-list a[href^="#"]').forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault();

        // メニューを閉じる（-activeクラスを削除）
        const header = document.getElementById('header');
        const html = document.documentElement;

        header.classList.remove('-active');
        html.classList.remove('noscroll');

        // ブラーやモーダル関連のクラスも解除
        header.querySelector('.js-modal-box')?.classList.remove('-active');
        header.querySelector('.js-blur-layer')?.classList.remove('-active');
        header.querySelector('.js-nav-logo')?.classList.remove('-active');
        header.querySelector('.js-all-text')?.classList.remove('-active');
        header.querySelector('.js-btn')?.classList.remove('-active');

        // スクロール先ID取得
        const targetId = link.getAttribute('href').replace('#', '');
        const targetEl = document.getElementById(targetId);
        const headerHeight = document.querySelector('header')?.offsetHeight || 0;

        // スクロール
        if (targetEl) {
            const pos = targetEl.getBoundingClientRect().top + window.pageYOffset - headerHeight;
            window.scrollTo({
                top: pos,
                behavior: 'smooth'
            });
        }

        // スクロールを再有効化（lenis使用時）
        enableScroll();
    });
});



//ーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーー
//cast,staff,commentのモーダルのアニメーション
//ーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーー
document.addEventListener('DOMContentLoaded', () => {
    const html = document.documentElement;

    // ===== 共通 =====
    const header = document.getElementById('header');
    const staff = document.getElementById('staff');
    const cast = document.getElementById('cast');

    // ===== CAST =====
    const castButtons = document.querySelectorAll('#cast .cast-list button, #cast .cast-list img');
    const castModalBoxes = document.querySelectorAll('#cast .modal-box.js-modal-box');
    const castLists = document.querySelector('#cast .cast-lists');
    const castTitle = document.querySelector('#cast .js-title');
    const castCloseButtons = document.querySelectorAll('#cast .modal-box .close-button');

    // ===== STAFF =====
    const staffButtons = document.querySelectorAll('#staff .staff-list button');
    const staffModalBoxes = document.querySelectorAll('#staff .modal-box.js-modal-box');
    const staffLists = document.querySelector('#staff .staff-lists');
    const staffTitle = document.querySelector('#staff .js-title');
    const staffCloseButtons = document.querySelectorAll('#staff .modal-box .close-button');

    // ===== COMMENT =====
    const commentButtons = document.querySelectorAll('#comment .comment-button button');
    const commentModalBoxes = document.querySelectorAll('#comment .modal-box.js-modal-box');
    const commentLists = document.querySelector('#comment .comment-lists-container');
    const commentTitle = document.querySelector('#comment .js-title');
    const commentCloseButtons = document.querySelectorAll('#comment .modal-box .close-button');

    // ===== CAST ボタン =====
    // castButtons.forEach(button => {
    //     button.addEventListener('click', () => {
    //         // 対象となる親の cast-list を取得
    //         const castList = button.closest('.cast-list');
    //         if (!castList) return;

    //         const targetKey = castList.getAttribute('data-target');
    //         if (!targetKey) return;

    //         // 該当のモーダルを取得
    //         const targetModal = document.querySelector(`#cast .modal-box.-${targetKey}`);
    //         if (!targetModal) return;

    //         // 表示切り替えなどの共通処理
    //         if (castLists) {
    //             castLists.style.transition = 'opacity 0.5s ease';
    //             castLists.style.opacity = '0';
    //             castLists.style.pointerEvents = 'none';
    //         }

    //         if (header) {
    //             disableScroll();
    //             html.classList.add('noscroll');
    //             header.style.opacity = '0';
    //             header.style.pointerEvents = 'none';
    //         }

    //         if (staff) {
    //             staff.style.opacity = '0';
    //             staff.style.pointerEvents = 'none';
    //         }

    //         moveTitleSmoothly?.(castTitle);

    //         targetModal.classList.add('-active');
    //     });
    // });

    // // ===== CAST 閉じるボタン =====
    // castCloseButtons.forEach(closeButton => {
    //     closeButton.addEventListener('click', () => {
    //         const targetModal = closeButton.closest('.modal-box');
    //         if (targetModal) {
    //             targetModal.classList.remove('-active');
    //         }

    //         if (castLists) {
    //             castLists.style.transition = 'opacity 0.5s ease 1.2s';
    //             castLists.style.opacity = '1';
    //             castLists.style.pointerEvents = 'auto';
    //         }

    //         resetTitlePosition?.(castTitle);

    //         enableScroll();
    //         html.classList.remove('noscroll');

    //         if (header) {
    //             header.style.opacity = '1';
    //             header.style.pointerEvents = 'auto';
    //         }

    //         if (staff) {
    //             staff.style.opacity = '1';
    //             staff.style.pointerEvents = 'auto';
    //         }
    //     });
    // });

    // ==== CAST: JSON + 遅延 fetch ==============================
    (() => {
    const listWrap   = document.querySelector('#cast .cast-lists');
    const overlay    = document.getElementById('castOverlay');
    const contentBox = document.getElementById('castContent');
    const closeBtn   = document.getElementById('castClose');
    const cache      = new Map();

    // 1) リストクリック
    listWrap.addEventListener('click', async (e) => {
        const li = e.target.closest('.cast-list');
        if (!li) return;


        // 表示切り替えなどの共通処理
        // if (castLists) {
        //     castLists.style.transition = 'opacity 0.5s ease';
        //     castLists.style.opacity = '0';
        //     castLists.style.pointerEvents = 'none';
        // }

        if (header) {
            disableScroll();
            html.classList.add('noscroll');
            header.style.opacity = '0';
            header.style.pointerEvents = 'none';
        }

        // if (staff) {
        //     staff.style.opacity = '0';
        //     staff.style.pointerEvents = 'none';
        // }

        moveTitleSmoothly?.(castTitle);

        // targetModal.classList.add('-active');


        const id = li.dataset.target;            // "ishikawa"
        contentBox.innerHTML = 'Loading…';
        overlay.classList.remove('hidden');

        // 2) JSON 取得（キャッシュあり）
        let data = cache.get(id);
        if (!data) {
        data = await fetch(`/assets/json/${id}.json`).then(r => r.json());
        cache.set(id, data);
        }        

        // 3) HTML を流し込む
        contentBox.innerHTML = `
            <img class="cast-bg-img" src="${data.photo}" alt="${data.name}">
            <div class="cast-bg"></div>
            <div class="cast-modal">
                <div class="cast-profile">
                    <div class="cast-profile-inner">
                        <img src="${data.photo}" alt="${data.name}">
                        <p class="cast-role -modal">${data.role}</p>
                        <h2 class="cast-name -modal">${data.name}</h2>
                    </div>
                </div>
                <div class="cast-det" data-lenis-prevent>
                    <div class="cast-det-inner">
                        <h3 class="cast-profile-title">PROFILE</h3>
                        <p class="cast-profile-text">${data.profile}</p>
                        <h3 class="cast-comment-title">COMMENT</h3>
                        <p class="cast-comment-text">${data.comment}</p>
                    </div>
                </div>
            </div>
        `;        
    });

    // 4) 閉じる & メモリ解放
    closeBtn.addEventListener('click', () => {
        const img = contentBox.querySelector('img');
        if (img) img.src = '';          // GPU / Heap から即解放
        contentBox.innerHTML = '';
        overlay.classList.add('hidden');

        resetTitlePosition?.(castTitle);

        enableScroll();
        html.classList.remove('noscroll');

    });
    })();



    // ===== STAFF ボタン =====
    staffButtons.forEach((button, index) => {
        button.addEventListener('click', () => {
            if (staffLists) {
                staffLists.style.transition = 'opacity 0.5s ease';
                staffLists.style.opacity = '0';
                staffLists.style.pointerEvents = 'none';
            }

            if (header) {
                disableScroll();
                html.classList.add('noscroll');
                header.style.opacity = '0';
                header.style.pointerEvents = 'none';
            }

            if (cast) {
                cast.style.opacity = '0';
                cast.style.pointerEvents = 'none';
            }

            moveTitleSmoothly?.(staffTitle);

            const targetModal = staffModalBoxes[index];
            if (targetModal) {
                targetModal.classList.add('-active');
            }
        });
    });

    // ===== STAFF 閉じるボタン =====
    staffCloseButtons.forEach(closeButton => {
        closeButton.addEventListener('click', () => {
            const targetModal = closeButton.closest('.modal-box');
            if (targetModal) {
                targetModal.classList.remove('-active');
            }

            if (staffLists) {
                staffLists.style.transition = 'opacity 0.5s ease 1.2s';
                staffLists.style.opacity = '1';
                staffLists.style.pointerEvents = 'auto';
            }

            resetTitlePosition?.(staffTitle);

            enableScroll();
            html.classList.remove('noscroll');

            if (header) {
                header.style.opacity = '1';
                header.style.pointerEvents = 'auto';
            }

            if (cast) {
                cast.style.opacity = '1';
                cast.style.pointerEvents = 'auto';
            }

        });
    });

    // ===== COMMENT ボタン =====
    commentButtons.forEach((button, index) => {
        button.addEventListener('click', () => {

            // ===== js-tab-comment の-activeをリセットし、-famousに付与 =====
            document.querySelectorAll('.js-tab-comment').forEach(btn => btn.classList.remove('-active'));
            document.querySelector('.js-tab-comment.-famous')?.classList.add('-active');

            if (commentLists) {
                commentLists.style.transition = 'opacity 0.5s ease';
                commentLists.style.opacity = '0';
                commentLists.style.pointerEvents = 'none';
            }

            if (header) {
                disableScroll();
                html.classList.add('noscroll');
                header.style.opacity = '0';
                header.style.pointerEvents = 'none';
            }

            moveTitleSmoothly?.(commentTitle);

            if (staffTitle) {
                staffTitle.style.opacity = '0';
                staffTitle.style.pointerEvents = 'none';
            }

            const targetModal = commentModalBoxes[index];
            if (targetModal) {
                targetModal.classList.add('-active');
            }

            // モーダルが開いたら、著名人のコメントを有効化
            const famousList = document.querySelector('.comment-lists.-modal.-famous');
            const famousListwrap = document.querySelector('.comment-lists-wrap.-famous');
            if (famousList) {
                famousList.style.opacity = '1';
                famousList.style.pointerEvents = 'auto';
                famousListwrap.style.opacity = '1';
                famousListwrap.style.pointerEvents = 'auto';
            }


        });
    });

    // ===== COMMENT 閉じるボタン =====
    commentCloseButtons.forEach(closeButton => {
        closeButton.addEventListener('click', () => {
            const targetModal = closeButton.closest('.modal-box');
            if (targetModal) {
                targetModal.classList.remove('-active');
            }

            // モーダルを閉じたら、コメントは無効化
            const commentlists = document.querySelectorAll('.comment-lists.-modal');
            const commentListsWrap = document.querySelectorAll('.comment-lists-wrap');            
            commentlists.forEach(commentlist => {
                commentlist.style.opacity = '0';
                commentlist.style.pointerEvents = 'none';
            });
            commentListsWrap.forEach(commentlistwrap => {
                commentlistwrap.style.opacity = '0';
                commentlistwrap.style.pointerEvents = 'none';
            });



            if (commentLists) {
                commentLists.style.transition = 'opacity 0.5s ease 1.2s';
                commentLists.style.opacity = '1';
                commentLists.style.pointerEvents = 'auto';
            }

            resetTitlePosition?.(commentTitle);

            if (staffTitle) {
                staffTitle.style.opacity = '1';
                staffTitle.style.pointerEvents = 'auto';
            }

            enableScroll();
            html.classList.remove('noscroll');

            if (header) {
                header.style.opacity = '1';
                header.style.pointerEvents = 'auto';
            }
        });
    });

});

//ーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーー
//castのホバー
//ーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーー
document.querySelectorAll('.cast-list').forEach(list => {
    const img = list.querySelector('img');
    const button = list.querySelector('.cast-button');

    if (img && button) {
        // ボタンにホバー：1.2倍
        button.addEventListener('mouseenter', () => {
            img.style.transform = 'scale(1.05)';
            button.style.backgroundColor = 'rgba(255, 255, 255, 0.25)';
        });
        button.addEventListener('mouseleave', () => {
            img.style.transform = 'scale(1)';
            button.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
        });

        // 画像にホバー：1.2倍
        img.addEventListener('mouseenter', () => {
            img.style.transform = 'scale(1.05)';
            button.style.backgroundColor = 'rgba(255, 255, 255, 0.25)';
        });
        img.addEventListener('mouseleave', () => {
            img.style.transform = 'scale(1)';
            button.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
        });
    }
});

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
    "#trailer .video-wrapper", // アニメーションしたい要素
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
            toggleActions: "play none play reverse",
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
            trigger: "#cast",
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

gsap.utils.toArray('.cast-list').forEach((el) => {
    gsap.fromTo(
        el,
        {
            autoAlpha: 0, // 最初は透明
        },
        {
            autoAlpha: 1, // 出てくると透明解除
            duration: 2,
            ease: "power2.out",
            scrollTrigger: {
                trigger: el,
                start: 'bottom bottom',
                toggleActions: 'play none none none' // 一度だけ
            }
        }
    );
});

gsap.fromTo(
    ".staff .staff-bg-box",
    {
        autoAlpha: 0,
    },
    {
        autoAlpha: 1,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
            trigger: ".staff",
            start: "top 40%",
            toggleActions: "play reverse play reverse",
            onEnter: () => {
                container.style.overflow = "visible";
                inners.forEach(inner => {
                    inner.style.overflow = "hidden"; // ← 各.innerに適用
                });
            },
        },
    }
);


gsap.fromTo(
    ".staff .staff-bg.-two",
    {
        autoAlpha: 0,
    },
    {
        autoAlpha: 1,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
            trigger: ".gsap-trigger",
            start: "top 40%",
            toggleActions: "play reverse play reverse",
        },
    }
);



gsap.fromTo(
    "#comment video", // アニメーションしたい要素
    {
        autoAlpha: 0, // アニメーション開始前（透明）
    },
    {
        autoAlpha: 1, // アニメーション後（表示）
        duration: 1, // アニメーションの時間
        ease: "power2.out",
        scrollTrigger: {
            trigger: "#comment", // アニメーションを発動させるトリガー要素
            start: "top center", // #footer の上端が画面の上端に来たら発動
            toggleActions: "play reverse play reverse",
            onEnter: () => {    // 潜る映像は頭から再生
                const video = document.querySelector("#comment video");
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

gsap.fromTo(
    "#comment .comment-lists-container",
    {
        autoAlpha: 0,
    },
    {
        autoAlpha: 1,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
            trigger: "#comment",
            start: "top 20%",
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
            start: "center center", // #footer の上端が画面の上端に来たら発動
            toggleActions: "play reverse play reverse",
        },
    }
);



// MVのアニメーション
window.addEventListener('load', () => {
    // lenis.stop();
    const isMobile = window.innerWidth <= 768;
    const tl = gsap.timeline();

    gsap.set(".mv-sns", {
        autoAlpha: 0,
    });

    tl.to('#lottie-animation', {
        opacity: 1,
        delay: 1,
        onComplete: () => {
            lottie.loadAnimation({
                container: document.getElementById('lottie-animation'),
                renderer: 'svg',
                loop: false,
                autoplay: true,
                path: './assets/json/data.json'
            });
        }
    });

    tl.to('.bg-black', {
        duration: 6,
        opacity: 0,
        ease: 'power2.inOut',
        delay: 3,
    }, '-=4.0');

    tl.to('.catch2', {
        opacity: 1,
        ease: 'power1.out',
        duration: 1,
    });

    tl.to('.mv-award', {
        opacity: 0.8,
        ease: 'power1.out',
        duration: 1,
    }, '<');

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




// スクロールヌルヌル
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
        "./assets/img/01_sp_poster.webp",
        "./assets/img/01_pc_poster.webp"
    );
    setVideoWithPoster(
        "story-video",
        "./assets/img/02_sp_poster_v2.webp",
        "./assets/img/02_pc_poster.webp"
    );
    setVideoWithPoster(
        "trailer-video",
        "./assets/img/03_sp_poster.webp",
        "./assets/img/03_pc_poster.webp"
    );
    setVideoWithPoster(
        "footer-video",
        "./assets/img/04_sp_poster_v2.webp",
        "./assets/img/04_pc_poster.webp"
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
        const triggerSelector = `#${id.replace("-video", "")}`;
        ScrollTrigger.create({
            trigger: triggerSelector,
            start: "top 100%", // 動画が画面に近づいたら読み込み
            once: true,
            onEnter: () => {
                const video = document.getElementById(id);
                if (video) {
                    video.setAttribute("preload", "none"); // プリロードを無効化
                    setVideoWithPoster(
                        id,
                        videoMap[id].sp.replace(".mp4", "_poster.webp"),
                        videoMap[id].pc.replace(".mp4", "_poster.webp")
                    );
                }
            },
        });
    });
});



//ーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーー
// Trailerとcommentのタブの切り替え
//ーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーー
document.addEventListener('DOMContentLoaded', function () {
    // -------------------
    // 🎥 MOVIE TABS
    // -------------------
    const movieButtons = document.querySelectorAll('.js-tab-movie');
    const movieBoxes = document.querySelectorAll('.js-movie');

    const normalVideo = document.getElementById('normal');
    const teaserVideo = document.getElementById('teaser');

    movieButtons.forEach(button => {
        button.addEventListener('click', () => {
            const type = button.classList.contains('-teaser') ? '-teaser' : '-normal';

            movieButtons.forEach(btn => btn.classList.remove('-active'));
            button.classList.add('-active');

            movieBoxes.forEach(box => {
                if (box.classList.contains(type)) {
                    box.style.opacity = '1';
                    box.style.pointerEvents = 'auto';
                } else {
                    box.style.opacity = '0';
                    box.style.pointerEvents = 'none';
                }
            });

            if (type === '-normal') {
                const tl = gsap.timeline();

                // teaser を fade out
                tl.to(teaserVideo, {
                    opacity: 0,
                    duration: 0.3
                })
                    // 完全に消えたら zIndex を下げる
                    .set(teaserVideo, {
                        delay: 0.5,
                        zIndex: -2
                    })
                    // normal を上に出す
                    .set(normalVideo, {
                        zIndex: -1
                    })
                    .to(teaserVideo, {
                        opacity: 1,
                        duration: 0
                    });

            } else {
                const tl = gsap.timeline();

                // normal を fade out
                tl.to(normalVideo, {
                    opacity: 0,
                    duration: 0.3
                })
                    // 完全に消えたら zIndex を下げる
                    .set(normalVideo, {
                        delay: 0.5,
                        zIndex: -2
                    })
                    // teaser を上に出す
                    .set(teaserVideo, {
                        zIndex: -1
                    })
                    // teaser を fade in
                    .to(normalVideo, {
                        opacity: 1,
                        duration: 0
                    });
            }
        });
    });

    // -------------------
    // 💬 COMMENT TABS
    // -------------------
    const commentButtons = document.querySelectorAll('.js-tab-comment');
    const commentListsWrap = document.querySelectorAll('.comment-lists-wrap');
    const commentLists = document.querySelectorAll('.comment-lists.-modal');

    commentButtons.forEach(button => {
        button.addEventListener('click', () => {
            const type = button.classList.contains('-famous') ? '-famous' : '-audience';

            // 1) ボタンのアクティブ切り替え
            commentButtons.forEach(btn => btn.classList.remove('-active'));
            button.classList.add('-active');

            // 2) 親モーダルボックス取得
            const modalBox = button.closest('.comment-modal-box');

            if (modalBox && modalBox.classList.contains('-active')) {
                // ✅ 親が -active なら type に合わせて表示切り替え

                commentLists.forEach(list => {
                    if (list.classList.contains(type)) {
                        list.style.opacity = '1';
                        list.style.pointerEvents = 'auto';
                    } else {
                        list.style.opacity = '0';
                        list.style.pointerEvents = 'none';
                    }
                });
                commentListsWrap.forEach(wrap => {
                    if (wrap.classList.contains(type)) {
                        wrap.style.opacity = '1';
                        wrap.style.pointerEvents = 'auto';
                    } else {
                        wrap.style.opacity = '0';
                        wrap.style.pointerEvents = 'none';
                    }
                });

            

            } else {
                // ✅ 親が -active じゃない場合は全て無効化
                commentLists.forEach(list => {
                    list.style.opacity = '0';
                    list.style.pointerEvents = 'none';
                });
                commentListsWrap.forEach(list => {
                    list.style.opacity = '0';
                    list.style.pointerEvents = 'none';
                });            
            }
        });
    });

    // -------------------
    // ✅ 初期化
    // -------------------
    const defaultMovie = document.querySelector('.js-tab-movie.-normal');
    const defaultComment = document.querySelector('.js-tab-comment.-famous');

    if (defaultMovie) defaultMovie.click();
    if (defaultComment) defaultComment.click();
});





