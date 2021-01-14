module.exports = function(body) {
    return `Новое сообщение с сайта
    от ${body.name || 'нет'};
    Компания: ${body.company};
    Mail: ${body.email};
    Телефон: ${body.phone || 'не указан'};
    Текст: ${body.message || 'нет'}
    `
}
