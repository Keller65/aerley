const nav = document.getElementById('navbar');
const container = document.getElementById('container_father');
const section = document.getElementById('sectionPrimary');

function updateParallax() {
    const scrollTop = window.scrollY;

    nav.style.transform = `translateY(${scrollTop * 0.3}px)`;
    container.style.transform = `translateY(${scrollTop * 0.5}px)`;
}

function updateOpacity() {
    const scrollTop = window.scrollY;
    const sectionRect = section.getBoundingClientRect();

    if (sectionRect.top < window.innerHeight && sectionRect.bottom >= 0) {
        const opacity = 1 - (sectionRect.top / window.innerHeight);
        section.style.opacity = opacity;
    } 
}

window.addEventListener('scroll', updateOpacity);

section.style.opacity = 0;

window.addEventListener('scroll', updateParallax);