import React, { useState, useEffect } from 'react'
import { signout } from '../../helpers'
import { Link, useParams } from 'react-router-dom'
import { RiddlesList, ProfileBar } from '../../components'
import { Button, Upload, Modal, message } from '../../ui'
import style from './profile.module.scss'
import activeStub from '../../assets/img/upload-stub.svg'
import disableStub from '../../assets/img/stub.svg'
import vkIcon from '../../assets/img/vk-icon.svg'
import instIcon from '../../assets/img/instagram-icon.svg'
import { storage, firebase, firestore } from '../../services/firebase'
export const Profile = ({ user }) => {

    const { uid } = useParams()
    const [ isModal, setIsModal ] = useState(false)
    const [ riddles, setRiddles ] = useState([])
    const [ currentUser, setCurrentUser ] = useState(null)
    const [ myProfile, setMyProfile ] = useState(null)
    const [ isSubscribe, setIsSubscribe ] = useState(false)
    const [ social, setSocial ] = useState({})

    useEffect(() => {
        console.log(user);
        setMyProfile(user && user.uid === uid ? true : false)
        if (!myProfile) {
            getUser()
        } else if (user) {
            setCurrentUser(user)
            setSocial(user.info.social)
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
        setSocial(response.data().info.social)
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
            uploadTask.snapshot.ref.getDownloadURL().then(async photoURL => {
                const newUserData = { ...currentUser, photoURL: photoURL }
                setCurrentUser(newUserData)
                await firestore.collection('users').doc(currentUser.uid).set(newUserData)
            })
        })
    }

    const handleRemove = () => {
        const newUserData = { ...currentUser, photoURL: null }
        setCurrentUser(newUserData)
        firestore.collection('users').doc(currentUser.uid).set(newUserData)
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

    const handleSocialClick = (event, type) => {
        window.location.reload(type)
    }

    return (
        currentUser ? <div className={style.container}>
            <div></div>
            <div className={style.mainInfo}>
                <div className={style.avatar}>
                    {!currentUser.photoURL && myProfile ? <Upload onChange={handleChange}>
                        <img src={activeStub} alt="заглушка"/>
                    </Upload> : ''}
                    {!currentUser.photoURL && !myProfile ? <img src={disableStub} alt="заглушка"/> : ''}
                    {currentUser.photoURL && <div> 
                        <img className={style.notEmptyAvatar} src={currentUser.photoURL} alt="аватар" onClick={() => setIsModal(true)} />
                        {isModal && <Modal {...{myProfile}} onClick={() => setIsModal(false)} handleChange={handleChange} handleRemove={handleRemove} bgOpacity="1" width="100%" height="50%">
                            <img src={currentUser.photoURL} alt="аватар" />
                        </Modal>}
                    </div>
                    }
                </div>
                <span className={style.displayName}>{currentUser.email}</span>
                <div className={style.middleBlock}>
                    {user && myProfile ? <Link to={`/users/${currentUser.uid}/edit`} className={style.buttonEdit}>Изменить</Link> : ''}
                    {user && !myProfile && !isSubscribe ? <Button className={style.button} onClick={handleSubscribe}>Подписаться</Button> : ''}
                    {user && !myProfile && isSubscribe ? <Button className={style.unSubscribing} onClick={unSubscribing}>Отписаться</Button> : ''}
                    {!user && <button style={{opacity: 0, margin: '50px 0'}}></button>}
                    <div className={style.links}>
                        {social.vk && <img onClick={event => handleSocialClick(event, social.vk)} src={vkIcon} alt="vk-link"/>}
                        {social.instagram && <img onClick={event => handleSocialClick(event, social.instagram)} src={instIcon} alt="inst-link"/>}
                    </div>
                </div>
                {currentUser.stats && <ProfileBar {...currentUser} />}
            </div>
            <RiddlesList {...{ riddles, user, currentUser }} />

            {/* <span onClick={() => signout()}>выйти</span> */}
        </div>
    : <div>loading</div>)
}
