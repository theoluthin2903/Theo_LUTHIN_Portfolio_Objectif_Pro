document.addEventListener('DOMContentLoaded', () => {

    // =======================================================
    // --- 0. TRADUCTION FR / EN ---
    // Les traductions des textes fixes sont stockées dans leurs attributs HTML.
    // =======================================================

    // Textes générés par le JS (compteurs, boutons, mail...)
    const UI = {
        fr: {
            toLight: '☀️ Mode Clair',
            toDark: '🌙 Mode Sombre',
            langBtn: 'English',
            langLabel: "Traduire le site en anglais",
            totalVisits: (n) => `Total de visites du site : ${n}`,
            sessionVisits: (n) => `Visites de session : ${n}`,
            noProject: 'Aucun projet pour ce langage pour le moment.',
            mailDefaultSubject: 'Prise de contact via Portfolio',
            mailUnknown: 'Non spécifié',
            mailEmpty: 'Message vide.',
            mailBody: (name, email, body) => `
Bonjour Théo,

Mon nom est ${name} et mon adresse e-mail est : ${email}

--- Contenu du Message ---

${body}

-------------------------

Cordialement,
${name}
(Envoyé depuis le formulaire de contact de votre portfolio)
`,
        },
        en: {
            toLight: '☀️ Light mode',
            toDark: '🌙 Dark mode',
            langBtn: 'Français',
            langLabel: 'Traduire le site en français',
            totalVisits: (n) => `Total site visits : ${n}`,
            sessionVisits: (n) => `Session visits : ${n}`,
            noProject: 'No project for this language yet.',
            mailDefaultSubject: 'Contact via Portfolio',
            mailUnknown: 'Not specified',
            mailEmpty: 'Empty message.',
            mailBody: (name, email, body) => `
Hello Théo,

My name is ${name} and my email address is: ${email}

--- Message ---

${body}

-------------------------

Best regards,
${name}
(Sent from the contact form of your portfolio)
`
        }
    };

    let lang = localStorage.getItem('lang') === 'en' ? 'en' : 'fr';
    const t = (key, ...args) => {
        const value = UI[lang][key];
        return typeof value === 'function' ? value(...args) : value;
    };

    // Éléments que les autres sections doivent pouvoir re-rendre au changement de langue
    let totalVisitCount = 0;
    let sessionVisitCount = 0;
    let noProjectVisible = false;
    document.querySelectorAll('[data-en]').forEach(el => { el.dataset.fr = el.textContent; });
    document.querySelectorAll('[data-en-placeholder]').forEach(el => { el.dataset.frPlaceholder = el.getAttribute('placeholder') || ''; });
    document.querySelectorAll('[data-en-alt]').forEach(el => { el.dataset.frAlt = el.getAttribute('alt') || ''; });

    // Crée le bouton de langue s'il n'existe pas dans la page
    const themeSwitcher = document.getElementById('theme-switcher');
    let langSwitcher = document.getElementById('lang-switcher');
    if (!langSwitcher && themeSwitcher) {
        langSwitcher = document.createElement('button');
        langSwitcher.id = 'lang-switcher';
        langSwitcher.type = 'button';
        themeSwitcher.parentNode.insertBefore(langSwitcher, themeSwitcher);
    }

    function applyLanguage(newLang) {
        lang = newLang;
        localStorage.setItem('lang', lang);
        document.documentElement.lang = lang;

        document.querySelectorAll('[data-en]').forEach(el => {
            el.textContent = lang === 'en' ? el.dataset.en : el.dataset.fr;
        });
        document.querySelectorAll('[data-en-placeholder]').forEach(el => {
            el.setAttribute('placeholder', lang === 'en' ? el.dataset.enPlaceholder : el.dataset.frPlaceholder);
        });
        document.querySelectorAll('[data-en-alt]').forEach(el => {
            el.setAttribute('alt', lang === 'en' ? el.dataset.enAlt : el.dataset.frAlt);
        });

        updateThemeButton();
        if (langSwitcher) {
            const flag = document.createElement('img');
            flag.className = 'language-flag';
            flag.src = lang === 'fr' ? 'images/flag-gb.svg' : 'images/flag-fr.svg';
            flag.alt = '';
            flag.setAttribute('aria-hidden', 'true');
            langSwitcher.replaceChildren(flag, document.createTextNode(` ${t('langBtn')}`));
            langSwitcher.setAttribute('aria-label', t('langLabel'));
        }
        renderCounters();
        renderNoProjectMessage();
    }

    if (langSwitcher) {
        langSwitcher.addEventListener('click', () => {
            applyLanguage(lang === 'fr' ? 'en' : 'fr');
        });
    }

    // =======================================================
    // --- 1. LOGIQUE DU SWITCH DE THÈME (Dark/Light Mode) ---
    // =======================================================
    const savedTheme = localStorage.getItem('theme') || 'dark'; // Thème par défaut: dark

    document.body.classList.remove('light-mode', 'dark-mode');
    document.body.classList.add(savedTheme + '-mode');

    function updateThemeButton() {
        if (!themeSwitcher) return;
        themeSwitcher.textContent = document.body.classList.contains('light-mode') ? t('toDark') : t('toLight');
    }

    if (themeSwitcher) {
        themeSwitcher.addEventListener('click', () => {
            const currentTheme = document.body.classList.contains('light-mode') ? 'light' : 'dark';
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

            document.body.classList.remove(currentTheme + '-mode');
            document.body.classList.add(newTheme + '-mode');
            localStorage.setItem('theme', newTheme);

            updateThemeButton();
        });
    }

    // =======================================================
    // --- 2. LOGIQUE DES COMPTEURS DE VISITES ---
    // =======================================================
    const SESSION_COUNTER_KEY = 'pageLoadCount_session';
    const PERMANENT_COUNTER_KEY = 'siteTotalVisitCount_permanent';

    function renderCounters() {
        const totalEl = document.getElementById('totalVisitsDisplay');
        const sessionEl = document.getElementById('counterDisplay');
        if (totalEl) totalEl.textContent = t('totalVisits', totalVisitCount);
        if (sessionEl) sessionEl.textContent = t('sessionVisits', sessionVisitCount);
    }

    function updateVisitCounters() {
        const storedTotal = parseInt(localStorage.getItem(PERMANENT_COUNTER_KEY), 10) || 0;
        const storedSession = sessionStorage.getItem(SESSION_COUNTER_KEY);

        if (storedSession) {
            // Navigation dans la même session : on n'incrémente que le compteur de session
            sessionVisitCount = (parseInt(storedSession, 10) || 0) + 1;
            totalVisitCount = storedTotal;
        } else {
            // Nouvelle session : on incrémente aussi le total permanent
            sessionVisitCount = 1;
            totalVisitCount = storedTotal + 1;
            localStorage.setItem(PERMANENT_COUNTER_KEY, totalVisitCount.toString());
        }

        sessionStorage.setItem(SESSION_COUNTER_KEY, sessionVisitCount.toString());
        renderCounters();
    }

    updateVisitCounters();

    // =======================================================
    // --- 3. LOGIQUE DU CARROUSEL (NAVIGATION UN PAR UN) ---
    // =======================================================
    const carousel = document.getElementById('projects-carousel');

    function getVisibleProjects() {
        if (!carousel) return [];
        return Array.from(carousel.querySelectorAll('.project'))
            .filter(project => project.style.display !== 'none');
    }

    // Affiche le projet n° index et cache les autres
    function showProject(projects, index) {
        projects.forEach((project, i) => {
            const isCurrent = i === index;
            project.style.position = isCurrent ? 'relative' : 'absolute';
            project.style.opacity = isCurrent ? '1' : '0';
            project.style.pointerEvents = isCurrent ? 'auto' : 'none';
            project.classList.toggle('is-current', isCurrent);
        });
    }

    function moveCarousel(direction) {
        const projects = getVisibleProjects();
        if (projects.length === 0) return;

        let currentIndex = projects.findIndex(p => p.classList.contains('is-current'));
        if (currentIndex === -1) currentIndex = 0;

        const newIndex = (currentIndex + direction + projects.length) % projects.length;
        showProject(projects, newIndex);
    }

    document.querySelectorAll('.carousel-control').forEach(button => {
        button.addEventListener('click', () => {
            moveCarousel(button.classList.contains('next-btn') ? 1 : -1);
        });
    });

    if (carousel) {
        // Premier projet affiché au chargement
        const projects = getVisibleProjects();
        if (projects.length > 0) showProject(projects, 0);

        // Balayage tactile sur mobile
        let touchStartX = null;
        carousel.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].clientX;
        }, { passive: true });
        carousel.addEventListener('touchend', (e) => {
            if (touchStartX === null) return;
            const deltaX = e.changedTouches[0].clientX - touchStartX;
            touchStartX = null;
            if (Math.abs(deltaX) > 50) moveCarousel(deltaX < 0 ? 1 : -1);
        }, { passive: true });
    }

    // ======================================================
    // --- 4. LOGIQUE DU FORMULAIRE CONTACT (Mailto) ---
    // ======================================================
    const contactForm = document.getElementById('contact-form');
    const recipientEmail = 'theo.luthin2903@gmail.com';

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('name')?.value || t('mailUnknown');
            const email = document.getElementById('email')?.value || t('mailUnknown');
            const subject = document.getElementById('subject')?.value || t('mailDefaultSubject');
            const body = document.getElementById('body')?.value || t('mailEmpty');

            const mailtoLink = `mailto:${recipientEmail}` +
                '?subject=' + encodeURIComponent(subject) +
                '&body=' + encodeURIComponent(t('mailBody', name, email, body));

            window.location.href = mailtoLink;
            contactForm.reset();
        });
    }

    // ======================================================
    // --- 5. LOGIQUE DE FILTRAGE DES PROJETS PAR LANGAGE ---
    // ======================================================
    const filterContainer = document.getElementById('skills-filter');
    const projectItems = document.querySelectorAll('.projects-carousel .project');
    const noProjectMessage = document.getElementById('no-project-message');

    function renderNoProjectMessage() {
        if (!noProjectMessage) return;
        noProjectMessage.textContent = noProjectVisible ? t('noProject') : '';
        noProjectMessage.style.display = noProjectVisible ? 'block' : 'none';
    }

    if (filterContainer && projectItems.length > 0) {
        filterContainer.addEventListener('click', (e) => {
            const target = e.target;

            if (target.tagName === 'LI' && target.hasAttribute('data-filter')) {
                const selectedFilter = target.getAttribute('data-filter');

                filterContainer.querySelector('.active-filter')?.classList.remove('active-filter');
                target.classList.add('active-filter');

                projectItems.forEach(project => {
                    const tags = (project.getAttribute('data-tags') || '')
                        .split(',')
                        .map(tag => tag.trim());
                    const match = selectedFilter === 'all' || tags.includes(selectedFilter);
                    project.style.display = match ? 'block' : 'none';
                });

                const visibleProjects = getVisibleProjects();
                if (visibleProjects.length > 0) showProject(visibleProjects, 0);

                noProjectVisible = visibleProjects.length === 0;
                renderNoProjectMessage();
            }
        });
    }
    // =======================================================
    // --- INITIALISATION DE LA LANGUE (en dernier) ---
    // =======================================================
    applyLanguage(lang);
});