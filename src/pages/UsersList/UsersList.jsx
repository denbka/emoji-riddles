import React, { useEffect, useState } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { firestore } from '../../services/firebase'
import style from './usersList.module.scss'
import { EmptyStub } from '../../components'
import { Tabs } from '../../ui'

export const UsersList = () => {
    const { uid, type } = useParams()
    const [ data, setData ] = useState([])
    const [ currentTab, setCurrentTab ] = useState(type)
    const router = useHistory()
    const tabs = [
        { name: 'followers', label: 'Подписчики' },
        { name: 'following', label: 'Подписки' }
    ]
    useEffect(() => {
        getUsersList()
    }, [firestore, router])

    const getUsersList = () => {
        console.log(type, uid);
        firestore.collection(type).doc(uid).onSnapshot(snap => {
            console.log(snap);
            if (snap.docs && snap.docs.length) {
                const newData = []
                snap.docs.map(item => {
                    newData.push(item.data())
                })
                setData(newData)
            }
        })
    }

    const tabChange = (event) => {
        console.log(event.target.getAttribute('name'))
        setCurrentTab(event.target.getAttribute('name'))
        router.push(`/users/${uid}/list/${currentTab}`)
    }

    return <div className={style.container}>
            <div className="header">

            </div>
            <Tabs currentTab={currentTab} tabs={tabs} onChange={tabChange} />
             {data.length ? data.map(user => (
                <div className={style.item}>
                    {user.email}
                </div>
            ))
            : <EmptyStub>Здесь пока совсем пусто...</EmptyStub>}
        </div>
}
