// Main initialization when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initMenuToggle();
    initThemeToggle();
    initTypingEffect();
    initScrollActive();
    initScrollReveal();
    initBackToTop();
    initPortfolioFilter();
    initProjectModal();
    initTestimonialSlider();
    initContactForm();
    initAnimations();
    initScrollProgress();
    initCVDownload();
});

// ===== CV DOWNLOAD =====
function initCVDownload() {
    const downloadBtn = document.getElementById('download-cv-btn');
    
    if (downloadBtn) {
        downloadBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Path to your CV
            const cvPath = 'my-resume/my-CV.pdf';
            
            // Create a temporary link element
            const link = document.createElement('a');
            link.href = cvPath;
            link.download = 'Albert_Nuwarinda_CV.pdf'; // The name of the downloaded file
            
            // Append to body, click, and remove
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Optional: Show a success message
            showDownloadNotification();
        });
    }
}

// Show download notification
function showDownloadNotification() {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'download-notification';
    notification.innerHTML = '<i class="fas fa-check-circle"></i> CV Downloaded Successfully!';
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Hide and remove notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// ===== SCROLL PROGRESS BAR =====
function initScrollProgress() {
    const progressBar = document.querySelector('.scroll-progress-bar');
    
    if (progressBar) {
        window.addEventListener('scroll', function() {
            const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (window.pageYOffset / windowHeight) * 100;
            progressBar.style.width = scrolled + '%';
        });
    }
}

// ===== MENU TOGGLE =====
function initMenuToggle() {
    const toggleMenu = document.querySelector('.toggle-menu');
    const sidebar = document.querySelector('.sidebar');
    const content = document.querySelector('.content');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Create overlay if it doesn't exist
    if (!document.querySelector('.menu-overlay')) {
        const overlay = document.createElement('div');
        overlay.classList.add('menu-overlay');
        document.body.appendChild(overlay);
    }
    
    const overlay = document.querySelector('.menu-overlay');
    
    function closeSidebar() {
        // Only close on mobile/tablet
        if (window.innerWidth <= 1024) {
            sidebar.classList.remove('show-menu');
            overlay.classList.remove('active');
            document.body.classList.remove('no-scroll');
            if (toggleMenu) {
                toggleMenu.innerHTML = '<i class="fas fa-bars"></i>';
            }
        }
    }
    
    function toggleSidebar() {
        // Only toggle on mobile/tablet
        if (window.innerWidth <= 1024) {
            const isOpen = sidebar.classList.contains('show-menu');
            
            if (isOpen) {
                closeSidebar();
            } else {
                sidebar.classList.add('show-menu');
                overlay.classList.add('active');
                document.body.classList.add('no-scroll');
                if (toggleMenu) {
                    toggleMenu.innerHTML = '<i class="fas fa-times"></i>';
                }
            }
        }
    }
    
    function handleResize() {
        // On desktop, ensure sidebar is visible and remove mobile classes
        if (window.innerWidth > 1024) {
            sidebar.classList.remove('show-menu');
            overlay.classList.remove('active');
            document.body.classList.remove('no-scroll');
        }
    }
    
    if (toggleMenu) {
        toggleMenu.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleSidebar();
        });
    }
    
    if (overlay) {
        overlay.addEventListener('click', closeSidebar);
    }
    
    // Close sidebar when clicking nav links on mobile
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 1024 && sidebar.classList.contains('show-menu')) {
                closeSidebar();
            }
        });
    });
    
    // Handle window resize
    window.addEventListener('resize', handleResize);
    
    // Initial check
    handleResize();
}


// ===== DARK/LIGHT THEME =====
function initThemeToggle() {
    const themeToggle = document.querySelector('#theme-toggle');
    const body = document.querySelector('body');
    
    // Check for saved theme preference
    if (localStorage.getItem('theme') === 'dark') {
        body.classList.remove('light-mode');
        body.classList.add('dark-mode');
    }
    
    themeToggle?.addEventListener('click', () => {
        body.classList.toggle('light-mode');
        body.classList.toggle('dark-mode');
        
        // Save theme preference
        if (body.classList.contains('dark-mode')) {
            localStorage.setItem('theme', 'dark');
        } else {
            localStorage.setItem('theme', 'light');
        }
    });
}

// ===== TYPING EFFECT =====
function initTypingEffect() {
    const typingElement = document.querySelector('.changing-text');
    
    if (typingElement) {
        const phrases = ['Web Developer', 'UI/UX Designer', 'App Developer', 'Freelancer'];
        let phraseIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typingSpeed = 100;
        
        function typeEffect() {
            const currentPhrase = phrases[phraseIndex];
            
            if (isDeleting) {
                typingElement.textContent = currentPhrase.substring(0, charIndex - 1);
                charIndex--;
                typingSpeed = 50;
            } else {
                typingElement.textContent = currentPhrase.substring(0, charIndex + 1);
                charIndex++;
                typingSpeed = 150;
            }
            
            if (!isDeleting && charIndex === currentPhrase.length) {
                isDeleting = true;
                typingSpeed = 1000; // Pause at end of phrase
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                typingSpeed = 500; // Pause before typing next phrase
            }
            
            setTimeout(typeEffect, typingSpeed);
        }
        
        // Start the typing effect
        setTimeout(typeEffect, 1000);
    }
}

// ===== SCROLL SECTIONS ACTIVE LINK =====
function initScrollActive() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    function scrollActive() {
        const scrollY = window.pageYOffset;
        
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 50;
            const sectionId = current.getAttribute('id');
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                document.querySelector(`.nav-link[href*="${sectionId}"]`)?.classList.add('active');
            } else {
                document.querySelector(`.nav-link[href*="${sectionId}"]`)?.classList.remove('active');
            }
        });
    }
    
    window.addEventListener('scroll', scrollActive);
}

// ===== SCROLL REVEAL ANIMATION =====
function initScrollReveal() {
    function revealOnScroll() {
        const elements = document.querySelectorAll('.fade-in');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementPosition < windowHeight - 100) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    }
    
    window.addEventListener('scroll', revealOnScroll);
    window.addEventListener('load', revealOnScroll);
}

// ===== BACK TO TOP BUTTON =====
function initBackToTop() {
    const backToTopButton = document.querySelector('.back-to-top');
    
    function scrollUp() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
    
    function showScrollButton() {
        if (window.scrollY >= 350) {
            backToTopButton?.classList.add('active');
        } else {
            backToTopButton?.classList.remove('active');
        }
    }
    
    window.addEventListener('scroll', showScrollButton);
    backToTopButton?.addEventListener('click', scrollUp);
}

// ===== PORTFOLIO FILTER =====
function initPortfolioFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioCards = document.querySelectorAll('.portfolio-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');
            
            const filterValue = button.getAttribute('data-filter');
            
            portfolioCards.forEach(card => {
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 100);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// ===== PROJECT DETAILS MODAL =====
function initProjectModal() {
    const projectModal = document.getElementById('project-details');
    const modalOverlay = document.querySelector('.modal-overlay');
    
    // Project data
    const projectsData = {
        project1: {
            name: 'E-commerce Platform',
            description: 'A full-stack e-commerce platform with user authentication, product management, shopping cart, and payment integration. The project was built with a focus on performance and user experience.',
            client: 'Tech Innovations',
            date: 'January 2023',
            technologies: 'React, Node.js, MongoDB, Stripe',
            category: 'Web Development',
            link: 'https://example.com/project1',
            images: ['images/project/project1.jpg', 'images/project/project1.jpg', 'images/project/project1.jpg', 'images/project/project1.jpg']
        },
        project2: {
            name: 'Fitness Tracker App',
            description: 'A mobile application that helps users track their workouts, set fitness goals, and monitor their progress. The app includes features like workout plans, nutrition tracking, and social sharing.',
            client: 'Fitness Plus',
            date: 'March 2023',
            technologies: 'React Native, Firebase, Redux',
            category: 'App Development',
            link: 'https://example.com/project2',
            images: ['images/project/project2.jpg', 'images/project/project2.jpg', 'images/project/project2.jpg']
        },
        project3: {
            name: 'Brand Identity Design',
            description: 'A comprehensive brand identity design project including logo design, color palette, typography, and brand guidelines. The project aimed to create a cohesive and memorable brand identity.',
            client: 'Creative Agency',
            date: 'May 2023',
            technologies: 'Adobe Illustrator, Photoshop, Figma',
            category: 'Design',
            link: 'https://example.com/project3',
            images: ['images/project/project3.jpg', 'images/project/project3-.jpg', 'images/project/project3.jpg']
        },
        project4: {
            name: 'Portfolio Website',
            description: 'A responsive portfolio website designed and developed for a professional photographer. The website showcases the photographer\'s work in an elegant and user-friendly interface.',
            client: 'John Photography',
            date: 'July 2023',
            technologies: 'HTML, CSS, JavaScript, GSAP',
            category: 'Web Development',
            link: 'https://example.com/project4',
            images: ['images/project/project4.jpg', 'images/project/project4.jpg', 'images/project/project4.jpg']
        },
        project5: {
            name: 'Food Delivery App',
            description: 'A food delivery application that connects users with local restaurants. The app includes features like real-time order tracking, restaurant ratings, and personalized recommendations.',
            client: 'Food Connect',
            date: 'September 2023',
            technologies: 'Flutter, Firebase, Google Maps API',
            category: 'App Development',
            link: 'https://example.com/project5',
            images: ['images/project/project5.jpg', 'images/project/project5.jpg', 'images/project/project5.jpg']
        },
        project6: {
            name: 'Digital Marketing Campaign',
            description: 'A comprehensive digital marketing campaign for a product launch. The project included strategy development, content creation, social media management, and performance analysis.',
            client: 'Product Innovators',
            date: 'November 2023',
            technologies: 'Google Analytics, Facebook Ads, Mailchimp',
            category: 'Digital Marketing',
            link: 'https://example.com/project6',
            images: ['images/project/project6.jpg', 'images/project/project6.jpg', 'images/project/project6.jpg']
        }
    };
    
    // Make functions available globally for HTML onclick attributes
    window.showProjectDetails = function(projectId) {
        const project = projectsData[projectId];
        
        if (!project) return;
        
        // Set modal content
        document.getElementById('modal-project-name').textContent = project.name;
        document.getElementById('modal-project-description').textContent = project.description;
        document.getElementById('modal-project-client').textContent = project.client;
        document.getElementById('modal-project-date').textContent = project.date;
        document.getElementById('modal-project-tech').textContent = project.technologies;
        document.getElementById('modal-project-category').textContent = project.category;
        document.getElementById('modal-project-link').href = project.link;
        
        // Set project images
        const imagesContainer = document.getElementById('modal-project-images');
        imagesContainer.innerHTML = '';
        
        project.images.forEach(image => {
            const img = document.createElement('img');
            img.src = image;
            img.alt = project.name;
            imagesContainer.appendChild(img);
        });
        
        // Show modal
        projectModal.classList.add('active');
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    };
    
    window.hideProjectDetails = function() {
        projectModal.classList.remove('active');
        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
    };
}

// ===== TESTIMONIAL SLIDER =====
function initTestimonialSlider() {
    const testimonialSlides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.dot');
    let currentSlideIndex = 0;
    
    // Make functions available globally for HTML onclick attributes
    window.showSlide = function(n) {
        testimonialSlides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        currentSlideIndex = (n + testimonialSlides.length) % testimonialSlides.length;
        
        testimonialSlides[currentSlideIndex].classList.add('active');
        dots[currentSlideIndex].classList.add('active');
    };
    
    window.moveSlide = function(n) {
        window.showSlide(currentSlideIndex + n);
    };
    
    window.currentSlide = function(n) {
        window.showSlide(n);
    };
    
    // Initialize slider
    if (testimonialSlides.length > 0) {
        window.showSlide(0);
        
        // Auto slide
        setInterval(() => {
            window.moveSlide(1);
        }, 5000);
    }
}

// ===== CONTACT FORM =====
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    contactForm?.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value;
        
        // Here you would typically send the form data to a server
        // For this example, we'll just log it and show a success message
        console.log({ name, email, subject, message });
        
        // Show success message
        alert('Your message has been sent successfully!');
        
        // Reset form
        contactForm.reset();
    });
}

// ===== INITIALIZE ANIMATIONS =====
function initAnimations() {
    // Add animation classes to elements
    const animatedElements = document.querySelectorAll('.section-header, .home-info, .about-container, .service-card, .portfolio-card');
    const educationItems = document.querySelectorAll('.education-item');
    
    educationItems.forEach((item, index) => {
        item.classList.add('fade-in');
        item.classList.add(`delay-${(index % 5) + 1}`);
    });

    animatedElements.forEach((element, index) => {
        element.classList.add('fade-in');
        element.classList.add(`delay-${(index % 5) + 1}`);
    });
}

// Helper function to show contact section
function showContact() {
    document.getElementById('contact').scrollIntoView({behavior: 'smooth'});
}

// Add this debugging code
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, checking sidebar elements');
    
    const sidebar = document.querySelector('.sidebar');
    const toggleMenu = document.querySelector('.toggle-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    console.log('Sidebar:', sidebar);
    console.log('Toggle menu:', toggleMenu);
    console.log('Nav links:', navLinks.length);
    
    // Check if toggle menu exists, if not, create it
    if (!toggleMenu) {
        console.log('Creating toggle menu button');
        const button = document.createElement('button');
        button.className = 'toggle-menu';
        button.innerHTML = '<i class="fas fa-bars"></i>';
        document.body.appendChild(button);
        
        // Add event listener to the new button
        button.addEventListener('click', function() {
            console.log('Toggle button clicked');
            sidebar.classList.toggle('show-menu');
            
            // Get or create overlay
            let overlay = document.querySelector('.menu-overlay');
            if (!overlay) {
                overlay = document.createElement('div');
                overlay.classList.add('menu-overlay');
                document.body.appendChild(overlay);
                
                overlay.addEventListener('click', function() {
                    sidebar.classList.remove('show-menu');
                    overlay.classList.remove('active');
                    document.body.classList.remove('no-scroll');
                });
            }
            
            overlay.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
        });
    }
});
