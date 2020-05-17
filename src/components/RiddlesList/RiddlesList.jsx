import React from 'react'
import style from './riddlesList.module.scss'
import { RightOutlined, LoadingOutlined } from '@ant-design/icons'

export const RiddlesList = ({ riddles }) => {
    return riddles.length ? <div className={style.container}>
            {riddles.map(item => <div className={style.item}>
                <span>{item.title}</span>
                <span><RightOutlined /></span>
            </div>)}
        </div>
        // Почему тут тоже класс не прокинуть?
        : <LoadingOutlined  className={style.container} style={{minHeight: '200px', fontSize: '36px'}} />
}
