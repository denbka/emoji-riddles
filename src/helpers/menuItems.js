export const loginRoutes = [
    { name: 'Войти в систему', path: '/login' },
    { name: 'Зарегистрироваться', path: '/register' }
  ]

export const mainRoutes = [
    { name: 'Главная', path: '/' }
]

export const privateRoutes = [
    ...mainRoutes,
    { name: 'Профиль', path: '/profile' },
    { name: 'Создать загадку', path: '/riddles/create' },
]

export const publicRoutes = [
    ...mainRoutes,
    ...loginRoutes
]

export const moderationRoutes = [
    ...privateRoutes,
    { name: 'Список загадок', path: '/riddles' },
    { name: 'Непроверенные загадки', path: '/checkout' }
]

export const adminRoutes = [
    ...moderationRoutes,
    { name: 'Статистика', path: '/statistics' }
]