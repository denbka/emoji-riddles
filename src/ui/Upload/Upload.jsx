import React from 'react'
import style from './upload.module.scss'
export const Upload = (props) => {

    return (
        <div className={`${style.container} ${props.className}`} id="cont">
            <input onChange={props.onChange} type="file" name="file" id="file" className={style.nativeInput} />
            <div className={style.labelContainer}>
                <label className={style.label} htmlFor="file">
                    {props.children}
                </label>
            </div>
        </div>
    )
}
