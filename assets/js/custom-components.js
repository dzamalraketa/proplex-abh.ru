// Custom Components JS - Replaces Bootstrap functionality

document.addEventListener('DOMContentLoaded', function() {

    // Navbar Toggle
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.getElementById('navbarNav');

    if (navbarToggler && navbarCollapse) {
        navbarToggler.addEventListener('click', function() {
            navbarCollapse.classList.toggle('show');
            navbarToggler.setAttribute('aria-expanded', navbarCollapse.classList.contains('show'));
        });

        // Close navbar when clicking outside
        document.addEventListener('click', function(event) {
            if (!navbarToggler.contains(event.target) && !navbarCollapse.contains(event.target)) {
                navbarCollapse.classList.remove('show');
                navbarToggler.setAttribute('aria-expanded', 'false');
            }
        });

        // Close navbar when a nav link is clicked (mobile)
        navbarCollapse.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', function() {
                navbarCollapse.classList.remove('show');
                navbarToggler.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // Carousel Functionality
    function initCarousels() {
        const carousels = document.querySelectorAll('.carousel');

        carousels.forEach(carousel => {
            const carouselInner = carousel.querySelector('.carousel-inner');
            const items = carousel.querySelectorAll('.carousel-item');
            const prevBtn = carousel.querySelector('.carousel-control-prev');
            const nextBtn = carousel.querySelector('.carousel-control-next');
            const indicators = carousel.querySelectorAll('.carousel-indicators [data-slide-to]');
            const ride = carousel.getAttribute('data-ride') === 'carousel';
            const interval = parseInt(carousel.getAttribute('data-interval')) || 5000;

            let currentIndex = 0;
            let timer;

            function showSlide(index) {
                items.forEach((item, i) => {
                    item.classList.toggle('active', i === index);
                });

                indicators.forEach((indicator, i) => {
                    indicator.classList.toggle('active', i === index);
                });

                currentIndex = index;
            }

            function nextSlide() {
                const nextIndex = (currentIndex + 1) % items.length;
                showSlide(nextIndex);
            }

            function prevSlide() {
                const prevIndex = (currentIndex - 1 + items.length) % items.length;
                showSlide(prevIndex);
            }

            if (prevBtn) {
                prevBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    prevSlide();
                    if (ride) resetTimer();
                });
            }

            if (nextBtn) {
                nextBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    nextSlide();
                    if (ride) resetTimer();
                });
            }

            indicators.forEach((indicator, index) => {
                indicator.addEventListener('click', function(e) {
                    e.preventDefault();
                    showSlide(index);
                    if (ride) resetTimer();
                });
            });

            function startTimer() {
                if (ride) {
                    timer = setInterval(nextSlide, interval);
                }
            }

            function resetTimer() {
                clearInterval(timer);
                startTimer();
            }

            // Initialize first slide
            showSlide(0);
            startTimer();
        });
    }

    initCarousels();

    // Dropdown Functionality
    const dropdowns = document.querySelectorAll('.dropdown, .dropup');

    dropdowns.forEach(dropdown => {
        const toggle = dropdown.querySelector('[data-toggle="dropdown"]') || dropdown.querySelector('.btn-float');
        const menu = dropdown.querySelector('.dropdown-menu');

        if (toggle && menu) {
            toggle.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();

                // Close other dropdowns
                document.querySelectorAll('.dropdown-menu.show').forEach(openMenu => {
                    if (openMenu !== menu) {
                        openMenu.classList.remove('show');
                    }
                });

                menu.classList.toggle('show');
            });

            // Close when clicking outside
            document.addEventListener('click', function(e) {
                if (!dropdown.contains(e.target)) {
                    menu.classList.remove('show');
                }
            });
        }
    });

    // Media Lightbox (фото + видео)
    function initLightbox() {
        const items = [];
        document.querySelectorAll('.gallery-item img, .video-card').forEach(el => {
            if (el.classList.contains('video-card')) {
                items.push({
                    type: 'video',
                    src: el.dataset.video,
                    poster: el.dataset.poster || el.querySelector('img')?.getAttribute('src') || '',
                    title: el.dataset.title || '',
                    el: el
                });
            } else {
                const title = el.closest('.gallery-item')?.querySelector('h3, h4, h5, .h5');
                items.push({
                    type: 'img',
                    src: el.getAttribute('src'),
                    title: title ? title.textContent.trim() : el.alt,
                    el: el
                });
            }
        });
        if (!items.length) return;

        // Создаём оверлей
        const lb = document.createElement('div');
        lb.className = 'media-lightbox';
        lb.setAttribute('role', 'dialog');
        lb.setAttribute('aria-modal', 'true');
        lb.setAttribute('aria-label', 'Просмотр медиа');
        lb.innerHTML =
            '<button class="lb-close" aria-label="Закрыть">&times;</button>' +
            '<button class="lb-nav lb-prev" aria-label="Назад">&#8249;</button>' +
            '<div class="lb-stage"></div>' +
            '<button class="lb-nav lb-next" aria-label="Вперёд">&#8250;</button>' +
            '<div><div class="lb-caption"></div><div class="lb-counter"></div></div>';
        lb.style.display = 'none';
        document.body.appendChild(lb);

        const stage = lb.querySelector('.lb-stage');
        const caption = lb.querySelector('.lb-caption');
        const counter = lb.querySelector('.lb-counter');
        let current = 0;

        function render(i) {
            current = (i + items.length) % items.length;
            const item = items[current];
            stage.innerHTML = '';
            let media;
            if (item.type === 'video') {
                media = document.createElement('video');
                media.src = item.src;
                if (item.poster) media.poster = item.poster;
                media.controls = true;
                media.autoplay = true;
                media.playsInline = true;
                media.className = 'lb-media';
            } else {
                media = document.createElement('img');
                media.src = item.src;
                media.alt = item.title;
                media.className = 'lb-media';
            }
            stage.appendChild(media);
            if (item.type === 'video') media.play().catch(() => {});
            caption.textContent = item.title;
            counter.textContent = (current + 1) + ' / ' + items.length;
            const single = items.length < 2;
            lb.querySelector('.lb-prev').style.display = single ? 'none' : '';
            lb.querySelector('.lb-next').style.display = single ? 'none' : '';
        }

        function open(i) {
            render(i);
            lb.style.display = 'flex';
            requestAnimationFrame(() => lb.classList.add('open'));
            document.body.style.overflow = 'hidden';
        }

        function close() {
            lb.classList.remove('open');
            lb.style.display = 'none';
            stage.innerHTML = ''; // останавливает видео
            document.body.style.overflow = '';
        }

        items.forEach((item, i) => {
            item.el.addEventListener('click', () => open(i));
            if (item.el.classList.contains('video-card')) {
                item.el.addEventListener('keydown', e => {
                    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(i); }
                });
            }
        });

        lb.querySelector('.lb-close').addEventListener('click', close);
        lb.querySelector('.lb-prev').addEventListener('click', e => { e.stopPropagation(); render(current - 1); });
        lb.querySelector('.lb-next').addEventListener('click', e => { e.stopPropagation(); render(current + 1); });
        lb.addEventListener('click', e => { if (e.target === lb || e.target === stage) close(); });

        document.addEventListener('keydown', e => {
            if (lb.style.display === 'none') return;
            if (e.key === 'Escape') close();
            if (e.key === 'ArrowLeft') render(current - 1);
            if (e.key === 'ArrowRight') render(current + 1);
        });
    }
    initLightbox();

});
