// Название файла оч странное. Тут может быть все что угодно. Лучше под каждый такой хелпер отдельный файл тогда делать
export const getRandomNumber = (max) => {
    return Math.floor(Math.random() * Math.floor(max))
}

export const onlyWords = (str) => {
    return str.replace(/[^a-zA-ZА-Яа-яЁё]/gi,'').replace(/\s+/gi,', ')
}

export const parseUrlQueries = (str) => {
    return 
}

export const getTitle = (route, params) => {
    if (route.includes('/riddles/')) return 'Создание загадки'
    if (route.includes('/profile/edit')) return 'Редактирование профиля'
    if (route.includes('/users')) return 'Мой профиль'
    if (route.includes('/')) return 'Главная'

}