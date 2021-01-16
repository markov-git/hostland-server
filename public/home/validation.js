const form = document.querySelector('#form')
const _sending = contact.querySelector('._sending')
const loader = _sending.querySelector('.loader')
const ok = _sending.querySelector('.ok')
const wrong = _sending.querySelector('.wrong')
const errorMessage = wrong.querySelector('#errorMessage')
form.addEventListener('submit', async (e) => {
  e.preventDefault()
  let error = formValidate(form)

  _sending.style.visibility = 'visible'
  loader.style.visibility = 'visible'
  loader.style.display = 'inline-block'
  if (error === 0 && getLocalStorage() < 3) {
    try {
      await sendForm(form)
    } catch (e) {
      console.error(e)
    }
  } else if (error !== 0) {
    wrongHTML(dictionary.errorValid[document.documentElement.lang])
  } else if (getLocalStorage() >= 3) {
    wrongHTML(dictionary.errorMany[document.documentElement.lang])
  }
})
async function sendForm(form) {
  const data = {
    name: form.elements.firstName.value,
    company: form.elements.company.value,
    email: form.elements.email.value,
    phone: form.elements.phone.value,
    message: form.elements.message.value
  }
  const res = await fetch('/telegram/sendFromSite', {
    method: 'post',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(data)
  })
  if (res.ok) {
    okHTML()
    saveLocalStorage()
    form.reset()
  } else {
    wrongHTML('Error sending to server')
  }
}

function wrongHTML(message) {
  errorMessage.innerHTML = message
  loader.style.visibility = 'hidden'
  loader.style.display = 'none'
  wrong.style.visibility = 'visible'
  wrong.querySelector('svg').style.display = 'block'

  setTimeout(() => {
    _sending.style.visibility = 'hidden'
    loader.style.display = 'none'
    wrong.style.visibility = 'hidden'
    wrong.querySelector('svg').style.display = 'none'
  }, 2000)
}

function okHTML() {
  loader.style.visibility = 'hidden'
  loader.style.display = 'none'
  ok.style.visibility = 'visible'
  ok.querySelector('svg').style.display = 'block'

  setTimeout(() => {
    _sending.style.visibility = 'hidden'
    loader.style.display = 'none'
    ok.style.visibility = 'hidden'
    ok.querySelector('svg').style.display = 'none'
  }, 2000)
}

function getLocalStorage() {
  const storage = JSON.parse(localStorage.getItem('metaMessage'))
  return storage?.exp < new Date().getTime() ? 0 : storage.num
}

function saveLocalStorage() {
  const store = JSON.parse(localStorage.getItem('metaMessage')) ||
    {exp: new Date().getTime() + 1000 * 60 * 60 * 24, num: 0}
  const meta = {}
  if (store.exp > new Date().getTime()) {
    if (store.num + 1 < 4) {
      meta.num = store.num + 1
      meta.exp = store.exp
      localStorage.setItem('metaMessage', JSON.stringify(meta))
    }
  } else {
    meta.exp = store.exp
    meta.num = 0
    localStorage.setItem('metaMessage', JSON.stringify(meta))
  }
}

function formValidate(form) {
  let error = 0
  let formReq = form.querySelectorAll('._req')
  for (const node of formReq) {
    node.classList.remove('_error')

    if (node.classList.contains('_email')) {
      if (!emailTest(node)) {
        node.classList.add('_error')
        error++
      }
    } else {
      if (node.value.trim() === '') {
        node.classList.add('_error')
        error++
      }
    }
  }
  return error

  function emailTest(node) {
    return /\S+@\S+\.\S+/.test(node.value.trim())
  }
}
