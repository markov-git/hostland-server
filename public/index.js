function toggleMenu() {
    const menuToggle = document.querySelector('.toggle')
    const sidebar = document.querySelector('.sidebar')
    menuToggle.classList.toggle('active')
    sidebar.classList.toggle('active')
}

const toggle = document.querySelector('.toggle')
const about = document.querySelector('.about')
const contact = document.querySelector('.contact')
if (window.scrollY < 45) {
    toggle.classList.add('hidden')
}
window.addEventListener('scroll', () => {
    const sY = window.scrollY
    if (sY < 45) {
        toggle.classList.add('hidden')
    } else {
        toggle.classList.remove('hidden')
    }
    const y1 = about.getBoundingClientRect().y + pageYOffset
    const y2 = y1 + about.getBoundingClientRect().height

    const y3 = contact.getBoundingClientRect().y + pageYOffset
    const y4 = y3 + contact.getBoundingClientRect().height
    if ((sY + 50 > y1 && sY + 50 < y2) ||
        (sY + 50 > y3 && sY + 50 < y4)) {
        toggle.classList.add('invert')
    } else {
        toggle.classList.remove('invert')
    }
})