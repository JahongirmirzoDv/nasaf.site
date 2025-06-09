// Utility function to initialize all scripts on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    initCurrentYear();
    initMobileMenu();
    initLightbox();
    initContactForm();
});

/**
 * Sets the current year in the footer.
 */
function initCurrentYear() {
    const yearSpan = document.getElementById('currentYear');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
}

/**
 * Initializes the mobile menu toggle functionality.
 */
function initMobileMenu() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('header nav');

    if (menuToggle && nav) {
        menuToggle.addEventListener('click', () => {
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            nav.classList.toggle('active');
            menuToggle.setAttribute('aria-expanded', !isExpanded);
        });
    }
}

/**
 * Initializes the lightbox functionality for project images.
 */
function initLightbox() {
    const imageLinks = document.querySelectorAll('.project-showcase-image .zoom-icon');
    if (imageLinks.length === 0) return;

    // Create lightbox elements once
    const lightbox = document.createElement('div');
    lightbox.id = 'projectLightbox';
    lightbox.className = 'lightbox';
    
    const lightboxImage = document.createElement('img');
    lightboxImage.className = 'lightbox-content';
    lightbox.appendChild(lightboxImage);

    const closeBtn = document.createElement('span');
    closeBtn.className = 'lightbox-close';
    closeBtn.innerHTML = '&times;';
    lightbox.appendChild(closeBtn);

    document.body.appendChild(lightbox);

    // Function to open the lightbox
    const openLightbox = (e) => {
        e.preventDefault();
        const largeSrc = e.currentTarget.href;
        const imageAlt = e.currentTarget.closest('.project-showcase-card').querySelector('img').alt;
        
        lightbox.style.display = 'flex';
        lightboxImage.src = largeSrc;
        lightboxImage.alt = imageAlt;
        document.body.style.overflow = 'hidden';
    };

    // Function to close the lightbox
    const closeLightbox = () => {
        lightbox.style.display = 'none';
        document.body.style.overflow = 'auto';
    };

    // Attach event listeners
    imageLinks.forEach(link => link.addEventListener('click', openLightbox));
    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
}


/**
 * Initializes the contact form with EmailJS integration.
 */
function initContactForm() {
    const contactForm = document.getElementById('mainContactForm');
    const formStatusMessage = document.getElementById('formStatusMessage');

    if (contactForm && formStatusMessage) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();

            let isValid = true;
            const requiredFields = contactForm.querySelectorAll('[required]');
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.style.borderColor = '#dc3545'; // Error color
                } else {
                    field.style.borderColor = '#ddd'; // Reset to default
                }
            });

            if (!isValid) {
                formStatusMessage.textContent = translations[currentLang]?.form_message_error_fill || 'Iltimos, barcha kerakli maydonlarni to\'ldiring.';
                formStatusMessage.className = 'form-status-message error';
                setTimeout(() => { 
                    formStatusMessage.textContent = ''; 
                    formStatusMessage.className = 'form-status-message'; 
                }, 5000);
                return;
            }

            const submitButton = contactForm.querySelector('button[type="submit"]');
            submitButton.disabled = true;
            submitButton.style.opacity = '0.7';
            formStatusMessage.textContent = translations[currentLang]?.form_message_sending || 'Yuborilmoqda...';
            formStatusMessage.className = 'form-status-message';

            // EmailJS settings - make sure these match your EmailJS account
            const SERVICE_ID = "service_2rd7x3g";    
            const TEMPLATE_ID = "template_bjsr8ew";  
            const PUBLIC_KEY = "aTMkW0Lc96Ee8VEfq"; 

            try {
                // Make sure EmailJS is defined before using it
                if (typeof emailjs === 'undefined') {
                    throw new Error('EmailJS library not loaded properly');
                }
                
                // Send the form using EmailJS
                emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, contactForm)
                    .then(() => {
                        formStatusMessage.textContent = translations[currentLang]?.form_message_success || 'Xabaringiz muvaffaqiyatli yuborildi!';
                        formStatusMessage.className = 'form-status-message success';
                        contactForm.reset(); // Clear form
                    })
                    .catch((error) => {
                        console.error('EmailJS error:', error);
                        formStatusMessage.textContent = translations[currentLang]?.form_message_error_server_emailjs || 'Xabar yuborishda xatolik yuz berdi. Xizmat sozlamalarini tekshiring.';
                        formStatusMessage.className = 'form-status-message error';
                    })
                    .finally(() => {
                        submitButton.disabled = false;
                        submitButton.style.opacity = '1';
                        setTimeout(() => { 
                            formStatusMessage.textContent = ''; 
                            formStatusMessage.className = 'form-status-message'; 
                        }, 7000);
                    });
            } catch (error) {
                console.error('EmailJS initialization error:', error);
                formStatusMessage.textContent = 'Xabar yuborishda xatolik: EmailJS kutubxonasi yuklanmagan';
                formStatusMessage.className = 'form-status-message error';
                submitButton.disabled = false;
                submitButton.style.opacity = '1';
            }
        });
    }
}