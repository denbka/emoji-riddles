import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { CloseOutlined } from '@ant-design/icons'
import style from './drawer.module.scss'

export const Drawer = ({ toggleMenu, isOpenMenu, list }) => {

    const history = useHistory()

    return (
        <div className={isOpenMenu ? `${style.drawer} ${style['drawer-open']}` : `${style.drawer}`}>
            <div className={style.header}>
                <span className={style.title}>Меню</span>
                <CloseOutlined onClick={() => toggleMenu()} className={style.icon} name='close' />
            </div>
            <ul className={style['drawer__list']}>
                {list.map(item => (
                    <li
                    onClick={() => { history.push(item.path); toggleMenu() }}
                    className={style['drawer__list__item']}
                    key={item.path}>
                        {item.name}
                    </li>
                ))}
            </ul>
        </div>
    )
}