import React from 'react'
import style from './modal.module.scss'
import { Upload } from '../Upload'
import { UploadOutlined, DeleteOutlined } from '@ant-design/icons'
export const Modal = ({ children, bgOpacity, onClick, onChange, handleRemove, handleChange, myProfile, width, height }) => {
    return (
    <div className={style.overlay} style={{background: `rgba(0, 0, 0, ${bgOpacity})`}}>
            <div className={style.container} onClick={onClick} style={{width, height}}>
                {children}
            </div>
            {myProfile && <div className={style.upload}>
                <Upload onChange={handleChange}>
                    <span className={style.overlayButton}>
                        Изменить <UploadOutlined />
                    </span>
                </Upload>
                <button className={style.remove} onClick={handleRemove}><DeleteOutlined /></button>
            </div>}
        </div>
    )
}
