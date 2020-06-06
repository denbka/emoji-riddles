import React from 'react'
import style from './form.module.scss'

export default function FormItem({ label, children }) {
    return (
        <div className={style.formGroup}>
            <div className={style.formGroupTitle}>
                {label && <label htmlFor={children.props.name}>{label}</label>}
                <span className={style.errorMessage}>неправильно набран номер</span>
            </div>
            {children}
        </div>
    )
}
