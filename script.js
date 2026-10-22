document.addEventListener('DOMContentLoaded', () => {

    // =======================================================
    // --- 0. TRADUCTION FR / EN ---
    // Le français est lu directement dans le HTML (attributs data-i18n),
    // l'anglais vient du dictionnaire EN ci-dessous.
    // =======================================================

    const EN = {
        // Navigation & pied de page (communs à toutes les pages)
        nav_cv: 'Resume',
        nav_projects: 'Projects',
        nav_contact: 'Contact',
        nav_morpion: 'Tic-Tac-Toe',
        footer: '© 2025 Théo Luthin — All rights reserved',

        // Titres d'onglet
        title_index: 'Théo Luthin - Portfolio',
        title_projects: 'Languages & Projects - Théo Luthin',
        title_contact: 'Contact - Théo Luthin',

        // Page CV
        subtitle: 'Computer Science Student',
        about_h: 'About',
        about_p: 'Passionate about video games and computing in general, I am currently a computer science student. I am looking to develop my programming and web development skills in order to contribute to innovative projects.',
        skills_h: 'Main skills',
        skill_1: 'Back-End programming (Java, Python, C#, SQL)',
        skill_2: 'Project management and teamwork',
        skill_3: 'English',
        exp_h: 'Experience',
        exp_merck_date: 'February 8–12, 2021:',
        exp_merck_title: 'Work-experience placement (final year of middle school) at Merck, a leading life-science laboratory.',
        exp_merck_details: "This placement let me discover the different paths available for my further studies. As my mother works as an IT project manager at the company, I spent most of the placement in her department to learn about her job, which really made me want to continue my higher education in this field.",
        exp_euro_date: 'July 1–31, 2025:',
        exp_euro_title: 'Summer job at Euro-Information Logistique',
        form_h: 'Education',
        form_bac_date: '2021 - 2024:',
        form_bac_title: 'Technological Baccalaureate, Lycée Pasteur, Strasbourg (Honours – "Assez Bien")',
        form_iut_date: '2024 - 2025:',
        form_iut_title: 'Computer Science student, IUT d\'Illkirch',
        form_ynov_date: 'Since September 2025:',
        form_ynov_title: 'Computer Science Bachelor, Ynov Campus Strasbourg',
        photo_alt: 'Profile picture of Théo Luthin',

        // Page Projets
        langs_h: 'Programming languages studied',
        filter_all: 'ALL',
        projects_h: 'Completed projects',
        proj_tech: 'Technologies:',
        proj_link: 'Project Git link:',
        proj_go_title: 'Go Game',
        proj_go_desc: 'Turn-based RPG developed in Go with character management, inventory and combat.',
        proj_go_alt: 'Screenshot of the Go game',
        proj_p4_title: 'Connect 4 in Go-HTML-CSS',
        proj_p4_desc: 'Web implementation of the Connect 4 game.',
        proj_p4_alt: 'Screenshot of the Connect 4 game in Go',

        // Page Contact
        contact_h: '📧 Send me an email',
        label_name: 'Full name:',
        ph_name: 'Your full name',
        label_email: 'Email address:',
        ph_email: 'your.email@example.com',
        label_subject: 'Subject:',
        ph_subject: 'Internship request, collaboration, etc.',
        label_body: 'Message:',
        ph_body: 'Type your message here...',
        btn_send: 'Send (opens your mail client)',
        direct_h: 'Direct contact',
        c_linkedin: 'My LinkedIn account:',
        c_fallback: "If the form doesn't work, you can contact me directly:",
        c_email: 'Email:',
        c_phone: 'Phone:'
    };

    // Textes générés par le JS (compteurs, boutons, morpion, mail...)
    const UI = {
        fr: {
            toLight: '☀️ Mode Clair',
            toDark: '🌙 Mode Sombre',
            langBtn: '🌐 English',
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
            // Morpion
            m_start: "Début du jeu. C'est à vous, Théo !",
            m_yourTurn: 'À vous de jouer, Théo !',
            m_ai: (s) => `L'ordinateur (${s}) réfléchit...`,
            m_win: (who) => `${who === 'human' ? 'Théo' : "L'ordinateur"} a <span class="win-word">Gagné</span> !`,
            m_draw: 'Égalité !'
        },
        en: {
            toLight: '☀️ Light mode',
            toDark: '🌙 Dark mode',
            langBtn: '🌐 Français',
            langLabel: 'Traduire le site en français',
            totalVisits: (n) => `Total site visits: ${n}`,
            sessionVisits: (n) => `Session visits: ${n}`,
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
`,
            // Morpion
            m_start: "Game start. Your turn, Théo!",
            m_yourTurn: 'Your turn, Théo!',
            m_ai: (s) => `The computer (${s}) is thinking...`,
            m_win: (who) => `${who === 'human' ? 'Théo' : 'The computer'} <span class="win-word">won</span>!`,
            m_draw: "It's a draw!"
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
    let morpionStatus = null;   // { key, args }
    let statusMessageEl = null;

    // Marque automatiquement la navigation et le pied de page (utile pour les pages
    // que je n'ai pas modifiées, comme morpion.html)
    [
        ['nav a[href="index.html"]', 'nav_cv'],
        ['nav a[href="projets.html"]', 'nav_projects'],
        ['nav a[href="contact.html"]', 'nav_contact'],
        ['nav a[href="morpion.html"]', 'nav_morpion'],
        ['footer', 'footer']
    ].forEach(([selector, key]) => {
        document.querySelectorAll(selector).forEach(el => {
            if (!el.hasAttribute('data-i18n')) el.setAttribute('data-i18n', key);
        });
    });

    // Mémorise le texte français d'origine
    document.querySelectorAll('[data-i18n]').forEach(el => { el.dataset.fr = el.textContent; });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => { el.dataset.frPlaceholder = el.getAttribute('placeholder') || ''; });
    document.querySelectorAll('[data-i18n-alt]').forEach(el => { el.dataset.frAlt = el.getAttribute('alt') || ''; });

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

        document.querySelectorAll('[data-i18n]').forEach(el => {
            const translated = EN[el.dataset.i18n];
            el.textContent = (lang === 'en' && translated !== undefined) ? translated : el.dataset.fr;
        });
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const translated = EN[el.getAttribute('data-i18n-placeholder')];
            el.setAttribute('placeholder', (lang === 'en' && translated !== undefined) ? translated : el.dataset.frPlaceholder);
        });
        document.querySelectorAll('[data-i18n-alt]').forEach(el => {
            const translated = EN[el.getAttribute('data-i18n-alt')];
            el.setAttribute('alt', (lang === 'en' && translated !== undefined) ? translated : el.dataset.frAlt);
        });

        updateThemeButton();
        if (langSwitcher) {
            langSwitcher.textContent = t('langBtn');
            langSwitcher.setAttribute('aria-label', t('langLabel'));
        }
        renderCounters();
        renderNoProjectMessage();
        renderMorpionStatus();
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
                    const tags = (project.getAttribute('data-tags') || '').split(',');
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