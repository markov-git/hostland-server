const $modal = document.querySelector('.modal')
const $input = $modal.querySelector('#password')
const $err = $modal.querySelector('.modal__auth-form p')
const $btn = $modal.querySelector('.modal__auth-form .btn')

document
  .querySelector('#login')
  .addEventListener('click', e => {
    e.preventDefault()
    toggleMenu()
    $modal.style.display = 'block'
  })

$modal
  .querySelector('.modal__backBlur')
  .addEventListener('click', () => {
    $modal.style.display = 'none'
    $err.innerHTML = ''
    $input.classList.remove('_error')
  })

// maybe will be better e.target.value
$input.addEventListener('input', () => {
  $btn.disabled = $input.value.length < 4
})

$modal
  .querySelector('form')
  .addEventListener('submit', async e => {
    e.preventDefault()

    try {
      const res = await fetch('/auth', {
        method: 'POST',
        'Content-Type': 'Application/json',
        body: JSON.stringify({
          password: $input.value
        })
      })
      if(res.ok) {
        const data = await res.json()
        window.location.href = data
      } else {
        throw new Error(res.statusText)
      }
    } catch (e) {
      if (e) {
        $err.innerHTML = e
        $input.classList.add('_error')
        console.warn(e)
      }
    }
    $input.value = ''
  })
