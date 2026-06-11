document.addEventListener('DOMContentLoaded', async () => {
    const galleryGrid = document.getElementById('galleryGrid');
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    const modal = document.getElementById('imageModal');
    const modalSlider = document.getElementById('modalSlider');
    const paginationDots = document.getElementById('paginationDots');
    const nextPreviewBtn = document.getElementById('nextPreviewBtn');
    const sendBtn = document.querySelector('.action-btn.primary');
    const autoPlayToggle = document.getElementById('autoPlayToggle');
    const shutterBtn = document.querySelector('.shutter-inner');
    const notification = document.getElementById('notification');
    const sliderLoading = document.getElementById('sliderLoading');
    const profileBtn = document.getElementById('profileBtn');
    const musicModal = document.getElementById('musicModal');
    const closeMusicBtn = document.querySelector('.close-music-btn');
    const downloadBtn = document.getElementById('downloadBtn');
    const playlistEl = document.getElementById('playlist');
    const appContainer = document.querySelector('.app-container');
    const calendarBtn = document.querySelector('.tab-item.history') || document.querySelector('.fa-calendar-days')?.parentElement;
    const calendarModal = document.getElementById('calendarModal');
    const closeCalendarBtn = document.querySelector('.close-calendar-btn');
    const calendarScrollArea = document.getElementById('calendarScrollArea');
    const chatBtn = document.querySelector('.tab-item.chat') || document.querySelector('.fa-comment')?.parentElement;
    const chatListModal = document.getElementById('chatListModal');
    const chatDetailModal = document.getElementById('chatDetailModal');
    const closeChatListBtn = document.querySelector('.close-chat-list-btn');
    const backChatBtn = document.querySelector('.back-chat-btn');
    const mainChatItem = document.getElementById('mainChatItem');
    const chatMessagesContainer = document.getElementById('chatMessages');
    const deviceWrapper = document.querySelector('.device-wrapper') || document.body;
    const welcomeScreen = document.getElementById('welcome-screen');
    const megaphoneBtn = document.getElementById('megaphoneBtn');
    const infoModal = document.getElementById('infoModal');
    const infoCloseBtn = document.getElementById('infoCloseBtn');
    const cakeInstructions = document.querySelector('.cake-instructions');

    // Welcome screen handling (MOVED DOWN)

    // Music Player Variables
    const musicAlbumArt = document.getElementById('musicAlbumArt');
    const musicSongTitle = document.getElementById('musicSongTitle');
    const musicProgressBar = document.getElementById('musicProgressBar');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const currentTimeEl = document.getElementById('currentTime');
    const durationEl = document.getElementById('duration');

    const songs = [
        { 
            title: "Ai Ngoài Anh 💖", 
            src: "style/sound/VSTRA - Ai Ngoài Anh (Official Audio) [cthtCRmTcgA] (mp3cut.net).mp3", 
            img: "style/img/image.png" 
        },
        { 
            title: "Đây Là Bài Hát Sinh Nhật 🎂", 
            src: "style/sound/ĐÂY LÀ BÀI HÁT SINH NHẬT (Lyric Video) _ Bùi Công Nam x Cái Lò Nướng x Fillinus [2-V3-WM-T-Y] (mp3cut.net).mp3", 
            img: "style/img/happy_birthday_cover.png" 
        }
    ];

    let songIndex = 0;
    let isPlaying = false;
    const audio = new Audio();

    const emojiList = ['🥰', '❤️', '💝', '💖', '🌹', '🍀', '🎁'];

    let messages = [];
    let birthdayDate = null;
    let chatMessages = [
        "12/06, một em bé siêu đáng yêu đột ngột bước sang tuổi 18 rực rỡ 🎁💖",
        "Và em ấy hiện đang là người anh đang theo đuổi ☺️",
        "Chúc mừng sinh nhật em nhaaaa 🎂",
        "Mong em luôn xinh, luôn vui, luôn ngủ đủ giấc",
        "Và bớt vô tư lại 🥺",
        "Anh biết đôi lúc anh hơi khờ...hơi nhây...hơi phiền",
        "Nhưng mà...",
        "Vẫn bỏ qua cho anh nha 😭🙏",
        "Cảm ơn em vì đã ở đây",
        "Nói chung là...",
        "Anh mê em dữ lắm 😭💖",
        "Happy Birthday người anh iuu 🫶"
    ];
    let hasLoadedChat = false;

    const loadInformation = async () => {
        try {
            const response = await fetch('style/information.txt');
            if (response.ok) {
                const text = await response.text();
                const birthdayMatch = text.match(/birthday\s*=\s*(\d+)\s*-\s*(\d+)\s*-\s*(\d+)/);
                if (birthdayMatch) {
                    birthdayDate = {
                        day: parseInt(birthdayMatch[1]),
                        month: parseInt(birthdayMatch[2]),
                        year: parseInt(birthdayMatch[3])
                    };
                }

                // Parse multi-line chat message block
                const messageMatch = text.match(/message\s*=\s*'([\s\S]*?)'/);
                if (messageMatch) {
                    const messageBlock = messageMatch[1].trim();
                    chatMessages = messageBlock
                        .split('\n')
                        .map(line => line.trim())
                        .filter(msg => msg.length > 0);
                } else {
                    // Fallback to single line format
                    const lines = text.split('\n');
                    const parsedMessages = lines
                        .filter(line => line.trim().startsWith('message='))
                        .map(line => {
                            const content = line.split('message=')[1].trim();
                            return content.replace(/^['"]|['"]$/g, '');
                        })
                        .filter(msg => msg.length > 0);
                    if (parsedMessages.length > 0) {
                        chatMessages = parsedMessages;
                    }
                }
            }
        } catch (error) {
            console.error("Error loading information.txt", error);
        }
    };
    await loadInformation();

    try {
        const response = await fetch('style/message.txt');
        if (!response.ok) throw new Error("message.txt not found");
        const text = await response.text();
        messages = text.split('\n').map(m => m.trim()).filter(m => m.length > 0);
    } catch (error) {
        messages = ["madiu"];
    }

    const images = [
        "style/img/z7919142221297_0db8588409a77673c640c35887dbbdb5.jpg",
        "style/img/z7919142222110_0aac68ccfcebb88a0ec30fe47cd86a94.jpg",
        "style/img/z7919142223486_220c06adb2dca3a542258e8d71bf4310.jpg",
        "style/img/z7919142223931_432b6639a27e3c8ae373dba9fc58b8e6.jpg",
        "style/img/z7919142224139_ae6ca736a323f1e32665313784b13678.jpg",
        "style/img/z7919142224673_234f5026431eca40ff594af03ac67d3d.jpg",
        "style/img/z7919142224917_b063b715ff002d52a65e0dc17da58837.jpg",
        "style/img/z7919142225710_9efed27a4d2ba5bde2b5b0f43727bf9f.jpg",
        "style/img/z7919142226318_0af59c770b35f6a72113e49425935c57.jpg",
        "style/img/z7920090953463_82134df1e4d7e81173e96b5c21d788b2.jpg",
        "style/img/z7920090955010_76176d21e1c4751d78707864fb264310.jpg",
        "style/img/z7920090963121_5d6a621e69ac8580532e54bba1fbe21e.jpg",
        "style/img/z7920090970439_543ac54ffecabb02cf2d9afb2f6ee145.jpg",
        "style/img/z7920090981797_c0bc0a672ef5be80b2d57ae1aeec89c1.jpg",
        "style/img/z7920090992757_b39119f2850b8e5b96839a5e104438b6.jpg",
        "style/img/z7920090994137_83720f20ca8af5f7b36b0f2b0b496f1b.jpg",
        "style/img/z7920091008545_a36c288e7a83ade60d4c040d81a26ee5.jpg",
        "style/img/z7920091013992_c74648e768d1f9c2002e07fb96ba2429.jpg",
        "style/img/z7920091017957_372c6634fadec89115b4fd26d8443d8b.jpg",
        "style/img/z7920091027521_cc1c71d19640e1d954ef4ab837cc01c2.jpg"
    ];

    let currentIndex = 0;
    let lastScrollLeft = 0;
    let swipeDirection = 'right';
    let autoPlayInterval = null;
    let autoPlayCount = 0;

    // Initialize Slider
    const initSlider = () => {
        modalSlider.innerHTML = '';
        paginationDots.innerHTML = '';
        images.forEach((src, index) => {
            const msg = messages.length > 0 ? messages[index % messages.length] : "madiu";

            const sliderItem = document.createElement('div');
            sliderItem.className = 'slider-item';
            sliderItem.innerHTML = `
                <div class="img-wrapper">
                    <img src="${src}" class="modal-content">
                    <div class="message-overlay">
                        <span>${msg}</span>
                    </div>
                </div>
            `;
            modalSlider.appendChild(sliderItem);
            const dot = document.createElement('span');
            dot.className = index === 0 ? 'dot active' : 'dot';
            paginationDots.appendChild(dot);
        });
    };
    initSlider();

    // Notification Effect on Shutter Click
    const showNotification = (message) => {
        notification.innerText = message;
        notification.classList.add('show');
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    };
    function program(delay = 200) {
        (function () {
            const _b = (s) => decodeURIComponent(escape(atob(s)));
            const _d = [
                "QuG6o24gcXV54buBbiB0aHXhu5ljIHbhu4IgRHIuR2lmdGVy",
                "VGlrdG9rOiBodHRwczovL3d3dy50aWt0b2suY29tL0Bkci5naWZ0ZXIzMDY=",
                "R2l0aHViOiBodHRwczovL2dpdGh1Yi5jb20vRHJHaWZ0ZXI="
            ];

            setTimeout(() => {
                _d.forEach(x => console.log(_b(x)));
            }, delay);
        })();
    }

    const cakeModal = document.getElementById('cakeModal');
    const cakePivot = document.querySelector('.cake-pivot');
    const closeCakeBtn = document.querySelector('.close-cake-btn');

    let isDragging = false;
    let startX, startY;
    let currentRotX = -15;
    let currentRotY = 0;

    const updateRotation = () => {
        currentRotY += 0.2; // Main slow spin

        // Tier-specific counter-rotations
        const baseWalls = document.querySelector('.tier-base .tier-side-walls');
        const topPartWalls = document.querySelector('.tier-top-part .tier-side-walls');
        const flame = document.querySelector('.flame');

        if (baseWalls) baseWalls.style.transform = `rotateY(${-currentRotY * 1.5}deg)`;
        if (topPartWalls) topPartWalls.style.transform = `rotateY(${currentRotY * 1.5}deg)`;



        if (!isDragging) {
            cakePivot.style.transform = `rotateX(${currentRotX}deg) rotateY(${currentRotY}deg)`;
        }
        requestAnimationFrame(updateRotation);
    };
    updateRotation();

    const createCylinder = (tierClass, diameter, height, numSegments, topImg, bottomImg, sideImgs) => {
        const tier = document.createElement('div');
        tier.className = `cake-tier ${tierClass}`;

        // Top face
        const top = document.createElement('div');
        top.className = 'tier-top';
        top.style.width = `${diameter}px`;
        top.style.height = `${diameter}px`;
        if (topImg) top.style.backgroundImage = `url('${topImg}')`;
        else top.style.backgroundColor = '#fff';
        top.style.transform = `translate(-50%, -50%) rotateX(90deg) translateZ(${height / 2}px)`;
        tier.appendChild(top);

        // Bottom face
        const bottom = document.createElement('div');
        bottom.className = 'tier-bottom';
        bottom.style.width = `${diameter}px`;
        bottom.style.height = `${diameter}px`;
        if (bottomImg) bottom.style.backgroundImage = `url('${bottomImg}')`;
        else bottom.style.backgroundColor = '#eee';
        bottom.style.transform = `translate(-50%, -50%) rotateX(-90deg) translateZ(${height / 2}px)`;
        tier.appendChild(bottom);

        const sideWalls = document.createElement('div');
        sideWalls.className = 'tier-side-walls';
        tier.appendChild(sideWalls);

        const segmentWidth = (Math.PI * diameter) / numSegments;
        const angleStep = 360 / numSegments;
        const radius = diameter / 2;

        for (let i = 0; i < numSegments; i++) {
            const segment = document.createElement('div');
            segment.className = 'tier-side-segment';
            segment.style.width = `${segmentWidth + 1}px`;
            segment.style.height = `${height}px`;
            if (sideImgs && sideImgs.length > 0) {
                segment.style.backgroundImage = `url('${sideImgs[i % sideImgs.length]}')`;
            } else {
                segment.style.backgroundColor = '#fff';
                segment.style.borderLeft = '1px solid #ddd';
            }
            const angle = i * angleStep;
            segment.style.transform = `translate(-50%, -50%) rotateY(${angle}deg) translateZ(${radius}px)`;
            sideWalls.appendChild(segment);
        }
        return tier;
    };

    const init3DCake = () => {
        cakePivot.innerHTML = '';
        
        // 3D Candle — centered, height 60px, translateY(-130px) puts center at -130px from cakePivot center
        // So top of candle = -130 - 30 = -160px. Flame sits at -160px - half-flame(11px) = ~-171px
        const candle3D = createCylinder('candle-3d', 12, 60, 6, '', '', []);
        candle3D.style.transform = 'translate(-50%, -50%) translateY(-130px)';
        cakePivot.appendChild(candle3D);

        // 3D Flame: 3 cross-rotated faces for volumetric look from any angle
        const flamePos = document.createElement('div');
        flamePos.className = 'flame-pos';
        flamePos.style.position = 'absolute';
        flamePos.style.top = '50%';
        flamePos.style.left = '50%';
        flamePos.style.width = '0';
        flamePos.style.height = '0';
        flamePos.style.marginTop = `-${140 + 22}px`; // sit above candle top
        flamePos.style.transformStyle = 'preserve-3d';
        
        // 3 flame faces at 0°, 60°, 120° — creates 3D volumetric flame
        [0, 60, 120].forEach(angle => {
            const face = document.createElement('div');
            face.className = 'flame';
            face.style.position = 'absolute';
            face.style.width = '14px';
            face.style.height = '26px';
            face.style.marginLeft = '-7px';
            face.style.marginTop = '-26px';
            // Pass angle as CSS variable so keyframe animation can use it
            face.style.setProperty('--angle', `${angle}deg`);
            flamePos.appendChild(face);
        });

        
        cakePivot.appendChild(flamePos);

        const shuffledImages = [...images].sort(() => Math.random() - 0.5);

        // Base Tier: Top, Bottom, and 12 side images
        const baseTop = shuffledImages[0];
        const baseBottom = shuffledImages[1];
        const baseSideImgs = shuffledImages.slice(2, 14); // 12 unique images

        // Top Tier: Top, Bottom, and 6 side images
        const topTop = shuffledImages[14];
        const topBottom = shuffledImages[15];
        const topSideImgs = shuffledImages.slice(16, 22).concat(shuffledImages.slice(0, 10)); // Use others and repeat some

        cakePivot.appendChild(createCylinder('tier-base', 340, 160, 24, baseTop, baseBottom, baseSideImgs));
        cakePivot.appendChild(createCylinder('tier-top-part', 220, 120, 18, topTop, topBottom, shuffledImages.slice(2, 20)));
    };

    const initStars = () => {
        const starsContainer = document.querySelector('.stars-container');
        if (!starsContainer) return;
        starsContainer.innerHTML = '';
        const count = 150;
        for (let i = 0; i < count; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            const size = Math.random() * 3 + 1; // Random size from 1px to 4px
            star.style.width = `${size}px`;
            star.style.height = `${size}px`;
            star.style.left = `${Math.random() * 100}%`;
            star.style.top = `${Math.random() * 100}%`;
            star.style.setProperty('--duration', `${Math.random() * 3 + 1}s`);
            star.style.animationDelay = `${Math.random() * 5}s`;
            starsContainer.appendChild(star);
        }
    };

    let fireworkInterval = null;

    const createFirework = () => {
        const fw = document.createElement('div');
        fw.className = 'firework';
        const startX = Math.random() * 80 + 10;
        // Explode higher (mostly between 60% and 95% of screen height)
        const targetHeight = -(Math.random() * 35 + 60) + 'vh';
        fw.style.left = startX + '%';
        fw.style.setProperty('--height', targetHeight);
        cakeModal.appendChild(fw);

        setTimeout(() => {
            const rect = fw.getBoundingClientRect();
            const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ffa500', '#ffffff'];
            
            const burstRadius = Math.random() * 100 + 100; // Wider bursts
            const pCount = Math.floor(Math.random() * 20 + 40); 
            
            for (let i = 0; i < pCount; i++) {
                const p = document.createElement('div');
                p.className = 'firework-particle';
                const color = colors[Math.floor(Math.random() * colors.length)];
                p.style.backgroundColor = color;
                p.style.color = color; // For currentColor box-shadow
                p.style.left = rect.left + 'px';
                p.style.top = rect.top + 'px';
                const angle = Math.random() * Math.PI * 2;
                const distance = Math.random() * burstRadius; 
                p.style.setProperty('--x', Math.cos(angle) * distance + 'px');
                p.style.setProperty('--y', Math.sin(angle) * distance + 'px');
                cakeModal.appendChild(p);
                setTimeout(() => p.remove(), 1200);
            }
            fw.remove();
        }, 1500);
    };

    const startFireworks = () => {
        if (fireworkInterval) clearInterval(fireworkInterval);
        fireworkInterval = setInterval(createFirework, 800); // Higher density
    };

    if (shutterBtn) {
        shutterBtn.onclick = () => {
            cakeModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            if (cakeInstructions) {
                cakeInstructions.style.display = 'block';
            }
            initStars();
            init3DCake();
            startFireworks();
        };
    }

    let bubbleInterval = null;
    let textBubbleInterval = null;

    const startPhotoBubbles = () => {
        if (bubbleInterval) clearInterval(bubbleInterval);
        if (textBubbleInterval) clearInterval(textBubbleInterval);

        // Photo bubble loop
        bubbleInterval = setInterval(() => {
            const bubble = document.createElement('div');
            bubble.className = 'photo-bubble';
            const img = images[Math.floor(Math.random() * images.length)];
            bubble.style.backgroundImage = `url('${img}')`;
            bubble.style.left = `${Math.random() * 100}%`;
            bubble.style.setProperty('--duration', `${Math.random() * 4 + 4}s`);
            const size = Math.random() * 40 + 40;
            bubble.style.width = `${size}px`;
            bubble.style.height = `${size}px`;
            cakeModal.appendChild(bubble);
            setTimeout(() => bubble.remove(), 8000);
        }, 300);

        // Text bubble sequence loop
        const textSequence = [
            { text: "chúc mừng 🥳", color: "#fecb2f", shadow: "rgba(254, 203, 47, 0.8)" },
            { text: "xinh nhật 🎂", color: "#ff65a3", shadow: "rgba(255, 101, 163, 0.8)" },
            { text: "iu nhé 💖", color: "#ff65a3", shadow: "rgba(255, 101, 163, 0.8)" }
        ];
        let seqIndex = 0;

        const spawnNextText = () => {
            const item = textSequence[seqIndex];
            seqIndex = (seqIndex + 1) % textSequence.length;

            const bubble = document.createElement('div');
            bubble.className = 'text-bubble';
            bubble.innerText = item.text;
            bubble.style.color = item.color;
            bubble.style.textShadow = `0 4px 15px ${item.shadow}, 0 2px 4px rgba(0, 0, 0, 0.8)`;
            bubble.style.left = `${Math.random() * 30 + 35}%`;
            bubble.style.setProperty('--duration', `${Math.random() * 3 + 4}s`);
            cakeModal.appendChild(bubble);
            setTimeout(() => bubble.remove(), 8000);
        };

        // Start immediately
        spawnNextText();
        // Spawn subsequent ones every 1.2 seconds
        textBubbleInterval = setInterval(spawnNextText, 1200);
    };

    cakePivot.ondblclick = () => {
        if (cakeInstructions) {
            cakeInstructions.style.display = 'none';
        }
        const segments = document.querySelectorAll('.tier-side-segment, .tier-top, .tier-bottom, .candle');
        segments.forEach((el, index) => {
            // Randomly split elements left or right
            if (Math.random() > 0.5) {
                el.classList.add('split-left');
            } else {
                el.classList.add('split-right');
            }
        });

        setTimeout(() => {
            cakePivot.innerHTML = ''; // Clear cake
            startPhotoBubbles();
        }, 1000);
    };

    if (closeCakeBtn) {
        closeCakeBtn.onclick = () => {
            cakeModal.style.display = 'none';
            document.body.style.overflow = 'hidden';
            if (bubbleInterval) clearInterval(bubbleInterval);
            if (textBubbleInterval) clearInterval(textBubbleInterval);
            if (fireworkInterval) clearInterval(fireworkInterval);
            document.querySelectorAll('.photo-bubble, .text-bubble, .firework, .firework-particle').forEach(b => b.remove());
        };
    }

    if (megaphoneBtn && infoModal) {
        megaphoneBtn.onclick = () => {
            infoModal.classList.add('show');
        };
    }

    if (infoCloseBtn && infoModal) {
        infoCloseBtn.onclick = () => {
            infoModal.classList.remove('show');
        };
    }

    if (infoModal) {
        infoModal.addEventListener('click', (e) => {
            if (e.target === infoModal) {
                infoModal.classList.remove('show');
            }
        });
    }
    program();

    const handleStart = (e) => {
        isDragging = true;
        startX = e.pageX || (e.touches && e.touches[0].pageX);
        startY = e.pageY || (e.touches && e.touches[0].pageY);
    };

    const handleMove = (e) => {
        if (!isDragging) return;
        const x = e.pageX || (e.touches && e.touches[0].pageX);
        const y = e.pageY || (e.touches && e.touches[0].pageY);
        const deltaX = x - startX;
        const deltaY = y - startY;
        currentRotY += deltaX * 0.5;
        currentRotX -= deltaY * 0.5;
        currentRotX = Math.max(-45, Math.min(45, currentRotX));
        cakePivot.style.transform = `rotateX(${currentRotX}deg) rotateY(${currentRotY}deg)`;
        startX = x; startY = y;
    };

    const handleEnd = () => { isDragging = false; };

    cakeModal.addEventListener('mousedown', handleStart);
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleEnd);
    cakeModal.addEventListener('touchstart', handleStart);
    window.addEventListener('touchmove', handleMove);
    window.addEventListener('touchend', handleEnd);

    // Emoji Click Effect
    let clickCounter = 0;
    modalSlider.addEventListener('click', (e) => {
        clickCounter++;
        if (clickCounter % 2 === 0) {
            const rect = appContainer.getBoundingClientRect();
            const emoji = document.createElement('div');
            emoji.className = 'floating-emoji';
            emoji.innerText = emojiList[Math.floor(Math.random() * emojiList.length)];
            emoji.style.left = (e.clientX - rect.left) + 'px';
            emoji.style.top = (e.clientY - rect.top) + 'px';
            appContainer.appendChild(emoji);
            setTimeout(() => emoji.remove(), 1500);
        }
    });

    // Auto Play
    const startAutoPlay = () => {
        if (autoPlayInterval) return;
        autoPlayCount = 0;

        autoPlayInterval = setInterval(() => {
            currentIndex = (currentIndex + 1) % images.length;
            modalSlider.scroll({ left: currentIndex * modalSlider.offsetWidth, behavior: 'smooth' });
            updateDots(currentIndex);
            updatePreviewButton();

            autoPlayCount++;
            if (autoPlayCount >= images.length) {
                stopAutoPlay();
                autoPlayToggle.checked = false;
            }
        }, 1500);
    };

    const stopAutoPlay = () => {
        clearInterval(autoPlayInterval);
        autoPlayInterval = null;
    };

    autoPlayToggle.addEventListener('change', (e) => e.target.checked ? startAutoPlay() : stopAutoPlay());

    let fillInterval, fillPercentage = 0;
    const startFilling = () => {
        if (fillInterval) return;
        fillPercentage = 0;
        fillInterval = setInterval(() => {
            fillPercentage += 2;
            const fillElement = sendBtn.querySelector('.fill-progress') || document.createElement('div');
            if (!fillElement.classList.contains('fill-progress')) {
                fillElement.className = 'fill-progress';
                fillElement.style.position = 'absolute'; fillElement.style.bottom = '0'; fillElement.style.left = '0';
                fillElement.style.width = '100%'; fillElement.style.backgroundColor = 'var(--accent-color)';
                fillElement.style.zIndex = '1'; sendBtn.appendChild(fillElement);
            }
            fillElement.style.height = fillPercentage + '%';
            if (fillPercentage >= 100) { clearInterval(fillInterval); triggerEmojiRain(); resetFill(); }
        }, 20);
    };
    const stopFilling = () => { clearInterval(fillInterval); fillInterval = null; resetFill(); };
    const resetFill = () => { fillPercentage = 0; const fillElement = sendBtn.querySelector('.fill-progress'); if (fillElement) fillElement.style.height = '0%'; };
    const triggerEmojiRain = () => {
        const overlay = document.getElementById('emoji-overlay');
        for (let i = 0; i < 40; i++) {
            setTimeout(() => {
                const emoji = document.createElement('div');
                emoji.className = 'falling-emoji'; emoji.innerText = emojiList[Math.floor(Math.random() * emojiList.length)];
                emoji.style.left = Math.random() * 100 + '%'; emoji.style.fontSize = (Math.random() * 20 + 20) + 'px';
                overlay.appendChild(emoji); setTimeout(() => emoji.remove(), 3000);
            }, i * 50);
        }
    };
    sendBtn.addEventListener('mousedown', startFilling); sendBtn.addEventListener('mouseup', stopFilling);
    sendBtn.addEventListener('mouseleave', stopFilling); sendBtn.addEventListener('touchstart', (e) => { e.preventDefault(); startFilling(); });
    sendBtn.addEventListener('touchend', stopFilling);

    const updatePreviewButton = () => {
        let targetIndex;
        if (swipeDirection === 'right') { targetIndex = currentIndex + 1; if (targetIndex >= images.length) targetIndex = currentIndex - 1; }
        else { targetIndex = currentIndex - 1; if (targetIndex < 0) targetIndex = currentIndex + 1; }
        targetIndex = Math.max(0, Math.min(images.length - 1, targetIndex));
        nextPreviewBtn.innerHTML = `<img src="${images[targetIndex]}">`;
        nextPreviewBtn.onclick = () => { modalSlider.scroll({ left: targetIndex * modalSlider.offsetWidth, behavior: 'smooth' }); };
    };

    galleryGrid.innerHTML = '';
    images.forEach((src, index) => {
        const item = document.createElement('div'); item.className = 'gallery-item';
        const img = document.createElement('img'); img.src = src; img.loading = 'lazy'; item.appendChild(img);
        item.onclick = () => {
            modal.style.display = 'flex'; document.body.style.overflow = 'hidden'; currentIndex = index; swipeDirection = 'right';
            const itemWidth = modalSlider.offsetWidth; modalSlider.scrollLeft = index * itemWidth;
            updateDots(index); updatePreviewButton();
        };
        galleryGrid.appendChild(item);
    });

    modalSlider.addEventListener('scroll', () => {
        const currentScroll = modalSlider.scrollLeft;
        if (currentScroll > lastScrollLeft + 10) swipeDirection = 'right';
        else if (currentScroll < lastScrollLeft - 10) swipeDirection = 'left';
        lastScrollLeft = currentScroll;
        const newIndex = Math.round(currentScroll / modalSlider.offsetWidth);
        if (newIndex !== currentIndex) { currentIndex = newIndex; updateDots(currentIndex); updatePreviewButton(); }
    });

    const updateDots = (activeIndex) => {
        const dots = paginationDots.querySelectorAll('.dot');
        dots.forEach((dot, i) => dot.className = i === activeIndex ? 'dot active' : 'dot');
    };

    const closePreview = () => { modal.style.display = 'none'; document.body.style.overflow = 'hidden'; autoPlayToggle.checked = false; stopAutoPlay(); };
    const closeBtn = document.querySelector('.close-preview-btn'); if (closeBtn) closeBtn.onclick = closePreview;

    // Music Player Logic
    const initPlaylist = () => {
        playlistEl.innerHTML = songs.map((song, index) => `
            <div class="playlist-item ${index === songIndex ? 'active' : ''}" data-index="${index}">
                <img src="${song.img}" class="playlist-img">
                <div class="playlist-info">
                    <span class="playlist-song-title">${song.title}</span>
                </div>
            </div>
        `).join('');

        playlistEl.querySelectorAll('.playlist-item').forEach(item => {
            item.onclick = () => {
                songIndex = parseInt(item.dataset.index);
                loadSong(songs[songIndex]);
                playSong();
                updatePlaylistUI();
            };
        });
    };

    const updatePlaylistUI = () => {
        playlistEl.querySelectorAll('.playlist-item').forEach((item, index) => {
            item.classList.toggle('active', index === songIndex);
        });
    };

    const loadSong = (song) => {
        musicSongTitle.innerText = song.title;
        musicAlbumArt.src = song.img;
        audio.src = song.src;
        updatePlaylistUI();
    };

    const playSong = () => {
        isPlaying = true;
        playPauseBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
        musicAlbumArt.parentElement.classList.add('playing');
        profileBtn.classList.add('music-playing');
        audio.play();
    };

    const pauseSong = () => {
        isPlaying = false;
        playPauseBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
        musicAlbumArt.parentElement.classList.remove('playing');
        profileBtn.classList.remove('music-playing');
        audio.pause();
    };

    const prevSong = () => {
        songIndex--;
        if (songIndex < 0) songIndex = songs.length - 1;
        loadSong(songs[songIndex]);
        if (isPlaying) playSong();
    };

    const nextSong = () => {
        songIndex++;
        if (songIndex >= songs.length) songIndex = 0;
        loadSong(songs[songIndex]);
        if (isPlaying) playSong();
    };

    const updateProgress = (e) => {
        const { duration, currentTime } = e.srcElement;
        if (duration) {
            const progressPercent = (currentTime / duration) * 100;
            musicProgressBar.style.width = `${progressPercent}%`;

            // Update time labels
            const formatTime = (time) => {
                const min = Math.floor(time / 60);
                const sec = Math.floor(time % 60);
                return `${min}:${sec < 10 ? '0' : ''}${sec}`;
            };
            currentTimeEl.innerText = formatTime(currentTime);
            durationEl.innerText = formatTime(duration);
        }
    };

    const setProgress = (e) => {
        const width = e.currentTarget.clientWidth;
        const clickX = e.offsetX;
        const duration = audio.duration;
        if (duration) audio.currentTime = (clickX / width) * duration;
    };

    // Event Listeners for Music
    playPauseBtn.onclick = () => isPlaying ? pauseSong() : playSong();
    prevBtn.onclick = prevSong;
    nextBtn.onclick = nextSong;
    audio.ontimeupdate = updateProgress;
    audio.onended = nextSong;
    document.querySelector('.progress-bar-wrapper').onclick = setProgress;

    // Welcome screen handling - Start music on entry
    if (welcomeScreen) {
        welcomeScreen.addEventListener('click', () => {
            welcomeScreen.classList.add('exit');

            // Start music immediately
            if (!audio.src) loadSong(songs[songIndex]);
            playSong();

            setTimeout(() => {
                welcomeScreen.style.display = 'none';
            }, 800);
        });
    }

    // Fallback: Tự động phát khi tương tác lần đầu (nếu trang chào mừng bị tắt)
    const playOnFirstInteraction = () => {
        if (!audio.src) {
            loadSong(songs[songIndex]);
        }
        if (!isPlaying) {
            playSong();
        }
        document.removeEventListener('click', playOnFirstInteraction);
        document.removeEventListener('touchstart', playOnFirstInteraction);
    };
    document.addEventListener('click', playOnFirstInteraction);
    document.addEventListener('touchstart', playOnFirstInteraction);

    const openMusic = () => {
        musicModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        if (!audio.src) {
            loadSong(songs[songIndex]);
        }
        initPlaylist();
    };

    const closeMusic = () => {
        musicModal.style.display = 'none';
        document.body.style.overflow = 'hidden';
    };

    if (profileBtn) profileBtn.onclick = openMusic;
    if (closeMusicBtn) closeMusicBtn.onclick = closeMusic;

    const createMonthGrid = (month, year, highlightDay = null) => {
        const section = document.createElement('div');
        section.className = 'month-section';

        const label = document.createElement('span');
        label.className = 'month-label';
        label.innerText = `Tháng ${month} ${year}`;
        section.appendChild(label);

        const grid = document.createElement('div');
        grid.className = 'calendar-grid-container';

        const firstDayOfMonth = new Date(year, month - 1, 1).getDay();
        const daysInMonth = new Date(year, month, 0).getDate();
        const emptyDotsCount = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

        for (let i = 0; i < emptyDotsCount; i++) {
            const dot = document.createElement('div');
            dot.className = 'calendar-day empty-dot';
            dot.innerText = '•';
            grid.appendChild(dot);
        }

        for (let d = 1; d <= daysInMonth; d++) {
            const dayEl = document.createElement('div');
            dayEl.className = 'calendar-day';
            dayEl.innerText = d;

            const isHighlight = highlightDay && d === highlightDay;
            const hasPhoto = isHighlight || ((!highlightDay || d < highlightDay) && Math.random() > 0.45);

            if (hasPhoto) {
                dayEl.classList.add('has-photo');
                dayEl.innerText = '';
                const randomImgIndex = Math.floor(Math.random() * images.length);
                dayEl.style.backgroundImage = `url('${images[randomImgIndex]}')`;

                if (isHighlight) {
                    dayEl.classList.add('highlight');
                    const emojiEl = document.createElement('span');
                    emojiEl.className = 'day-emoji birthday-highlight-emoji';
                    emojiEl.innerText = '🎂';
                    dayEl.appendChild(emojiEl);
                } else if (Math.random() > 0.5) {
                    const emojis = ['😵', '😗', '🌻', '🎁', '🎓', '🎈', '🎉', '😍', '🥰', '💸', '🥵', '🤬'];
                    const emojiEl = document.createElement('span');
                    emojiEl.className = 'day-emoji';
                    emojiEl.innerText = emojis[Math.floor(Math.random() * emojis.length)];
                    dayEl.appendChild(emojiEl);
                }
            }

            grid.appendChild(dayEl);
        }
        section.appendChild(grid);
        return section;
    };

    const initCalendar = () => {
        if (!birthdayDate) return;
        calendarScrollArea.innerHTML = '';

        const { day, month, year } = birthdayDate;

        let prevMonth = month - 1;
        let prevYear = year;
        if (prevMonth === 0) {
            prevMonth = 12;
            prevYear--;
        }

        calendarScrollArea.appendChild(createMonthGrid(prevMonth, prevYear));
        calendarScrollArea.appendChild(createMonthGrid(month, year, day));

        setTimeout(() => {
            calendarScrollArea.scrollTop = calendarScrollArea.scrollHeight;
        }, 100);
    };

    const openCalendar = () => {
        initCalendar();
        calendarModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    };

    const closeCalendar = () => {
        calendarModal.style.display = 'none';
        document.body.style.overflow = 'hidden';
    };

    if (calendarBtn) calendarBtn.onclick = openCalendar;
    if (closeCalendarBtn) closeCalendarBtn.onclick = closeCalendar;

    if (downloadBtn) {
        downloadBtn.onclick = () => {
            showNotification("Đây là kho báu quý giá bạn không được quyền sở hữu riêng");
        };
    }

    const initChatMessages = async () => {
        chatMessagesContainer.innerHTML = '';

        const preview = document.querySelector('.chat-preview');
        if (chatMessages.length > 0) {
            preview.innerText = chatMessages[chatMessages.length - 1];
        }

        for (const msg of chatMessages) {
            // Add typing indicator
            const typing = document.createElement('div');
            typing.className = 'message-wrapper received';
            typing.innerHTML = `
                <div class="message-avatar-tiny">
                    <img src="style/img/Avatar.jpg" alt="Avatar">
                </div>
                <div class="typing-indicator">
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                </div>
            `;
            chatMessagesContainer.appendChild(typing);
            chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;

            // Wait exactly 1 second to simulate typing
            await sleep(1000);

            // Remove typing indicator and add real message
            chatMessagesContainer.removeChild(typing);

            const wrapper = document.createElement('div');
            wrapper.className = 'message-wrapper received';
            wrapper.innerHTML = `
                <div class="message-avatar-tiny">
                    <img src="style/img/Avatar.jpg" alt="Avatar">
                </div>
                <div class="message-bubble received">${msg}</div>
            `;
            chatMessagesContainer.appendChild(wrapper);
            chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
        }
    };

    const openChatList = () => {
        chatListModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        const preview = document.querySelector('.chat-preview');
        if (chatMessages.length > 0) {
            preview.innerText = chatMessages[chatMessages.length - 1];
        }
    };

    const openChatDetail = () => {
        chatDetailModal.style.display = 'flex';
        chatListModal.style.display = 'none';

        if (!hasLoadedChat) {
            initChatMessages();
            hasLoadedChat = true;
        } else {
            chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
        }
    };

    const backToChatList = () => {
        chatDetailModal.style.display = 'none';
        chatListModal.style.display = 'flex';
    };

    const closeChat = () => {
        chatListModal.style.display = 'none';
        chatDetailModal.style.display = 'none';
        document.body.style.overflow = 'hidden';
    };

    if (chatBtn) chatBtn.onclick = openChatList;
    if (closeChatListBtn) closeChatListBtn.onclick = closeChat;
    if (mainChatItem) mainChatItem.onclick = openChatDetail;
    if (backChatBtn) backChatBtn.onclick = backToChatList;

    window.onclick = (event) => {
        if (event.target == modal) closePreview();
        if (event.target == musicModal) closeMusic();
        if (event.target == calendarModal) closeCalendar();
        if (event.target == chatListModal) closeChat();
    };
});
