import React from 'react'
import style from './footer.module.scss'
import { Link } from 'react-router-dom'
import stub from '../../assets/img/stub.svg'
import {
    ShareAltOutlined,
    QuestionOutlined
} from '@ant-design/icons'
export const Footer = ({ author }) => {
    console.log(author);
    return (
        <div className={style.container}>
            <Link to={`/users/${author.uid}`} className={style.info}>
                <img className={style.avatar} src={author.photoURL ? author.photoURL : stub} />
                {author.email}
            </Link>
            <div className={style.share}>
                {/* <QuestionOutlined />
                <ShareAltOutlined /> */}
            </div>
        </div>
    )
}
