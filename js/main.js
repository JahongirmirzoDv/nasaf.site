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
 * Initializes the contact form to submit data to the Firebase Cloud Function.
 */
function initContactForm() {
    const contactForm = document.getElementById('mainContactForm');
    if (!contactForm) return;

    const formStatusMessage = document.getElementById('formStatusMessage');

    contactForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        // NOTE: Replace with your actual Firebase project ID and region
        const CLOUD_FUNCTION_URL = 'https://<REGION>-<PROJECT_ID>.cloudfunctions.net/sendContactEmailWithResend';

        const submitButton = contactForm.querySelector('button[type="submit"]');
        const formData = new FormData(contactForm);
        const formValues = Object.fromEntries(formData.entries());
        
        // Basic validation
        if (!formValues.fullName || !formValues.email || !formValues.subject || !formValues.message) {
            formStatusMessage.textContent = 'Iltimos, barcha kerakli maydonlarni to\'ldiring.';
            formStatusMessage.className = 'form-status-message error';
            return;
        }

        // Disable button and show sending message
        submitButton.disabled = true;
        submitButton.style.opacity = '0.7';
        formStatusMessage.textContent = 'Yuborilmoqda...';
        formStatusMessage.className = 'form-status-message';

        try {
            const response = await fetch(CLOUD_FUNCTION_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formValues),
            });

            const result = await response.json();

            if (response.ok && result.success) {
                formStatusMessage.textContent = result.message || 'Xabaringiz muvaffaqiyatli yuborildi!';
                formStatusMessage.className = 'form-status-message success';
                contactForm.reset();
            } else {
                throw new Error(result.message || 'Serverda xatolik yuz berdi.');
            }

        } catch (error) {
            console.error('Form submission error:', error);
            formStatusMessage.textContent = error.message || 'Xabar yuborishda kutilmagan xatolik.';
            formStatusMessage.className = 'form-status-message error';
        } finally {
            submitButton.disabled = false;
            submitButton.style.opacity = '1';
            // Clear message after a few seconds
            setTimeout(() => {
                formStatusMessage.textContent = '';
                formStatusMessage.className = 'form-status-message';
            }, 7000);
        }
    });
}