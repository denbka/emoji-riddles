import React from 'react'
import style from './riddlesList.module.scss'
import { RightOutlined, LoadingOutlined } from '@ant-design/icons'

export const RiddlesList = ({ riddles }) => {
    return (
        riddles.length ? <div class={style.container}>
            {riddles.map(item => <div class={style.item}>
                <span>{item.title}</span>
                <span><RightOutlined /></span>
            </div>)}
        </div>
        : <LoadingOutlined  class={style.container} style={{minHeight: '200px'}} />
    )
}
