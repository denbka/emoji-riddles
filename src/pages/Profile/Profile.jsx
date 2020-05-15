import React, { useState, useEffect } from 'react'
import { signout } from '../../helpers'
import { Link } from 'react-router-dom'
import { RiddlesList } from '../../components'
import { Button, Upload, Modal, message } from '../../ui'
import style from './profile.module.scss'
import stub from '../../assets/img/upload-stub.svg'
import { storage, firebase, firestore } from '../../services/firebase'
export const Profile = ({ user }) => {
    const [ isModal, setIsModal ] = useState(false)
    const [ riddles, setRiddles ] = useState([])

    useEffect(() => {
        firestore.collection('riddles').where('author', '==', user.uid).onSnapshot(snap => {
            const newData = []
            snap.docs.map(item => {
                newData.push(item.data())
            })
            setRiddles(newData)
        })
    }, [])

    const handleChange = (event) => {
        const file = event.target.files[0]
        if (!event.target.files[0]) return
        const uploadTask = storage.ref().child(`avatars/${file.name}`).put(file)

        uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, () => {}, () => {}, () => {
            uploadTask.snapshot.ref.getDownloadURL().then(function(photoURL) {
                firestore.collection('users').doc(user.uid).set({ ...user, photoURL: photoURL })
            })
        })
    }

    const handleRemove = () => {
        firestore.collection('users').doc(user.uid).set({ ...user, photoURL: null })
        setIsModal(false)
    }

    const handleClick = () => {
        // console.log(notification, 123);
        // notification.notice({
        //     content: 'content',
        //     closable: true,
        //       duration: 2,
        //   })
    }

    return (
        <div className={style.container}>
            <div></div>
            <div className={style.mainInfo}>
                <div className={style.avatar}>
                    {!user.photoURL ? <Upload onChange={handleChange}>
                        <img src={stub} alt="заглушка"/>
                    </Upload>
                    : <div> 
                        <img className={style.notEmptyAvatar} src={user.photoURL} alt="аватар" onClick={() => setIsModal(true)} />
                        {isModal && <Modal isProfile onClick={() => setIsModal(false)} handleChange={handleChange} handleRemove={handleRemove} bgOpacity="1" width="100%" height="50%">
                            <img src={user.photoURL} alt="аватар" />
                        </Modal>}
                    </div>
                    }
                </div>
                <span className={style.displayName}>{user.email}</span>
                <Link to={`/users/${user.uid}/edit`} className={style.button}>Изменить</Link>
                {user.stats && <div className={style.infobar}>
                    <div className={style.infobarItem}>
                        <span className={style.infobarItemCount}>{user.stats.followers}</span>
                        <span className={style.infobarItemLabel}>Подписчики</span>
                    </div>
                    <div className={style.infobarItem}>
                        <span className={style.infobarItemCount}>{user.stats.following}</span>
                        <span className={style.infobarItemLabel}>Подписки</span>
                    </div>
                    <div className={style.infobarItem}>
                        <span className={style.infobarItemCount}>{user.stats.likes}</span>
                        <span className={style.infobarItemLabel}>Лайки</span>
                    </div>
                </div>}
            </div>
            <RiddlesList riddles={riddles} />

            {/* <span onClick={() => signout()}>выйти</span> */}
        </div>
    )
}
