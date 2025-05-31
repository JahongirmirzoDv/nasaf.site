document.addEventListener('DOMContentLoaded', () => {
    // Joriy yilni footer'ga qo'yish
    const yearSpan = document.getElementById('currentYear');
    if (yearSpan && !yearSpan.textContent) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // Navigatsiyadagi aktiv sahifani belgilash
    const currentPage = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll('header nav ul li a').forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // Mobil menyu ochish/yopish
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('header nav');

    if (menuToggle && nav) {
        menuToggle.addEventListener('click', () => {
            nav.classList.toggle('active'); // 'active' klassini qo'shish/olib tashlash
            const isExpanded = nav.classList.contains('active');
            menuToggle.setAttribute('aria-expanded', isExpanded);
            if(isExpanded) {
                menuToggle.setAttribute('aria-label', "Menyuni yopish");
            } else {
                menuToggle.setAttribute('aria-label', "Menyuni ochish");
            }
        });
    }

    // Boshqa umumiy JavaScript kodlari shu yerga yoziladi
});


// main.js faylining oxiriga qo'shing

// Contact Form Submission (Placeholder)
// main.js faylidagi mavjud contactForm qismini TO'LIQ O'ZGARTIRING

const contactForm = document.getElementById('mainContactForm');
const formStatusMessage = document.getElementById('formStatusMessage');

if (contactForm && formStatusMessage) {
    contactForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Haqiqiy HTML forma yuborishni to'xtatish

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

        emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, this) // 'this' forma elementiga ishora qiladi
            .then(() => {
                formStatusMessage.textContent = translations[currentLang]?.form_message_success || 'Xabaringiz muvaffaqiyatli yuborildi!';
                formStatusMessage.className = 'form-status-message success';
                contactForm.reset(); // Formani tozalash
            }, (error) => {
                console.error('EmailJS xatoligi:', error);
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