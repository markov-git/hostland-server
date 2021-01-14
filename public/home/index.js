const toggle = document.querySelector('.toggle')
const burger = toggle.querySelector('.burger')
const cross = toggle.querySelector('.cross')

const sidebar = document.querySelector('.sidebar')
const about = document.querySelector('.about')
const contact = document.querySelector('.contact')
const links = document.querySelectorAll('#toggleLink')

function toggleMenu() {
    burger.classList.toggle('hide')
    cross.classList.toggle('hide')
    toggle.classList.toggle('active')
    sidebar.classList.toggle('active')
}



links.forEach(link => {
    link.addEventListener('click', () => {
        toggleMenu()
    })
})

toggle.addEventListener('click', () => {
    toggleMenu()
})
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



