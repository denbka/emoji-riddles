import React from 'react'
import { signout } from '../../helpers'
import { Button } from '../../ui'
import style from './profile.module.scss'
import avatar from '../../assets/img/avatar.svg'


export const Profile = ({ user }) => {
    return (
        <div className={style.container}>
            <div></div>
            <div className={style.mainInfo}>
                <div className={style.avatar}>
                    <img src={avatar} alt="аватар"/>
                </div>
                <span className={style.displayName}>{user.email}</span>
                <Button className={style.button}>Изменить</Button>
                <div className={style.infobar}>
                    <div className={style.infobarItem}>
                        <span className={style.infobarItemCount}>{user.stats.followers}</span>
                        <span className={style.infobarItemLabel}>Подписчики</span>
                    </div>
                    <div className={style.infobarItem}>
                        <span className={style.infobarItemCount}>{user.stats.following}</span>
                        <span className={style.infobarItemLabel}>Подписки</span>
                    </div>
                    <div className={style.infobarItem}>
                        <span className={style.infobarItemCount}>{100}%</span>
                        <span className={style.infobarItemLabel}>Рейтинг</span>
                    </div>
                </div>
            </div>
            <Button className={style.allRiddles}>Показать загадки</Button>
            {/* <span onClick={() => signout()}>выйти</span> */}
        </div>
    )
}
