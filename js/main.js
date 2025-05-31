document.addEventListener('DOMContentLoaded', () => {
    // ... (your existing code)

    // Lightbox for Projects
    const projectImages = document.querySelectorAll('.project-image-clickable');
    if (projectImages.length > 0) {
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

        projectImages.forEach(image => {
            image.addEventListener('click', function() {
                const largeSrc = this.dataset.largeSrc || this.src;
                lightbox.style.display = 'flex'; // Show lightbox
                lightboxImage.src = largeSrc;
                lightboxImage.alt = this.alt; // Set alt from the clicked image
                document.body.style.overflow = 'hidden'; // Prevent background scroll
            });
        });

        closeBtn.addEventListener('click', () => {
            lightbox.style.display = 'none';
            document.body.style.overflow = 'auto';
        });

        lightbox.addEventListener('click', (e) => { // Close on clicking background
            if (e.target === lightbox) {
                lightbox.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    }
});


// main.js faylining oxiriga qo'shing

// Contact Form Submission (Placeholder)
// main.js faylidagi mavjud contactForm qismini TO'LIQ O'ZGARTIRING

const contactForm = document.getElementById('mainContactForm');
const formStatusMessage = document.getElementById('formStatusMessage');

if (contactForm && formStatusMessage) {
    contactForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Haqiqiy HTML forma yuborishni to'xtatish
        
        console.log('Form submission started');
        // Debug form data
        const formData = new FormData(contactForm);
        const formValues = {};
        for (let [key, value] of formData.entries()) {
            formValues[key] = value;
        }
        console.log('Form data:', formValues);
        
        let isValid = true;
        const requiredFields = contactForm.querySelectorAll('[required]');
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                field.style.borderColor = '#dc3545'; // Xatolik rangi
            } else {
                field.style.borderColor = '#ddd'; // Asl holiga qaytarish
            }
        });

        if (!isValid) {
            formStatusMessage.textContent = translations[currentLang]?.form_message_error_fill || 'Iltimos, barcha kerakli maydonlarni to\'ldiring.';
            formStatusMessage.className = 'form-status-message error';
            setTimeout(() => { formStatusMessage.textContent = ''; formStatusMessage.className = 'form-status-message'; }, 5000);
            return;
        }

        const submitButton = contactForm.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.style.opacity = '0.7';
        formStatusMessage.textContent = translations[currentLang]?.form_message_sending || 'Yuborilmoqda...';
        formStatusMessage.className = 'form-status-message';

        // EmailJS settings
        const SERVICE_ID = "service_2rd7x3g";    
        const TEMPLATE_ID = "template_bjsr8ew";  

        // Forma maydonlarining 'name' atributlari EmailJS shablonidagi o'zgaruvchilarga mos kelishi kerak.
        // Masalan, <input type="text" name="fullName"> shablonda {{fullName}} ga mos keladi.
        // Hozirgi HTML formamizdagi 'name' atributlari shunga mos:
        // fullName, email, phone, subject, message

        console.log('Submitting form with EmailJS:', { SERVICE_ID, TEMPLATE_ID, form: contactForm });
        
        emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, contactForm) // Using contactForm instead of 'this'
            .then((response) => {
                console.log('EmailJS success:', response);
                formStatusMessage.textContent = translations[currentLang]?.form_message_success || 'Xabaringiz muvaffaqiyatli yuborildi!';
                formStatusMessage.className = 'form-status-message success';
                contactForm.reset(); // Formani tozalash
            }, (error) => {
                console.error('EmailJS xatoligi (details):', { 
                    message: error.message,
                    text: error.text,
                    status: error.status,
                    name: error.name
                });
                formStatusMessage.textContent = translations[currentLang]?.form_message_error_server_emailjs || 'Xabar yuborishda xatolik yuz berdi. Xizmat sozlamalarini tekshiring.';
                formStatusMessage.className = 'form-status-message error';
            })
            .finally(() => {
                submitButton.disabled = false;
                submitButton.style.opacity = '1';
                setTimeout(() => { formStatusMessage.textContent = ''; formStatusMessage.className = 'form-status-message'; }, 7000);
            });
    });
}