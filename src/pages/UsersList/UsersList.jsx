import React, { useEffect, useState } from 'react'
import { useParams, useHistory, useLocation } from 'react-router-dom'
import { firestore } from '../../services/firebase'
import style from './usersList.module.sass'
import { EmptyStub } from '../../components'
import { Tabs, Button } from '../../ui'
import avatarStub from '../../assets/img/stub.svg'

export const UsersList = ({ user }) => {
    const { uid, type } = useParams()
    const [ data, setData ] = useState([])
    const [ currentTab, setCurrentTab ] = useState(type)
    const router = useHistory()
    const location = useLocation()
    const tabs = [
        { name: 'followers', label: 'Подписчики' },
        { name: 'following', label: 'Подписки' }
    ]

    useEffect(() => {
        setCurrentTab(type)
        getUsersList()
    }, [firestore, location])


    const getSubscriptions = async () => {
        if (!user) return []
        const response = await firestore.collection('following').doc(user.uid).get()
        return response.data().users
    }

    const getUsersList = async () => {
        const subscriptions = await getSubscriptions()
        firestore.collection(type).doc(uid).onSnapshot(snap => {
            const newData = []
            snap.data().users.map(item => {
                item.inSubscriptions = subscriptions.some(sub => sub.uid === item.uid)
                newData.push(item)
            })
            setData(newData)
        })
    }

    const tabChange = (event) => {
        router.push(`/users/${uid}/list/${event.target.getAttribute('name')}`)
    }

    const handleSubscribe = async (event, currentUser) => {
        event.stopPropagation()
        await pushItem('followers', currentUser)
        await pushItem('following', currentUser)
    }

    const unSubscribing = async (event, currentUser) => {
        event.stopPropagation()
        await removeItem('followers', currentUser)
        await removeItem('following', currentUser)
    }

    const removeItem = async (type, currentUser) => {
        const user1 = type === 'followers' ? currentUser : user
        const user2 = type === 'followers' ? user : currentUser
        firestore.collection('users').doc(user1.uid).set({
            ...user1,
            stats: {
                ...user1.stats,
                [type]: user1.stats[type]-1
            }
        })
        user1.stats[type] -= 1
        const response = await firestore.collection(type).doc(user1.uid).get()
        const data = response.data()
        data.users.splice(data.users.findIndex(item => item.uid === user2.uid), 1)
        firestore.collection(type).doc(user1.uid).set(data)
    }

    const pushItem = async (type, currentUser) => {
        const user1 = type === 'followers' ? currentUser : user
        const user2 = type === 'followers' ? user : currentUser
        firestore.collection('users').doc(user1.uid).set({
            ...user1,
            stats: {
                ...user1.stats,
                [type]: user1.stats[type]+1
            }
        })
        user1.stats[type] += 1
        const response = await firestore.collection(type).doc(user1.uid).get()
        const data = response.data()
        data.users.push(user2)
        firestore.collection(type).doc(user1.uid).set(data)
    }

    return (
        <div className={style.container}>
            <div className="header">

            </div>
            <Tabs currentTab={currentTab} tabs={tabs} onChange={tabChange} />
                {data.length ? data.map(item => <div onClick={() => router.push(`/users/${item.uid}`)} className={style.item}>
                    <div className={style.info}>
                        <img className={style.infoAvatar} src={item.photoURL ? item.photoURL : avatarStub} alt="аватар"/>
                        <div className={style.infoText}>
                            <span>{item.email}</span>
                            <span>{item.info.username ? item.info.username : ''}</span>
                        </div>
                    </div>
                    {user && item.uid !== user.uid ? <div className={style.buttons}>
                        {!item.inSubscriptions ? <Button className={`${style.button} ${style.buttonSubscribe}`} onClick={(event) => handleSubscribe(event, item)}>подписаться</Button>
                        : <Button className={`${style.button} ${style.buttonUnSubscribe}`} onClick={(event) => unSubscribing(event, item)}>отписаться</Button>}
                    </div> : ''}
                </div>)
            : <EmptyStub>Здесь пока совсем пусто...</EmptyStub>}
        </div>
    )
}
