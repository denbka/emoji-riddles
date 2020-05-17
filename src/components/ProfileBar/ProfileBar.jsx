import React from 'react'
import style from './profileBar.module.scss'
import { Link } from 'react-router-dom'

export const ProfileBar = (currentUser) => {
    return (
        <div className={style.infobar}>
            <Link to={`/users/${currentUser.uid}/followers`}>
                <div className={style.infobarItem}>
                    <span className={style.infobarItemCount}>{currentUser.stats.followers}</span>
                    <span className={style.infobarItemLabel}>Подписчики</span>
                </div>
            </Link>
            <Link to={`/users/${currentUser.uid}/following`}>
                <div className={style.infobarItem}>
                    <span className={style.infobarItemCount}>{currentUser.stats.following}</span>
                    <span className={style.infobarItemLabel}>Подписки</span>
                </div>
            </Link>
            <div className={style.infobarItem}>
                <span className={style.infobarItemCount}>{currentUser.stats.likes}</span>
                <span className={style.infobarItemLabel}>Лайки</span>
            </div>
        </div>
    )
}
