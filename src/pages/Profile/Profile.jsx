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
        if (uid) {
            setMyProfile(user.uid === uid)
            if (!myProfile) {
                getUser()
                checkSubscribe()
            } else {
                setCurrentUser(user)
            }
            getRiddles(uid)
        }
    }, [uid])

    const getUser = async () => {
        const response = await firestore.collection('users').doc(uid).get()
        setCurrentUser(response.data())
    }

    const checkSubscribe = () => {
        firestore.collection('following').where('users', 'array-contains', user.uid).onSnapshot(snap => {
            if (!snap.docs.length) {
                setIsSubscribe(false)
                return
            }
            const mySubs = snap.docs[0].data()
            if (mySubs && mySubs.users.includes(user.uid)) {
                setIsSubscribe(true)
            } else setIsSubscribe(false)
        })
    }

    const getRiddles = (id) => {
        firestore.collection('riddles').where('author', '==', id).onSnapshot(snap => {
            const newData = []
            snap.docs.map(item => {
                newData.push(item.data())
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
        await pushItem('followers', currentUser)
        await pushItem('following', user)
    }

    const unSubscribing = async () => {
        await removeItem('followers', currentUser)
        await removeItem('following', user)
    }

    const removeItem = async (type, user) => {
        firestore.collection('users').doc(user.uid).set({
            ...user,
            stats: {
                ...user.stats,
                [type]: user.stats[type]-1
            }
        })
        user.stats[type] -= 1
        const response = await firestore.collection(type).doc(user.uid).get()
        const data = response.data()
        data.users.splice(data.users.findIndex(item => item === user.uid), 1)
        firestore.collection(type).doc(user.uid).set(data)
    }

    const pushItem = async (type, user) => {
        firestore.collection('users').doc(user.uid).set({
            ...user,
            stats: {
                ...user.stats,
                [type]: user.stats[type]+1
            }
        })
        user.stats[type] += 1
        const response = await firestore.collection(type).doc(user.uid).get()
        const data = response.data()
        data.users.push(user.uid)
        firestore.collection(type).doc(user.uid).set(data)
    }

    return (currentUser &&
        <div className={style.container}>
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
                {myProfile && <Link to={`/users/${currentUser.uid}/edit`} className={style.buttonEdit}>Изменить</Link>}
                {!myProfile && !isSubscribe && <Button className={style.button} onClick={handleSubscribe}>Подписаться</Button>}
                {!myProfile && isSubscribe && <Button className={style.unSubscribing} onClick={unSubscribing}>Отписаться</Button>}
                {currentUser.stats && <ProfileBar {...currentUser} />}
            </div>
            <RiddlesList riddles={riddles} />

            {/* <span onClick={() => signout()}>выйти</span> */}
        </div>
    )
}
