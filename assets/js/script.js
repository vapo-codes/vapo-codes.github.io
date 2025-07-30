import '/assets/js/typed-js/typed.umd.js'
// i18n - ty Hoha Nabil ❤
// https://medium.com/@nohanabil/building-a-multilingual-static-website-a-step-by-step-guide-7af238cc8505
let typedInstance = null;
document.addEventListener('DOMContentLoaded', async () => {
    //Burger menu
    const $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);

    // Add a click event on each of them
    $navbarBurgers.forEach(el => {
        el.addEventListener('click', () => {

            // Get the target from the "data-target" attribute
            const target = el.dataset.target;
            const $target = document.getElementById(target);

            // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
            el.classList.toggle('is-active');
            $target.classList.toggle('is-active');

        });
    });

    //theme & language
    await updateTheme();
    const userPreferredLanguage = localStorage.getItem('language') || 'hu';
    document.getElementById(`lang-${userPreferredLanguage}`).checked = true;
    const langData = await fetchLanguageData(userPreferredLanguage);
    updateContent(langData);
    createTypedTitle(userPreferredLanguage);

    document.getElementsByTagName("body")[0].classList.remove("is-hidden");

    document.getElementById('vapo-burger').addEventListener('click', () => {
        const burgerLight = document.getElementById("burger-light");
        const burgerDark = document.getElementById("burger-dark");

        const isLightVisible = window.getComputedStyle(burgerLight).display !== "none";
        const isDarkVisible = window.getComputedStyle(burgerDark).display !== "none";

        document.getElementById('navbar-menu').classList.toggle('is-active');

        let currentVisible = burgerDark;
        if (isLightVisible) {
            console.log("Light mode logo is active.");
            currentVisible = burgerLight;
        } else if (isDarkVisible) {
            console.log("Dark mode logo is active.");
        }

        if (document.getElementById('navbar-menu').classList.contains('is-active')) {
            currentVisible.src = isLightVisible ? 'assets/svg/vapo.svg' : 'assets/svg/vapo-white.svg'
        } else {
            currentVisible.src = 'assets/svg/vapo-color.svg'

        }
    })
});

async function fetchLanguageData(lang) {
    const response = await fetch(`/assets/js/i18n/${lang}.json`);
    return response.json();
}

function updateContent(langData) {
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        element.innerHTML = key.split('.')
            .reduce((obj, k) => (obj && obj[k]) ? obj[k] : '', langData);
    });
}

async function changeLanguage(lang) {
    await setLanguagePreference(lang);

    const langData = await fetchLanguageData(lang);
    updateContent(langData);
}

function setLanguagePreference(lang) {
    localStorage.setItem('language', lang);
}

document.querySelectorAll('input[name="lang"]').forEach(radio => {
    radio.addEventListener('change', async () => {
        const selectedLanguage = document.querySelector('input[name="lang"]:checked').value;
        changeLanguage(selectedLanguage).then(() =>
            createTypedTitle(selectedLanguage)
        )
    });
});

function createTypedTitle(userPreferredLanguage) {

    if (typedInstance) {
        typedInstance.destroy();
        typedInstance = null;
    }
    typedInstance = new Typed('#title-adjective', {
        strings: getTitleStrings(userPreferredLanguage),
        typeSpeed: 150,
        backDelay: 2000,
        backSpeed: 100,
        loop: true
    });
}

function getTitleStrings(language) {
    switch (language) {
        case 'en':
            return ['developers.', 'friends.', 'colleagues.', 'nerds.', 'V^500a^500P^500o^500.^1000'];
        default:
            return ['Fejlesztők', 'Barátok', 'Kollégák', 'Güzük', 'V^500a^500P^500o^500'];
    }
}

//scroll to
document.getElementById('scroll-to-top').addEventListener('click', (e) => {
    scrollToTop();
})

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    })
}

//theme
const root = document.getElementsByTagName('html')[0];
document.querySelectorAll('input[name="theme"]').forEach(radio => {
    radio.addEventListener('change', async () => {
        const selectedTheme = document.querySelector('input[name="theme"]:checked').value;
        if (selectedTheme === 'system') {
            await removeThemePreference().then(() => {
                root.removeAttribute('data-theme');
            })
            return;
        }
        await setThemePreference(selectedTheme).then(() => {
            root.setAttribute('data-theme', selectedTheme);
        })
    });
});

async function updateTheme() {
    getThemePreference().then((theme) => {
        if (theme === null) {
            document.getElementById('system-theme-button').checked = true;
            return;
        }
        document.getElementById(`${theme}-theme-button`).checked = true;
        root.setAttribute('data-theme', theme);
    })
}

async function setThemePreference(theme) {
    localStorage.setItem('theme', theme);
}

async function getThemePreference() {
    return localStorage.getItem('theme')
}

async function removeThemePreference() {
    localStorage.removeItem('theme');
}