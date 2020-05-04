import React from 'react'
import style from './button.module.scss'

export const Button= ({ onClick, children, className }) => {
    return (
        <button
        onClick={onClick}
        className={`${style.button} ${className}`}>
            {children}
        </button>
    )
}