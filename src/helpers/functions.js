// Название файла оч странное. Тут может быть все что угодно. Лучше под каждый такой хелпер отдельный файл тогда делать
export const getRandomNumber = (max) => {
    return Math.floor(Math.random() * Math.floor(max))
}

export const onlyWords = (str) => {
    return str.replace(/[^a-zA-ZА-Яа-яЁё]/gi,'').replace(/\s+/gi,', ')
}

export const parseUrlQueries = (str) => {
    if (str.includes('?')) return str.split('?')[1].split('&').map(item => {return { name: item.split('=')[0], value: item.split('=')[1] }})
}

export const getTitle = (route, params) => {
    if (route.includes('/riddles/')) return 'Создание загадки'
    if (route.includes('/profile/edit')) return 'Редактирование профиля'
    if (route.includes('/users')) return 'Мой профиль'
    if (route.includes('/')) return 'Главная'

}