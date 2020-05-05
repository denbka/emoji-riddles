import React from 'react'
import style from './modal.module.scss'
import { Upload } from '../Upload'
import { UploadOutlined, DeleteOutlined } from '@ant-design/icons'
export const Modal = (props) => {
    return (
        <div className={style.overlay}>
            <div className={style.container} onClick={props.onClick}>
                {props.children}
            </div>
            <div className={style.upload}>
                <Upload onChange={props.handleChange}>
                    <span className={style.overlayButton}>
                        Изменить <UploadOutlined />
                    </span>
                </Upload>
                <button className={style.remove} onClick={props.handleRemove}><DeleteOutlined /></button>
            </div>
        </div>
    )
}
