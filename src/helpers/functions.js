export const getRandomNumber = (max) => {
    return Math.floor(Math.random() * Math.floor(max))
}

export const onlyWords = (str) => {
    return str.replace(/[^a-zA-ZА-Яа-яЁё]/gi,'').replace(/\s+/gi,', ')
}

export const getTitle = (route, params) => {
    console.log(params);
    if (route.includes('/riddles/')) return 'Создание загадки'
    if (route.includes('/profile/edit')) return 'Редактирование профиля'
    if (route.includes('/profile')) return 'Мой профиль'
    if (route.includes('/')) return 'Главная'

}