import React from 'react'
import style from './input.module.scss'
export const Input = (props) => {
    return <input {...props} className={style.rInput} />
}
