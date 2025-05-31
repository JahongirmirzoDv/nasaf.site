const translations = {}; // Bu yerga yuklangan tarjimalar saqlanadi
let currentLang = 'uz'; // Standart til

// Til faylini yuklash funksiyasi
async function loadTranslations(lang) {
    try {
        const response = await fetch(`lang/${lang}.json?v=${new Date().getTime()}`); // Cache'ni chetlab o'tish uchun ?v=...
        if (!response.ok) {
            console.error(`Could not load ${lang}.json: ${response.statusText}`);
            return;
        }
        translations[lang] = await response.json();
        console.log(`${lang}.json yuklandi.`);
    } catch (error) {
        console.error(`Error loading ${lang}.json:`, error);
    }
}

// Sahifadagi matnlarni yangilash funksiyasi
function applyTranslations(lang) {
    if (!translations[lang]) {
        console.warn(`Tarjimalar topilmadi: ${lang}`);
        return;
    }
    document.querySelectorAll('[data-lang]').forEach(element => {
        const key = element.getAttribute('data-lang');
        let translation = translations[lang][key];

        if (translation) {
            // Dinamik qiymatlarni almashtirish (masalan, yil)
            if (key === 'footer_copyright') {
                translation = translation.replace('{currentYear}', new Date().getFullYear());
            }
            element.textContent = translation;
        } else {
            console.warn(`Kalit uchun tarjima topilmadi: ${key} (${lang} tilida)`);
        }
    });
    // Sahifa sarlavhasini ham o'zgartirish
    const pageTitleKey = document.title.getAttribute('data-lang');
    if (pageTitleKey && translations[lang][pageTitleKey]) {
        document.title.textContent = translations[lang][pageTitleKey];
    }

    // HTML elementining lang atributini yangilash
    document.documentElement.lang = lang;
}

// Tilni almashtirish funksiyasi
async function switchLanguage(lang) {
    if (!translations[lang]) {
        await loadTranslations(lang); // Agar tarjima yuklanmagan bo'lsa, yuklaymiz
    }
    if (translations[lang]) {
        currentLang = lang;
        applyTranslations(lang);
        localStorage.setItem('preferredLang', lang); // Foydalanuvchi tanlovini saqlab qolish
        updateActiveLangButton(lang);
    } else {
        console.error(`Tilga o'tish muvaffaqiyatsiz: ${lang}. Tarjimalar mavjud emas.`);
    }
}

// Aktiv til tugmasini belgilash
function updateActiveLangButton(lang) {
    document.querySelectorAll('.language-switcher button').forEach(button => {
        if (button.getAttribute('data-lang-switch') === lang) {
            button.classList.add('active'); // CSS da .active klassiga uslub berish kerak
        } else {
            button.classList.remove('active');
        }
    });
}


// Sahifa yuklanganda boshlang'ich tilni sozlash
document.addEventListener('DOMContentLoaded', async () => {
    const preferredLang = localStorage.getItem('preferredLang') || 'uz'; // Saqlangan til yoki standart til
    currentLang = preferredLang;

    await loadTranslations(currentLang); // Joriy til uchun tarjimalarni yuklaymiz
    if (translations[currentLang]) {
        applyTranslations(currentLang);
    } else {
        // Agar saqlangan tilning tarjimasi topilmasa, standart 'uz' tiliga o'tish
        console.warn(`Saqlangan til (${currentLang}) uchun tarjima topilmadi, 'uz' tiliga o'tilmoqda.`);
        currentLang = 'uz';
        await loadTranslations(currentLang);
        if (translations[currentLang]) {
            applyTranslations(currentLang);
        }
    }
    updateActiveLangButton(currentLang);


    // Til almashtirish tugmalariga event listener qo'shish
    document.querySelectorAll('.language-switcher button').forEach(button => {
        button.addEventListener('click', () => {
            const lang = button.getAttribute('data-lang-switch');
            switchLanguage(lang);
        });
    });
});