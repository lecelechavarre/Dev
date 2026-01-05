// Main navigation and mobile menu functionality
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu elements
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
    const mobileCloseBtn = document.querySelector('.mobile-close-btn');
    const body = document.body;
    
    // Function to open mobile menu
    function openMobileMenu() {
        sidebar.classList.add('active');
        mobileMenuOverlay.classList.add('active');
        body.style.overflow = 'hidden';
    }
    
    // Function to close mobile menu
    function closeMobileMenu() {
        sidebar.classList.remove('active');
        mobileMenuOverlay.classList.remove('active');
        body.style.overflow = '';
    }
    
    // Toggle mobile menu
    mobileMenuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        openMobileMenu();
    });

    // Close mobile menu with close button
    mobileCloseBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeMobileMenu();
    });

    // Close mobile menu when clicking on overlay
    mobileMenuOverlay.addEventListener('click', () => {
        closeMobileMenu();
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                closeMobileMenu();
            }
        });
    });

    // Navigation functionality
    const navLinks = document.querySelectorAll('nav a');
    const sections = document.querySelectorAll('.section');
    
    const navigateToSection = (targetId) => {
        // Remove active class from all links and sections
        navLinks.forEach(l => l.classList.remove('active'));
        sections.forEach(section => section.classList.remove('active'));
        
        // Add active class to corresponding nav link and section
        const correspondingLink = document.querySelector(`nav a[href="#${targetId}"]`);
        if (correspondingLink) {
            correspondingLink.classList.add('active');
        }
        
        document.getElementById(targetId).classList.add('active');
        
        // Scroll to top of section
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Add click event listeners to all navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            navigateToSection(targetId);
        });
    });

    // Add click event listeners to any other links that navigate to sections
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        if (!link.closest('nav')) {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                navigateToSection(targetId);
            });
        }
    });

    // Close mobile menu when clicking outside on mobile
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768 && 
            !sidebar.contains(e.target) && 
            !mobileMenuToggle.contains(e.target) &&
            sidebar.classList.contains('active')) {
            closeMobileMenu();
        }
    });

    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (window.innerWidth > 768) {
                closeMobileMenu();
            }
        }, 250);
    });

    // Handle escape key to close mobile menu
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && sidebar.classList.contains('active')) {
            closeMobileMenu();
        }
    });

    // Add touch events for better mobile experience
    let touchStartX = 0;
    let touchEndX = 0;

    document.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });

    document.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe() {
        const swipeThreshold = 50;
        const swipeDistance = touchEndX - touchStartX;

        if (Math.abs(swipeDistance) > swipeThreshold) {
            if (swipeDistance > 0 && window.innerWidth <= 768) {
                // Swipe right - open menu
                if (!sidebar.classList.contains('active')) {
                    openMobileMenu();
                }
            } else if (swipeDistance < 0) {
                // Swipe left - close menu
                if (sidebar.classList.contains('active')) {
                    closeMobileMenu();
                }
            }
        }
    }

    // Prevent body scroll when menu is open on mobile
    document.addEventListener('touchmove', (e) => {
        if (sidebar.classList.contains('active')) {
            e.preventDefault();
        }
    }, { passive: false });

    // Initialize active section based on hash in URL
    if (window.location.hash) {
        const targetId = window.location.hash.substring(1);
        navigateToSection(targetId);
    }

    // SCROLL DETECTION FOR TRANSPARENT MENU TOGGLE
    let lastScrollTop = 0;
    const scrollThreshold = 50; // How many pixels to scroll before changing style
    
    function handleScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > scrollThreshold) {
            // User has scrolled down - add scrolled class
            mobileMenuToggle.classList.add('scrolled');
        } else {
            // User is near top - remove scrolled class
            mobileMenuToggle.classList.remove('scrolled');
        }
        
        // Optional: Add/remove based on scroll direction
        if (scrollTop > lastScrollTop && scrollTop > scrollThreshold) {
            // Scrolling down
            mobileMenuToggle.style.transform = 'translateY(-2px)';
        } else {
            // Scrolling up
            mobileMenuToggle.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    }
    
    // Throttle scroll events for better performance
    let scrollTimeout;
    function throttleScroll() {
        if (!scrollTimeout) {
            scrollTimeout = setTimeout(function() {
                scrollTimeout = null;
                handleScroll();
            }, 100);
        }
    }
    
    // Add scroll event listener
    window.addEventListener('scroll', throttleScroll);
    
    // Initial check
    handleScroll();
});
