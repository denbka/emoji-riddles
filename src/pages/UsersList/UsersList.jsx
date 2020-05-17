import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { firestore } from '../../services/firebase'
import style from './usersList.module.scss'
import { EmptyStub } from '../../components'

export const UsersList = () => {

    const { uid, type } = useParams()
    const [ data, setData ] = useState([])
    useEffect(() => {
        getUsersList()
    }, [firestore])

    const getUsersList = () => {
        firestore.collection(type).doc(uid).onSnapshot(snap => {
            if (snap.docs && snap.docs.length) {
                const newData = []
                snap.docs.map(item => {
                    newData.push(item.data())
                })
                setData(newData)
            }
        })
    }

    return data.length ?
        <div className={style.container}>
            {data.map(user => (
                <div className={style.item}>
                    {user.email}
                </div>
            ))}
        </div>
    : <EmptyStub>Здесь пока совсем пусто...</EmptyStub>
}
