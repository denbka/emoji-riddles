import React, { useState } from 'react'
import style from './footer.module.scss'
import { Link, useLocation } from 'react-router-dom'
import stub from '../../assets/img/stub.svg'

export const Footer = ({ author, riddleId }) => {

    return (
        <div className={style.container}>
            <Link to={`/users/${author.uid}`} className={style.info}>
                {/* У всех картинок должен быть alt. Можешь просто его пустым сделать */}
                {/* src лучше вынести в отдельную переменную */}
                <img className={style.avatar} src={author.photoURL ? author.photoURL : stub} />
                {author.email}
            </Link>
        </div>
    )
}
