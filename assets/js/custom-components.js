// Custom Components JS - Replaces Bootstrap functionality

document.addEventListener('DOMContentLoaded', function() {

    // Navbar Toggle
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.getElementById('navbarNav');

    if (navbarToggler && navbarCollapse) {
        navbarToggler.addEventListener('click', function() {
            navbarCollapse.classList.toggle('show');
        });

        // Close navbar when clicking outside
        document.addEventListener('click', function(event) {
            if (!navbarToggler.contains(event.target) && !navbarCollapse.contains(event.target)) {
                navbarCollapse.classList.remove('show');
            }
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

});
