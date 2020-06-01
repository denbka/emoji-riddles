import React, { useEffect, useState } from 'react'
import style from './riddlesList.module.scss'
import { RightOutlined, LoadingOutlined, LockOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
export const RiddlesList = ({ riddles, user, currentUser }) => {
    const [ data, setData ] = useState([])
    useEffect(() => {
        const temp = riddles.map(riddle => {
            riddle.isLock = user && user.checkedRiddles.includes(riddle.key)
            return riddle
        })
        setData(temp)
    }, [riddles])
    return (
        data ? <div className={style.container}>
            {data.map(item => <Link key={item.key} to={!item.isLock ? `/?riddleId=${item.key}` : `/users/${currentUser.uid}`} className={style.item}>
                <span>{item.title}</span>
                {!item.isLock ? <span><RightOutlined /></span>
                : <span><LockOutlined /></span>}
            </Link>)}
        </div>
        // Почему тут тоже класс не прокинуть?
        : <div><LoadingOutlined  className={style.container} style={{minHeight: '200px', fontSize: '36px'}} /></div>
    )
}
