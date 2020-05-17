import React from 'react'
import style from './emptyStub.module.sass'
import Empty from '../../assets/img/empty.svg'

export const EmptyStub = (props) => {
    return (
        <div className={style.emptyContainer}>
            <div className={style.titleEmptyContainer}>{props.children}</div>
            <img src={Empty} alt="Пустота..."/>
        </div>
    )
}
