import React from 'react'
import style from './button.module.scss'
import { LoadingOutlined } from '@ant-design/icons'

export const Button= ({ onClick, children, className, disabled }) => {
    const handleClick = event => {
        event.preventDefault()
        onClick(event)
    }

    return (
        <button
        disabled={disabled ? 'disabled' : null}
        onClick={handleClick}
        className={`${style.button} ${className && className} ${disabled ? style.disabled : ''}`}>
            {disabled ? <LoadingOutlined style={{fontSize: '20px'}} />
            : children}
        </button>
    )
}