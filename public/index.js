const toggle = document.querySelector('.toggle')
const sidebar = document.querySelector('.sidebar')
const about = document.querySelector('.about')
const contact = document.querySelector('.contact')
const links = document.querySelectorAll('#toggleLink')

function toggleMenu() {
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

const language = document.querySelector('.language')
let $toTranslate

const dictionary = {
    language: {
        ru: 'рус', en: 'en'
    },
    home: {
        ru: 'главная', en: 'home'
    },
    about: {
        ru: 'Обо Мне', en: 'about'
    },
    skills: {
        ru: 'навыки', en: 'skills'
    },
    work: {
        ru: 'проекты', en: 'work'
    },
    contact: {
        ru: 'Связь', en: 'contact'
    },
    aboutMe: {
        ru: 'Обо Мне', en: 'About Me'
    },
    portfolio: {
        ru: '_Резюме', en: 'My_Portfolio'
    },
    hello: {
        ru: '<span >Привет,</span> меня зовут',
        en: '<span >Hello</span> I\'m'
    },
    name: {
        ru: 'Марков Артем', en: 'Artem Markov'
    },
    dev: {
        ru: 'Я Frontend Разработчик', en: 'I\'m a Frontend Web Developer.'
    },
    aboutMeText: {
        ru: `<p>Привет!<br><br>Меня зовут Артем, мне 25 и я ищу работу Frontend
                разработчиком.</p>
            <p>По основной специальности я строитель / проектировщик уникальных зданий и сооружений (дорог высоких категорий, аэродромов, мостов, тоннелей).</p>
            <p>Параллельно с основным обучением, я отучился и получил диплом переводчика. Но в связи с тем что последнее время я очень мало практиковался мой разговорный английский ужасен.</p>
            <p>В начале 2020, я понял, что хочу начать программировать, и начал изучать C++. Но через несколько месяцев изучения языка, я понял, что это не мое. И я решил попробовать веб разработку.</p>
            <p>Прошло пол года, как я изучаю Frontend и Backend, и я точно могу сказать: Мне это нравится!</p>`,
        en: `<p>Hello!<br><br>My name is Artem, I am 25 years old and now looking for a job as a Junior Frontend
                Web Developer.</p>
            <p>By my main specialty I am a designer / builder of unique buildings and structures (such as high-category
                roads, airfields, bridges, tunnels).</p>
            <p>In addition, in my free time, I went to English courses. Now I have a translator's diploma. But due to the fact that I have practiced very little lately, my spoken English is terrible</p>
            <p>At the beginning of 2020, I realized that I wanted to program and started learning C++, but after a few
                months I realized that it was not mine. I decided to study web development.</p>
            <p>I have been studying web development for more than half a year and now I can say with confidence - I like
                it!</p>`
    },
    mySkills: {
        ru: 'Навыки и Умения', en: 'My Skills'
    },
    skillsDesc: {
        ru: 'Если немного обобщить, вот что я умею', en: 'To summarize a little, this is what I know'
    },
    myWorks: {
        ru: 'Мои проекты', en: 'Recent Works'
    },
    tictac: {
        ru: 'Крестики-нолики', en: 'Tic Tac Toe'
    },
    tictacDesc: {
        ru: 'Алгоритм Минимакс<br><br>База данных MongoDB', en: 'Minimax algorithm<br>Mongodb'
    },
    contactMe: {
        ru: 'Форма обратной связи', en: 'Contact Me'
    },
    inpFN: {
        ru: `<input type="text" name="firstName" placeholder="Имя">`,
        en: `<input type="text" name="firstName" placeholder="First Name">`
    },
    inpLN: {
        ru: `<input type="text" name="lastName" placeholder="Фамилия">`,
        en: `<input type="text" name="lastName" placeholder="Last Name">`
    },
    phone: {
        ru: `<input type="text" name="phone" placeholder="Номер телефона">`,
        en: `<input type="text" name="phone" placeholder="Номер телефона">`
    },
    message: {
        ru: `<textarea placeholder="Текст"></textarea>`,
        en: `<textarea placeholder="Message"></textarea>`
    },
    btnMessage: {
        ru: `<input type="submit" value="Отправить">`,
        en: `<input type="submit" value="Send">`
    },
}
if (localStorage.getItem('language') === 'ru') {
    setLanguage('ru')
}

language.addEventListener('click', () => {
    toggleMetaLanguage()
    if (document.documentElement.lang === 'en') {
        setLanguage('en')
    } else {
        setLanguage('ru')
    }
})

function setLanguage(lang) {
    if (!$toTranslate) $toTranslate = document.querySelectorAll('[data-language]')
    for (const node of $toTranslate) {
        node.innerHTML = dictionary[node.dataset.language][lang]
    }
}

function toggleMetaLanguage() {
    if (document.documentElement.lang === 'en') {
        document.documentElement.lang = 'ru'
    } else {
        document.documentElement.lang = 'en'
    }
    localStorage.setItem('language', document.documentElement.lang);
}

