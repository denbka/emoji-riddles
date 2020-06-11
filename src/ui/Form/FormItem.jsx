import React from 'react'
import style from './form.module.scss'

export default function FormItem({ label, children, formerrors = {}, errorPosition = 'bottom' }) {
    const stateChild = React.cloneElement(children, {})
    return (
        <div className={style.formGroup}>
            <div className={style.formGroupTitle}>
                {label && <label htmlFor={stateChild.props.name}>{label}</label>}
                <span className={`${style.errorMessage} ${errorPosition !== 'top' ? style.hidden : ''}`}>{formerrors[stateChild.props.name]}</span>
            </div>
            {stateChild}
            <span className={`${style.errorMessage} ${style.errorMessageBottom} ${errorPosition !== 'bottom' ? style.hidden : ''}`}>{formerrors[stateChild.props.name]}</span>
        </div>
    )
}
