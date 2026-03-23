document.addEventListener('DOMContentLoaded', async () => {
    try {
        let data = typeof portfolioData !== 'undefined' ? portfolioData : {};
        
        // Decap CMS sometimes bundles the JSON with the top-level collection name depending on config.
        // We defined name: "portfolio" in config, which results in the JSON object being directly the fields, 
        // OR wrapped in {"portfolio": {...}}. We will check both.
        if (data.portfolio) {
            data = data.portfolio;
        }

        // 1. 데이터 분류하기
        let triangleMain = [];
        let originalIpOther = [];
        if (data.original_ip) {
            data.original_ip.forEach(series => {
                if (series.series_title.includes('트라이앵글')) {
                    triangleMain = series.items || [];
                } else {
                    originalIpOther.push(series);
                }
            });
        }

        let triangleShorts = [];
        let shortFilmOther = [];
        if (data.short_film) {
            data.short_film.forEach(item => {
                if (item.title.includes('트라이앵글')) {
                    triangleShorts.push(item);
                } else {
                    shortFilmOther.push(item);
                }
            });
        }

        // Render Original IP
        const ipContainer = document.getElementById('render-original-ip');
        if (ipContainer) {
            ipContainer.innerHTML = '';
            let html = '<div class="profile-card-grid">';
            originalIpOther.forEach((series, index) => {
                html += `<div style="height: 100%;">`;
                
                let imgSrc = series.profile_image ? series.profile_image : '';
                let imgHtml = imgSrc 
                    ? `<img src="${imgSrc}" style="width: 100%; height: 100%; object-fit: cover;">`
                    : `<div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%;"><i class="ph ph-image" style="font-size: 2.5rem; color: #ccc;"></i><span style="font-size:0.8rem; color:#aaa; margin-top:0.5rem; text-align:center;">프로필 사진<br>영역</span></div>`;

                let desc = series.description ? series.description : '이곳에 간단한 설명이 들어갑니다.';

                html += `
                <div style="display: flex; flex-direction: column; align-items: center; text-align: center; gap: 1.5rem; background: #ffffff; padding: 2.5rem 1.5rem; border-radius: 12px; border: 1px solid rgba(0,0,0,0.05); box-shadow: 0 10px 30px rgba(0,0,0,0.03); height: 100%;">
                    <div style="width: 140px; height: 140px; border-radius: 50%; background: #f8f8f8; flex-shrink: 0; overflow: hidden; border: 1px dashed rgba(0,0,0,0.15); margin: 0 auto;">
                        ${imgHtml}
                    </div>
                    <div style="display: flex; flex-direction: column; flex: 1; width: 100%;">
                        <h4 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 0.8rem; color: var(--text-primary);">${series.series_title}</h4>
                        <p style="font-size: 1rem; color: var(--text-secondary); line-height: 1.6; margin-bottom: 1.5rem; white-space: pre-wrap;">${desc}</p>
                `;

                if (series.channel_link) {
                    html += `
                        <div style="margin-top: auto;">
                            <a href="${series.channel_link}" target="_blank" class="vtuber-card" style="display: inline-block; font-size: 1.05rem; padding: 0.8rem 1.5rem; margin: 0;">
                                <i class="ph ph-youtube-logo" style="color: #ff0000; font-size: 1.3rem; vertical-align: middle;"></i> 유튜브 채널 방문하기
                            </a>
                        </div>`;
                }

                html += `
                    </div>
                </div>`;

                if (series.items && series.items.length > 0) {
                    html += `<div class="video-grid" style="width: 100%; margin-top: 1.5rem;">`;
                    series.items.forEach(item => {
                        html += `
                        <div class="video-item">
                            <div class="video-wrapper"><iframe src="https://www.youtube.com/embed/${item.youtube_id}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>
                            <h4>${item.title}</h4>
                        </div>`;
                    });
                    html += `</div>`;
                }
                
                html += `</div>`;
            });
            html += `</div>`;
            ipContainer.innerHTML = html;
        }

        // Render Filming (촬영)
        const filmingContainer = document.getElementById('render-filming');
        if (filmingContainer) {
            filmingContainer.innerHTML = '';
            let html = '';
            
            // 트라이앵글 섹션 타이틀
            if (triangleMain.length > 0 || triangleShorts.length > 0) {
                html += `<h4 class="ip-series-title" style="margin-top: 0;">웹드라마 '트라이앵글'</h4>`;
            }
            
            // 본편
            if (triangleMain.length > 0) {
                html += `<h5 style="margin-bottom: 1rem; font-size: 1.15rem; color: var(--text-secondary);">[ 본편 ]</h5>`;
                html += `<div class="video-grid">`;
                triangleMain.forEach(item => {
                    html += `
                    <div class="video-item">
                        <div class="video-wrapper"><iframe src="https://www.youtube.com/embed/${item.youtube_id}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>
                        <h4>${item.title}</h4>
                    </div>`;
                });
                html += `</div>`;
            }

            // 단편
            if (triangleShorts.length > 0) {
                html += `<h5 style="margin-top: 3rem; margin-bottom: 1rem; font-size: 1.15rem; color: var(--text-secondary);">[ 단편 ]</h5>`;
                html += `<div class="video-grid">`;
                triangleShorts.forEach(item => {
                    html += `
                    <div class="video-item">
                        <div class="video-wrapper"><iframe src="https://www.youtube.com/embed/${item.youtube_id}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>
                        <h4>${item.title}</h4>
                    </div>`;
                });
                html += `</div>`;
            }

            // 남은 독립 단편들 출력
            if (shortFilmOther.length > 0) {
                html += `<h4 class="ip-series-title" style="margin-top: 4rem;">기타 단편 영화 및 MV</h4>`;
                html += `<div class="video-grid">`;
                shortFilmOther.forEach(item => {
                    html += `
                    <div class="video-item">
                        <div class="video-wrapper"><iframe src="https://www.youtube.com/embed/${item.youtube_id}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>
                        <h4>${item.title}</h4>
                    </div>`;
                });
                html += `</div>`;
            }

            filmingContainer.innerHTML = html;
        }

        // Render Awards
        const awardsContainer = document.getElementById('render-awards');
        if (awardsContainer && data.awards) {
            awardsContainer.innerHTML = '';
            if (data.awards.length > 0) {
                let html = `<div class="scroll-gallery" style="gap: 1.5rem;">`;
                data.awards.forEach(item => {
                    html += `
                    <div style="background: var(--surface-light); padding: 2rem; border-radius: 12px; height: 100%; display: flex; flex-direction: column; justify-content: center; border: 1px solid rgba(0,0,0,0.05); box-shadow: 0 4px 15px rgba(0,0,0,0.02);">
                        <span class="award-year" style="display:block; color: var(--accent-color); font-weight: 700; font-size: 1.2rem; margin-bottom: 0.8rem;">${item.year}</span>
                        <span style="font-size: 1.1rem; line-height: 1.5;">${item.title}</span>
                    </div>`;
                });
                html += `</div>`;
                awardsContainer.innerHTML = html;
            } else {
                awardsContainer.innerHTML = `<p class="empty-state">업데이트 예정입니다.</p>`;
            }
        }

        // Render Photo (formerly Snap)
        const photoContainer = document.getElementById('render-photo');
        if (photoContainer && (data.snap || data.sizzle)) {
            photoContainer.innerHTML = '';
            
            let html = '';

            // 1. Instagram Profile Links (Moved to TOP)
            html += `
            <div style="display: flex; flex-wrap: wrap; gap: 1.5rem; justify-content: center; margin-bottom: 3.5rem;">
                <a href="https://www.instagram.com/j0o.young/" target="_blank" class="insta-profile-card">
                    <div class="insta-gradient-ring">
                        <div class="insta-inner-circle">
                            <i class="ph ph-instagram-logo"></i>
                        </div>
                    </div>
                    <div style="flex: 1;">
                        <h4 style="margin: 0; font-size: 1.2rem; font-weight: 700; letter-spacing: 0.5px; color: var(--text-primary);">@j0o.young</h4>
                        <p style="margin: 0; font-size: 0.95rem; color: var(--text-secondary); margin-top: 0.2rem;">Instagram 방문하기</p>
                    </div>
                    <i class="ph ph-arrow-right insta-arrow"></i>
                </a>

                <a href="https://www.instagram.com/conger.roll/" target="_blank" class="insta-profile-card">
                    <div class="insta-gradient-ring">
                        <div class="insta-inner-circle">
                            <i class="ph ph-instagram-logo"></i>
                        </div>
                    </div>
                    <div style="flex: 1;">
                        <h4 style="margin: 0; font-size: 1.2rem; font-weight: 700; letter-spacing: 0.5px; color: var(--text-primary);">@conger.roll</h4>
                        <p style="margin: 0; font-size: 0.95rem; color: var(--text-secondary); margin-top: 0.2rem;">Instagram 방문하기</p>
                    </div>
                    <i class="ph ph-arrow-right insta-arrow"></i>
                </a>
            </div>
            `;

            // 2. Sizzle Section
            html += `<h4 style="font-size: 1.8rem; font-weight: 700; margin-bottom: 1.5rem; text-align: center; color: var(--text-primary);">Sizzle</h4>`;
            
            if (data.sizzle && data.sizzle.length > 0) {
                html += `<div class="profile-card-grid" style="margin-bottom: 4rem;">`; 
                data.sizzle.forEach(item => {
                    let imgSrc = item.image;
                    
                    let imageElement = imgSrc 
                        ? `<img src="${imgSrc}" alt="${item.title}" style="width: 100%; height: auto; display: block; object-fit: cover;">`
                        : `<div style="display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 250px; color: #aaa;"><i class="ph ph-image" style="font-size: 2.5rem; margin-bottom: 0.5rem;"></i><span>씨즐 사진</span></div>`;

                    html += `
                    <div class="video-item" style="background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.03); border: 1px solid rgba(0,0,0,0.05); display: flex; flex-direction: column; align-self: start;">
                        <div style="flex: 1; display: flex; align-items: center; justify-content: center; background: #f8f8f8;">
                            ${imageElement}
                        </div>
                    </div>`;
                });
                html += `</div>`;
            } else {
                html += `<div style="text-align: center; padding: 3rem; background: #f9f9f9; border-radius: 12px; margin-bottom: 4rem; border: 1px dashed #ccc;">
                    <p style="color: var(--text-secondary); margin: 0;">Sizzle 사진이 업데이트 될 예정입니다.</p>
                </div>`;
            }

            // 3. Snap Section
            html += `<h4 style="font-size: 1.8rem; font-weight: 700; margin-bottom: 1.5rem; text-align: center; color: var(--text-primary);">Snap</h4>`;
            
            if (data.snap && data.snap.length > 0) {
                html += `<div class="scroll-gallery" style="align-items: stretch; margin-bottom: 2rem;">`; 
                data.snap.forEach(item => {
                    let imgSrc = item.image;
                    
                    let imageElement = imgSrc 
                        ? `<img src="${imgSrc}" alt="${item.title}" style="width: 100%; height: auto; display: block; object-fit: cover;">`
                        : `<div style="display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 250px; color: #aaa;"><i class="ph ph-image" style="font-size: 2.5rem; margin-bottom: 0.5rem;"></i><span>스냅 사진</span></div>`;

                    html += `
                    <div class="video-item" style="background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.03); border: 1px solid rgba(0,0,0,0.05); display: flex; flex-direction: column; align-self: start;">
                        <div style="flex: 1; display: flex; align-items: center; justify-content: center; background: #f8f8f8;">
                            ${imageElement}
                        </div>
                    </div>`;
                });
                html += `</div>`;
            } else {
                html += `<div style="text-align: center; padding: 3rem; background: #f9f9f9; border-radius: 12px; margin-bottom: 2rem; border: 1px dashed #ccc;">
                    <p style="color: var(--text-secondary); margin: 0;">Snap 사진이 업데이트 될 예정입니다.</p>
                </div>`;
            }
            
            photoContainer.innerHTML = html;
        }

        // Render VTuber
        const vtuberContainer = document.getElementById('render-vtuber');
        if (vtuberContainer && data.vtuber) {
            vtuberContainer.innerHTML = '';
            if (data.vtuber.length > 0) {
                let html = '<div class="profile-card-grid">';
                data.vtuber.forEach((item, index) => {
                    html += `<div style="height: 100%;">`;
                    
                    let imgSrc = item.profile_image ? item.profile_image : '';
                    let imgHtml = imgSrc 
                        ? `<img src="${imgSrc}" style="width: 100%; height: 100%; object-fit: cover;">`
                        : `<div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%;"><i class="ph ph-image" style="font-size: 2.5rem; color: #ccc;"></i><span style="font-size:0.8rem; color:#aaa; margin-top:0.5rem; text-align:center;">프로필 사진<br>영역</span></div>`;

                    let desc = item.description ? item.description : '이곳에 간단한 설명이 들어갑니다.';
                    let iconClass = item.icon || "ph-monitor-play";

                    html += `
                    <div style="display: flex; flex-direction: column; align-items: center; text-align: center; gap: 1.5rem; background: #ffffff; padding: 2.5rem 1.5rem; border-radius: 12px; border: 1px solid rgba(0,0,0,0.05); box-shadow: 0 10px 30px rgba(0,0,0,0.03); height: 100%;">
                        <div style="width: 140px; height: 140px; border-radius: 50%; background: #f8f8f8; flex-shrink: 0; overflow: hidden; border: 1px dashed rgba(0,0,0,0.15); margin: 0 auto;">
                            ${imgHtml}
                        </div>
                        <div style="display: flex; flex-direction: column; flex: 1; width: 100%;">
                            <h4 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 0.8rem; color: var(--text-primary);">${item.name}</h4>
                            <p style="font-size: 1rem; color: var(--text-secondary); line-height: 1.6; margin-bottom: 1.5rem; white-space: pre-wrap;">${desc}</p>
                    `;

                    if (item.link) {
                        html += `
                        <div style="margin-top: auto;">
                            <a href="${item.link}" target="_blank" class="vtuber-card" style="display: inline-block; font-size: 1.05rem; padding: 0.8rem 1.5rem; margin: 0;">
                                <i class="ph ${iconClass}" style="color: var(--accent-color); font-size: 1.3rem; vertical-align: middle;"></i> 방송국 방문하기
                            </a>
                        </div>`;
                    }

                    html += `
                        </div>
                    </div>`;
                    
                    html += `</div>`; // Close height 100 wrapper
                });
                html += `</div>`;
                vtuberContainer.innerHTML = html;
            } else {
                vtuberContainer.innerHTML = `<p class="empty-state">업데이트 예정입니다.</p>`;
            }
        }

        // Setup Portfolio Section Slider (Center Mode Carousel)
        function setupSectionSlider() {
            const track = document.getElementById('portfolio-track');
            if (!track) return;
            
            const slides = track.querySelectorAll('.portfolio-category');
            const dots = document.querySelectorAll('.portfolio-dot');
            const prevBtn = document.getElementById('slider-prev');
            const nextBtn = document.getElementById('slider-next');
            
            let currentIndex = 0;
            const totalSlides = slides.length;
            
            // Initialize elements that had display:none removed
            slides.forEach(slide => slide.style.display = 'block');
            
            function showSlide(index) {
                if (index < 0) index = totalSlides - 1;
                if (index >= totalSlides) index = 0;
                
                currentIndex = index;
                
                slides.forEach((slide, i) => {
                    if (i === currentIndex) {
                        slide.classList.add('active-slide');
                    } else {
                        slide.classList.remove('active-slide');
                    }
                });
                
                dots.forEach((dot, i) => {
                    if (i === currentIndex) dot.classList.add('active');
                    else dot.classList.remove('active');
                });
                
                // Calculate center translation
                const maskWidth = track.parentElement.offsetWidth;
                const slideWidth = slides[0].offsetWidth;
                const offset = -(index * slideWidth) + (maskWidth / 2) - (slideWidth / 2);
                track.style.transform = `translateX(${offset}px)`;
            }
            
            if (prevBtn) prevBtn.addEventListener('click', () => showSlide(currentIndex - 1));
            if (nextBtn) nextBtn.addEventListener('click', () => showSlide(currentIndex + 1));
            
            dots.forEach((dot, i) => {
                dot.addEventListener('click', () => showSlide(i));
            });
            
            window.addEventListener('resize', () => showSlide(currentIndex));
            setTimeout(() => showSlide(0), 150); // slight delay to ensure widths render
        }
        
        setupSectionSlider();

    } catch (e) {
        console.error("Failed to load or parse portfolio data", e);
    }
});
