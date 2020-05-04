import React from 'react'
import style from './form.module.scss'

export default function FormItem({ label, children }) {
    return (
        <div className={style.formGroup}>
            {label && <label htmlFor={children.props.name}>{label}</label>}
            {children}
        </div>
    )
}
