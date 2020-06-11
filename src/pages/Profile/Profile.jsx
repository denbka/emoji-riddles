import React, { useState, useEffect } from 'react'
import { signout } from '../../helpers'
import { Link, useParams } from 'react-router-dom'
import { RiddlesList, ProfileBar } from '../../components'
import { Button, Upload, Modal, message } from '../../ui'
import style from './profile.module.scss'
import stub from '../../assets/img/upload-stub.svg'
import { storage, firebase, firestore } from '../../services/firebase'
export const Profile = ({ user }) => {

    const { uid } = useParams()
    const [ isModal, setIsModal ] = useState(false)
    const [ riddles, setRiddles ] = useState([])
    const [ currentUser, setCurrentUser ] = useState(null)
    const [ myProfile, setMyProfile ] = useState(null)
    const [ isSubscribe, setIsSubscribe ] = useState(false)

    useEffect(() => {
        console.log(user);
        setMyProfile(user && user.uid === uid ? true : false)
        if (!myProfile) {
            getUser()
        } else if (user) {
            setCurrentUser(user)
        }
        getRiddles(uid)
    }, [ uid ])

    useEffect(() => {
        if (!currentUser) return
        checkSubscribe()
    }, [ currentUser ])

    const getUser = async () => {
        const response = await firestore.collection('users').doc(uid).get()
        setCurrentUser(response.data())
    }

    const checkSubscribe = () => {
        firestore.collection('followers').doc(currentUser.uid).onSnapshot(snap => {
            if (user && snap.data().users.some(item => item.uid === user.uid)) {
                setIsSubscribe(true)
            } else {
                setIsSubscribe(false)
            }
        })
    }

    const getRiddles = (id) => {
        firestore.collection('riddles').where('author', '==', id).onSnapshot(snap => {
            const newData = []
            snap.docs.map(item => {
                newData.push({key: item.id, ...item.data()})
            })
            setRiddles(newData)
        })
    }

    const handleChange = (event) => {
        const file = event.target.files[0]
        if (!event.target.files[0]) return
        const uploadTask = storage.ref().child(`avatars/${file.name}`).put(file)

        uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, () => {}, () => {}, () => {
            uploadTask.snapshot.ref.getDownloadURL().then(function(photoURL) {
                firestore.collection('users').doc(currentUser.uid).set({ ...currentUser, photoURL: photoURL })
            })
        })
    }

    const handleRemove = () => {
        firestore.collection('users').doc(currentUser.uid).set({ ...currentUser, photoURL: null })
        setIsModal(false)
    }

    const handleSubscribe = async () => {
        await pushItem('followers')
        await pushItem('following')
    }

    const unSubscribing = async () => {
        await removeItem('followers')
        await removeItem('following')
    }

    const removeItem = async (type) => {
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

    const pushItem = async (type) => {
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
        currentUser ? <div className={style.container}>
            <div></div>
            <div className={style.mainInfo}>
                <div className={style.avatar}>
                    {!currentUser.photoURL ? <Upload onChange={handleChange}>
                        <img src={stub} alt="заглушка"/>
                    </Upload>
                    : <div> 
                        <img className={style.notEmptyAvatar} src={currentUser.photoURL} alt="аватар" onClick={() => setIsModal(true)} />
                        {isModal && <Modal isProfile onClick={() => setIsModal(false)} handleChange={handleChange} handleRemove={handleRemove} bgOpacity="1" width="100%" height="50%">
                            <img src={currentUser.photoURL} alt="аватар" />
                        </Modal>}
                    </div>
                    }
                </div>
                <span className={style.displayName}>{currentUser.email}</span>
                {user && myProfile ? <Link to={`/users/${currentUser.uid}/edit`} className={style.buttonEdit}>Изменить</Link> : ''}
                {user && !myProfile && !isSubscribe ? <Button className={style.button} onClick={handleSubscribe}>Подписаться</Button> : ''}
                {user && !myProfile && isSubscribe ? <Button className={style.unSubscribing} onClick={unSubscribing}>Отписаться</Button> : ''}
                {!user && <button style={{opacity: 0, margin: '50px 0'}}></button>}
                {currentUser.stats && <ProfileBar {...currentUser} />}
            </div>
            <RiddlesList {...{ riddles, user, currentUser }} />

            <span onClick={() => signout()}>выйти</span>
        </div>
    : <div>loading</div>)
}
