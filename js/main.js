// Partes de este programa

// 1. Importar las librerías necesarias
// 2. Inicializar los componentes de la página
// 3. Efecto de desplazamiento del encabezado
// 4. Animación del logotipo con GSAP
// 5. Slider de la sección de héroe
// 6. Slider de testimonios
// 7. Pestañas de servicios y filtrado
// 8. Animaciones de revelación al desplazarse
// 9. Calendario de reservas
// 10. Funcionalidad del formulario de reservas
// 11. Validación del formulario de contacto
// 12. Integración de Google Maps
// 13. Funcionalidad de la barra de navegación
// 14. Funcionalidad de la barra de navegación responsive
// 15. Funciones de ayuda
// 16. Funciones de ayuda responsive

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initHeader();
    initLogoAnimation();
    initHeroSlider();
    initTestimonialsSlider();
    initServiceTabs();
    initRevealAnimations();
    initBookingCalendar();
    initBookingForm();
    initContactForm();
    initGoogleMap();
    initMobileMenu();
    initBackToTop();
});

// Header scroll effect
function initHeader() {
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// Logo animation with GSAP
function initLogoAnimation() {
    const logo = document.getElementById('logo');
    
    // Initial animation
    gsap.from(logo, {
        duration: 1.5,
        opacity: 0,
        y: -20,
        ease: "elastic.out(1, 0.3)",
        delay: 0.5
    });
    
    // Hover animation
    logo.addEventListener('mouseenter', function() {
        gsap.to(logo, {
            scale: 1.1,
            color: '#CB997E',
            duration: 0.3
        });
    });
    
    logo.addEventListener('mouseleave', function() {
        gsap.to(logo, {
            scale: 1,
            color: '#CB997E',
            duration: 0.3
        });
    });
}

// Hero section slider
function initHeroSlider() {
    const heroSwiper = new Swiper('.hero-swiper', {
        slidesPerView: 1,
        effect: 'fade',
        speed: 1000,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false
        },
        loop: true,
        pagination: {
            el: '.hero-swiper .swiper-pagination',
            clickable: true
        }
    });
    
    // Parallax effect on hero content
    document.querySelectorAll('.hero-swiper .swiper-slide').forEach(slide => {
        slide.addEventListener('mousemove', function(e) {
            const title = this.querySelector('.parallax-title');
            const subtitle = this.querySelector('.parallax-subtitle');
            
            const x = (window.innerWidth / 2 - e.pageX) / 30;
            const y = (window.innerHeight / 2 - e.pageY) / 30;
            
            title.style.transform = `translateX(${x}px) translateY(${y}px)`;
            subtitle.style.transform = `translateX(${x * 0.5}px) translateY(${y * 0.5}px)`;
        });
    });
}

// Testimonials slider
function initTestimonialsSlider() {
    const testimonialsSwiper = new Swiper('.testimonials-swiper', {
        slidesPerView: 1,
        spaceBetween: 30,
        autoplay: {
            delay: 4000,
            disableOnInteraction: false
        },
        pagination: {
            el: '.testimonials-swiper .swiper-pagination',
            clickable: true
        },
        breakpoints: {
            768: {
                slidesPerView: 2
            },
            992: {
                slidesPerView: 3
            }
        }
    });
}

// Service tabs and filtering
function initServiceTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const serviceCards = document.querySelectorAll('.service-card');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            tabButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            const category = this.getAttribute('data-category');
            
            // Filter service cards
            serviceCards.forEach(card => {
                if (category === 'all' || card.getAttribute('data-category') === category) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// Reveal animations on scroll
function initRevealAnimations() {
    const revealElements = document.querySelectorAll('.reveal-element');
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        threshold: 0.1,
        rootMargin: '-50px'
    });
    
    revealElements.forEach(element => {
        revealObserver.observe(element);
    });
}

// Booking calendar
function initBookingCalendar() {
    const calendarEl = document.getElementById('booking-calendar');
    
    if (calendarEl) {
        const calendar = new FullCalendar.Calendar(calendarEl, {
            initialView: 'dayGridMonth',
            headerToolbar: {
                left: 'prev,next today',
                center: 'title',
                right: '' // Remove view buttons
            },
            buttonText: {
                today: 'Hoy'
            },
            locale: 'es',
            firstDay: 1, // Start week on Monday
            selectable: true,
            selectMirror: true,
            dayMaxEvents: true,
            businessHours: {
                daysOfWeek: [1, 2, 3, 4, 5, 6], // Monday - Saturday
                startTime: '10:00',
                endTime: '21:00',
            },
            select: function(info) {
                // Update booking form date
                const bookingDate = document.getElementById('booking-date');
                if (bookingDate) {
                    bookingDate.value = info.startStr;
                    updateBookingSummary();
                }
                calendar.unselect();
            }
        });
        
        calendar.render();
    }
}

// Booking form functionality
function initBookingForm() {
    const bookingForm = document.getElementById('booking-form');
    const serviceSelect = document.getElementById('service-select');
    const bookingDate = document.getElementById('booking-date');
    const bookingTime = document.getElementById('booking-time');
    const bookingName = document.getElementById('booking-name');
    const bookingEmail = document.getElementById('booking-email');
    const bookingPhone = document.getElementById('booking-phone');
    
    // Set min date to today
    if (bookingDate) {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        bookingDate.min = `${yyyy}-${mm}-${dd}`;
    }
    
    // Update booking summary when form inputs change
    if (serviceSelect) serviceSelect.addEventListener('change', updateBookingSummary);
    if (bookingDate) bookingDate.addEventListener('change', updateBookingSummary);
    if (bookingTime) bookingTime.addEventListener('change', updateBookingSummary);
    
    // Form validation
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            let isValid = true;
            
            // Validate name
            if (bookingName.value.trim() === '') {
                showError(bookingName, 'name-error', 'Por favor, introduce tu nombre');
                isValid = false;
            } else {
                hideError(bookingName, 'name-error');
            }
            
            // Validate email
            if (!isValidEmail(bookingEmail.value)) {
                showError(bookingEmail, 'email-error', 'Por favor, introduce un email válido');
                isValid = false;
            } else {
                hideError(bookingEmail, 'email-error');
            }
            
            // Validate phone
            if (!isValidPhone(bookingPhone.value)) {
                showError(bookingPhone, 'phone-error', 'Por favor, introduce un teléfono válido');
                isValid = false;
            } else {
                hideError(bookingPhone, 'phone-error');
            }
            
            if (isValid) {
                // Simulate form submission
                const submitBtn = bookingForm.querySelector('.submit-btn');
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
                submitBtn.disabled = true;
                
                setTimeout(function() {
                    bookingForm.reset();
                    submitBtn.innerHTML = 'Confirmar Reserva';
                    submitBtn.disabled = false;
                    
                    // Reset summary
                    document.getElementById('summary-service').textContent = '-';
                    document.getElementById('summary-date').textContent = '-';
                    document.getElementById('summary-time').textContent = '-';
                    document.getElementById('summary-price').textContent = '-';
                    
                    // Show success toast
                    showToast('¡Reserva confirmada! Te hemos enviado un email con los detalles.');
                }, 2000);
            }
        });
    }
}

// Update booking summary
function updateBookingSummary() {
    const serviceSelect = document.getElementById('service-select');
    const bookingDate = document.getElementById('booking-date');
    const bookingTime = document.getElementById('booking-time');
    
    const summaryService = document.getElementById('summary-service');
    const summaryDate = document.getElementById('summary-date');
    const summaryTime = document.getElementById('summary-time');
    const summaryPrice = document.getElementById('summary-price');
    
    if (serviceSelect && serviceSelect.selectedIndex > 0) {
        const selectedOption = serviceSelect.options[serviceSelect.selectedIndex];
        summaryService.textContent = selectedOption.text.split(' (')[0];
        summaryPrice.textContent = selectedOption.getAttribute('data-price') + '€';
    }
    
    if (bookingDate && bookingDate.value) {
        const date = new Date(bookingDate.value);
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        summaryDate.textContent = date.toLocaleDateString('es-ES', options);
    }
    
    if (bookingTime && bookingTime.value) {
        summaryTime.textContent = bookingTime.value;
    }
}

// Contact form validation
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    const contactName = document.getElementById('contact-name');
    const contactEmail = document.getElementById('contact-email');
    const contactSubject = document.getElementById('contact-subject');
    const contactMessage = document.getElementById('contact-message');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            let isValid = true;
            
            // Validate name
            if (contactName.value.trim() === '') {
                showError(contactName, 'contact-name-error', 'Por favor, introduce tu nombre');
                isValid = false;
            } else {
                hideError(contactName, 'contact-name-error');
            }
            
            // Validate email
            if (!isValidEmail(contactEmail.value)) {
                showError(contactEmail, 'contact-email-error', 'Por favor, introduce un email válido');
                isValid = false;
            } else {
                hideError(contactEmail, 'contact-email-error');
            }
            
            // Validate subject
            if (contactSubject.value.trim() === '') {
                showError(contactSubject, 'contact-subject-error', 'Por favor, introduce un asunto');
                isValid = false;
            } else {
                hideError(contactSubject, 'contact-subject-error');
            }
            
            // Validate message
            if (contactMessage.value.trim() === '') {
                showError(contactMessage, 'contact-message-error', 'Por favor, introduce un mensaje');
                isValid = false;
            } else {
                hideError(contactMessage, 'contact-message-error');
            }
            
            if (isValid) {
                // Simulate form submission with AJAX
                const submitBtn = contactForm.querySelector('.submit-btn');
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
                submitBtn.disabled = true;
                
                setTimeout(function() {
                    contactForm.reset();
                    submitBtn.innerHTML = 'Enviar Mensaje';
                    submitBtn.disabled = false;
                    
                    // Show success toast
                    showToast('¡Mensaje enviado correctamente! Te responderemos lo antes posible.');
                }, 2000);
            }
        });
    }
}

// Google Maps integration
function initGoogleMap() {
    // Check if map element exists
    const mapElement = document.getElementById('map');
    
    if (mapElement) {
        // This function will be called by the Google Maps API callback
        window.initMap = function() {
            // Madrid coordinates
            const spaLocation = { lat: 40.42113293235297, lng: -3.7093665610964157 };
            
            // Create map
            const map = new google.maps.Map(mapElement, {
                center: spaLocation,
                zoom: 15,
                styles: [
                    {
                        "featureType": "all",
                        "elementType": "geometry.fill",
                        "stylers": [
                            {
                                "weight": "2.00"
                            }
                        ]
                    },
                    {
                        "featureType": "all",
                        "elementType": "geometry.stroke",
                        "stylers": [
                            {
                                "color": "#9c9c9c"
                            }
                        ]
                    },
                    {
                        "featureType": "all",
                        "elementType": "labels.text",
                        "stylers": [
                            {
                                "visibility": "on"
                            }
                        ]
                    },
                    {
                        "featureType": "landscape",
                        "elementType": "all",
                        "stylers": [
                            {
                                "color": "#f2f2f2"
                            }
                        ]
                    },
                    {
                        "featureType": "landscape",
                        "elementType": "geometry.fill",
                        "stylers": [
                            {
                                "color": "#F5E6E8"
                            }
                        ]
                    },
                    {
                        "featureType": "poi",
                        "elementType": "all",
                        "stylers": [
                            {
                                "visibility": "off"
                            }
                        ]
                    },
                    {
                        "featureType": "road",
                        "elementType": "all",
                        "stylers": [
                            {
                                "saturation": -100
                            },
                            {
                                "lightness": 45
                            }
                        ]
                    },
                    {
                        "featureType": "road.highway",
                        "elementType": "all",
                        "stylers": [
                            {
                                "visibility": "simplified"
                            }
                        ]
                    },
                    {
                        "featureType": "road.arterial",
                        "elementType": "labels.icon",
                        "stylers": [
                            {
                                "visibility": "off"
                            }
                        ]
                    },
                    {
                        "featureType": "transit",
                        "elementType": "all",
                        "stylers": [
                            {
                                "visibility": "off"
                            }
                        ]
                    },
                    {
                        "featureType": "water",
                        "elementType": "all",
                        "stylers": [
                            {
                                "color": "#DDBEA9"
                            },
                            {
                                "visibility": "on"
                            }
                        ]
                    }
                ]
            });
            
            // Custom marker icon
            const markerIcon = {
                url: 'https://cdn-icons-png.flaticon.com/512/1946/1946488.png',
                scaledSize: new google.maps.Size(40, 40)
            };
            
            // Add marker
            const marker = new google.maps.Marker({
                position: spaLocation,
                map: map,
                icon: markerIcon,
                animation: google.maps.Animation.DROP,
                title: 'AYA Estética'
            });
            
            // Info window content
            const contentString = `
                <div class="map-info-window">
                    <h3>AYA Estética</h3>
                    <p>Calle Leganitos 2, Madrid</p>
                    <p>Tel: +34 912 345 678</p>
                </div>
            `;
            
            // Create info window
            const infoWindow = new google.maps.InfoWindow({
                content: contentString
            });
            
            // Open info window when marker is clicked
            marker.addListener('click', function() {
                infoWindow.open(map, marker);
            });
            
            // Location functionality removed
        };
    }
}

// Mobile menu toggle
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navList = document.querySelector('.nav-list');
    
    if (menuToggle && navList) {
        menuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            navList.classList.toggle('active');
        });
        
        // Close menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', function() {
                menuToggle.classList.remove('active');
                navList.classList.remove('active');
            });
        });
    }
}

// Back to top button
function initBackToTop() {
    const backToTopButton = document.getElementById('back-to-top');
    
    if (backToTopButton) {
        // Show/hide button based on scroll position
        window.addEventListener('scroll', function() {
            if (window.scrollY > 300) {
                backToTopButton.classList.add('show');
            } else {
                backToTopButton.classList.remove('show');
            }
        });
        
        // Scroll to top when button is clicked
        backToTopButton.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Helper functions
function showError(input, errorId, message) {
    const errorElement = document.getElementById(errorId);
    input.classList.add('error');
    errorElement.textContent = message;
    errorElement.classList.add('show');
}

function hideError(input, errorId) {
    const errorElement = document.getElementById(errorId);
    input.classList.remove('error');
    errorElement.classList.remove('show');
}

function isValidEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function isValidPhone(phone) {
    const re = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
    return re.test(String(phone));
}

function showToast(message) {
    const toast = document.getElementById('toast');
    const toastMessage = document.querySelector('.toast-message');
    
    toastMessage.textContent = message;
    toast.classList.add('show');
    
    setTimeout(function() {
        toast.classList.remove('show');
    }, 3000);
}
