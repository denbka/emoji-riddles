 
import React from 'react'
import style from './header.module.scss'
import { MenuOutlined, ArrowLeftOutlined } from '@ant-design/icons'
import { useHistory } from 'react-router-dom'
// Добавь prettier, чтобы код красиво форматировал. Если нужен конфиг, скину

export const Header = ({ isOpenMenu, toggleMenu, isVisible, title, backPath }) => {
    // backPath не юзается
    const router = useHistory()
    return (
        <div className={`${style.container} ${isOpenMenu && style.smallZIndex}`}>
            {isVisible ? <div className={style.content}>
                <span className={style.title}>{title}</span>
                <div>
                    <div className={style.rButton} onClick={() => toggleMenu()}>
                        <MenuOutlined />
                    </div>
                </div>
            </div>
            : <div className={style.content}>
                {/* Почему не классом? */}
                <ArrowLeftOutlined onClick={() => router.push('/')} style={{fontSize: '25px', marginTop: '25px', marginLeft: '15px', color: '#6C63FF', outline: '0'}} />
            </div>}
        </div>
    )
}