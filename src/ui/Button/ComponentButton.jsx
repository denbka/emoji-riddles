import React from 'react'
import style from './button.module.scss'

export const Button= ({ onClick, children, className, disabled }) => {
    return (
        <button
        disabled={disabled ? 'disabled' : null}
        onClick={onClick}
        className={`${style.button} ${className && className} ${disabled && style.disabled}`}>
            {children}
        </button>
    )
}