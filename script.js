'use strict';

// Add future projects here. Categories must match the filter buttons.
const projects = [
    {
        id: 'loreal', title: 'L’Oréal AI Routine Builder', icon: 'fa-robot',
        tech: 'JavaScript + AI + REST APIs', categories: ['Web', 'AI', 'APIs'],
        slug: 'GCA-Project10-LorealProductChatbot',
        description: 'An AI-powered, product-aware chatbot that helps users discover beauty products and build personalized routines.',
        overview: 'A Global Career Accelerator project exploring how conversational AI and product information can support personalized beauty routines.',
        features: ['Conversational AI interface', 'Product-aware recommendations', 'Personalized routine building'],
        tools: ['HTML', 'CSS', 'JavaScript', 'AI Integration', 'REST APIs'],
        learning: 'Connecting AI responses with product context and designing a useful conversational experience.'
    },
    {
        id: 'water', title: 'Water Rush – charity: water', icon: 'fa-gamepad',
        tech: 'HTML + CSS + JavaScript', categories: ['Web', 'Games'],
        slug: 'GCA-Project7-WaterGame',
        description: 'An interactive pipe puzzle game featuring 10 levels, three difficulty settings, achievements, sound effects, and progress tracking.',
        overview: 'A water-themed puzzle game developed through the Global Career Accelerator to raise awareness about access to clean water.',
        features: ['10 playable levels', 'Easy, Normal and Hard difficulty modes', 'Interactive pipe puzzle mechanics', 'Achievements and progress tracking', 'Sound effects and audio controls', 'Level selection and restart controls'],
        tools: ['HTML5', 'CSS3', 'JavaScript', 'DOM Manipulation', 'Game Logic'],
        learning: 'Game logic, event handling, state management, responsive design, and improving the overall user experience.'
    },
    {
        id: 'nasa', title: 'NASA Space Explorer', icon: 'fa-rocket',
        tech: 'HTML + CSS + JavaScript + APIs', categories: ['Web', 'APIs'],
        slug: 'GCA-Project8-NASASpaceExplorer',
        description: 'An interactive website that brings space exploration and NASA data to users through an engaging web experience.',
        overview: 'A web development project exploring how space-related information can be presented through an interactive interface.',
        features: ['Space exploration interface', 'NASA data integration', 'Interactive web experience'],
        tools: ['HTML', 'CSS', 'JavaScript', 'APIs'],
        learning: 'Working with external data and presenting information through a user-friendly interface.'
    },
    {
        id: 'summit', title: 'Intel Summit Check-In', icon: 'fa-users',
        tech: 'HTML + CSS + JavaScript', categories: ['Web'],
        slug: 'GCA-Project5-IntelSummitCheck',
        description: 'A dynamic event check-in application featuring attendee registration, team tracking, and real-time participation updates.',
        overview: 'An event check-in application built to practice JavaScript and dynamic updates to a web interface.',
        features: ['Attendee check-in', 'Water Wise, Net Zero and Renewables teams', 'Total and per-team participation counts', 'Input validation and reset controls'],
        tools: ['HTML', 'CSS', 'JavaScript', 'DOM Manipulation'],
        learning: 'Handling user input, updating the DOM, validating forms, and managing application state.'
    },
    {
        id: 'intel', title: 'Intel Sustainability & Localization', icon: 'fa-language',
        tech: 'HTML + CSS + Bootstrap + JavaScript', categories: ['Web'],
        slug: 'GCA-Project3-IntelWebsiteLocalization',
        description: 'A responsive sustainability timeline enhanced with multilingual support, localization, and accessibility features.',
        overview: 'An expanded version of my Intel sustainability timeline, focused on making the website more accessible and adaptable to different audiences.',
        features: ['Responsive sustainability timeline', 'English and Spanish language options', 'Bootstrap layout and navigation', 'Accessibility improvements'],
        tools: ['HTML', 'CSS', 'Bootstrap', 'JavaScript', 'JSON'],
        learning: 'Responsive layouts, localization, accessibility, and adapting an existing website for different audiences.'
    },
    {
        id: 'portfolio', title: 'Personal Portfolio Website', icon: 'fa-globe',
        tech: 'HTML + CSS + JavaScript', categories: ['Web'],
        slug: 'GCA-Project1-PortfolioWebsite',
        description: 'A retro-inspired personal portfolio showcasing my skills, projects, and development journey.',
        overview: 'My first Global Career Accelerator project, originally built with HTML and CSS and later expanded with JavaScript while preserving its pixel-art identity.',
        features: ['Retro pixel-art theme', 'Responsive layout', 'Dynamic project cards and filters', 'Project details popups', 'Mobile navigation and scroll interactions'],
        tools: ['HTML', 'CSS', 'JavaScript', 'Font Awesome', 'GitHub Pages'],
        learning: 'Building a website from scratch and improving its functionality while maintaining a consistent visual design.',
        joke: 'Yes, this project links to itself. That’s basically recursion... right? 🤔'
    }
];

const list = document.querySelector('#project-list');
const count = document.querySelector('#project-count');
const filters = [...document.querySelectorAll('[data-filter]')];
const dialog = document.querySelector('#project-dialog');
const navbar = document.querySelector('.navbar');
const menu = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('#nav-links');
const backToTop = document.querySelector('#back-to-top');
const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
const mobile = window.matchMedia('(max-width: 800px)');
let lastTrigger = null;

// Build DOM nodes using textContent so project text is not interpreted as HTML.
function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
}
function icon(name) {
    const node = element('i', name);
    node.setAttribute('aria-hidden', 'true');
    return node;
}
function actionLink(project, github = false) {
    const link = element('a', github ? 'secondary-button' : 'project-button');
    link.href = github ? `https://github.com/FZNALI15/${project.slug}` : `https://fznali15.github.io/${project.slug}/`;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.append(icon(github ? 'fa-brands fa-github' : 'fa-solid fa-arrow-up-right-from-square'), document.createTextNode(github ? ' GITHUB' : ' VIEW PROJECT'));
    link.setAttribute('aria-label', `${github ? 'GitHub repository for' : 'View'} ${project.title} (opens in a new tab)`);
    return link;
}

// Reveal cards once as they enter the viewport.
const observer = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.remove('reveal-pending');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.08 }) : null;
function observeReveals(root) {
    if (!observer || motion.matches) return;
    root.querySelectorAll('.reveal').forEach(node => {
        if (node.getBoundingClientRect().top >= window.innerHeight) {
            node.classList.add('reveal-pending');
            observer.observe(node);
        }
    });
}
function renderProjects(category = 'All', animate = false) {
    if (observer) list.querySelectorAll('.reveal').forEach(node => observer.unobserve(node));
    list.replaceChildren();
    const visible = projects.filter(p => category === 'All' || p.categories.includes(category));
    visible.forEach(project => {
        const card = element('article', 'project-card reveal' + (animate ? ' filter-enter' : ''));
        const symbol = element('div', 'project-icon');
        symbol.append(icon(`fa-solid ${project.icon}`));
        card.append(symbol, element('h3', '', project.title), element('p', 'project-tech', project.tech), element('p', '', project.description));
        if (project.joke) card.append(element('p', 'recursion-joke', project.joke));
        const actions = element('div', 'project-actions');
        const secondary = element('div', 'secondary-actions');
        const details = element('button', 'secondary-button');
        details.type = 'button';
        details.append(icon('fa-solid fa-circle-info'), document.createTextNode(' DETAILS'));
        details.setAttribute('aria-label', `Details about ${project.title}`);
        details.addEventListener('click', () => openDetails(project, details));
        secondary.append(actionLink(project, true), details);
        actions.append(actionLink(project), secondary);
        card.append(actions);
        list.append(card);
    });
    if (category === 'All') {
        const future = element('article', 'project-card future-project reveal');
        const symbol = element('div', 'project-icon');
        symbol.append(icon('fa-solid fa-lock'));
        future.append(symbol, element('h3', '', 'Project Loading...'), element('p', '', 'Something cool will eventually live here. Hopefully.'), element('span', 'coming-soon', 'COMING SOON'));
        list.append(future);
    }
    count.textContent = `Showing ${visible.length} of ${projects.length} projects`;
    filters.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === category)));
    observeReveals(list);
    updateScroll();
}
filters.forEach(button => button.addEventListener('click', () => renderProjects(button.dataset.filter, true)));

// Native dialog provides keyboard focus containment and Escape support.
function openDetails(project, trigger) {
    lastTrigger = trigger;
    document.querySelector('#dialog-title').textContent = project.title;
    const content = document.querySelector('#dialog-content');
    content.replaceChildren();
    content.append(element('h3', '', 'PROJECT OVERVIEW'), element('p', '', project.overview), element('h3', '', 'KEY FEATURES'));
    const features = element('ul');
    project.features.forEach(feature => features.append(element('li', '', feature)));
    content.append(features, element('h3', '', 'TECHNOLOGIES'));
    const tags = element('div', 'tech-tags');
    project.tools.forEach(tool => tags.append(element('span', 'tech-tag', tool)));
    content.append(tags, element('h3', '', 'WHAT I LEARNED'), element('p', '', project.learning));
    const links = element('div', 'dialog-links');
    links.append(actionLink(project), actionLink(project, true));
    content.append(links);
    dialog.showModal();
    dialog.scrollTop = 0;
    document.body.classList.add('modal-open');
}
dialog.querySelectorAll('.dialog-close, .close-bottom').forEach(button => button.addEventListener('click', () => dialog.close()));
dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
});
dialog.addEventListener('close', () => {
    document.body.classList.remove('modal-open');
    if (lastTrigger?.isConnected) lastTrigger.focus({ preventScroll: true });
});

// Responsive navigation.
function updateNavHeight() {
    document.documentElement.style.setProperty('--nav-height', `${navbar.offsetHeight}px`);
}
function setMenu(open) {
    navLinks.classList.toggle('open', open);
    menu.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    menu.querySelector('i').className = open ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
    updateNavHeight();
}
menu.addEventListener('click', () => setMenu(!navLinks.classList.contains('open')));
navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
document.querySelector('.logo').addEventListener('click', () => setMenu(false));
document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && navLinks.classList.contains('open')) { setMenu(false); menu.focus(); }
});
document.addEventListener('click', event => {
    if (navLinks.classList.contains('open') && !navbar.contains(event.target)) setMenu(false);
});
mobile.addEventListener('change', () => setMenu(false));

// Active section and back-to-top button.
const sections = [...document.querySelectorAll('main > section[id]')];
const anchors = [...navLinks.querySelectorAll('a')];
function updateScroll() {
    const marker = navbar.offsetHeight + 40;
    let active = 'home';
    sections.forEach(section => { if (section.getBoundingClientRect().top <= marker) active = section.id; });
    if (window.scrollY > 0 && window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) active = 'contact';
    anchors.forEach(anchor => {
        const current = anchor.hash === `#${active}`;
        anchor.classList.toggle('active', current);
        if (current) anchor.setAttribute('aria-current', 'location');
        else anchor.removeAttribute('aria-current');
    });
    backToTop.hidden = window.scrollY < 400;
}
let queued = false;
window.addEventListener('scroll', () => {
    if (!queued) {
        queued = true;
        requestAnimationFrame(() => { updateScroll(); queued = false; });
    }
}, { passive: true });
window.addEventListener('resize', () => { updateNavHeight(); updateScroll(); });
backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: motion.matches ? 'instant' : 'smooth' }));
motion.addEventListener('change', () => {
    if (motion.matches) document.querySelectorAll('.reveal-pending').forEach(node => { node.classList.remove('reveal-pending'); observer?.unobserve(node); });
});

document.documentElement.classList.add('js-ready');
updateNavHeight();
renderProjects();
observeReveals(document);
updateScroll();
if (document.fonts) document.fonts.ready.then(() => { updateNavHeight(); updateScroll(); });
