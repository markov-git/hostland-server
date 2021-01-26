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
let sY = window.scrollY

if (sY < 45) {
  toggle.classList.add('hidden')
}

const dashKeys = ['62.8,188.4', '150.7,100.5', '175.8,75.4', '125.6,125.6', '100.48,150.72', '75.4,175.8', '150.7,100.5', '150.7,100.5']

window.addEventListener('scroll', () => {
  sY = window.scrollY
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
  if (dashKeys.length) {
    startAnimation(sY)
  }
})

const pathes = Array.from(document.querySelectorAll('.skills .servicesBx svg path'))
let counter = 0

function startAnimation(sY) {
  const path = pathes[counter]
  const yPath = path.getBoundingClientRect().y + pageYOffset
  if (sY + document.documentElement.clientHeight > yPath) {
    path.animate([
      {strokeDasharray: '0,251.2'},
      {strokeDasharray: dashKeys.shift()}
    ], {
      duration: 1000,
      iterations: 1
    })
    counter++
  }
}


