import React, { useState } from 'react'
import { signout } from '../../helpers'
import { Link } from 'react-router-dom'
import { Button, Upload, Modal } from '../../ui'
import style from './profile.module.scss'
import stub from '../../assets/img/avatar.svg'
import { storage, firebase, firestore } from '../../services/firebase'


export const Profile = ({ user }) => {

    const [ isModal, setIsModal ] = useState(false)

    const handleChange = (event) => {
        const file = event.target.files[0]
        if (!event.target.files[0]) return
        const uploadTask = storage.ref().child(`avatars/${file.name}`).put(file)

        uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, () => {}, () => {}, () => {
            uploadTask.snapshot.ref.getDownloadURL().then(function(photoURL) {
                firestore.collection('users').doc(user.email).set({ ...user, photoURL: photoURL })
            })
        })
    }

    const handleRemove = () => {
        firestore.collection('users').doc(user.email).set({ ...user, photoURL: null })
        setIsModal(false)
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
                        {isModal && <Modal onClick={() => setIsModal(false)} handleChange={handleChange} handleRemove={handleRemove}>
                            <img src={user.photoURL} alt="аватар" />
                        </Modal>}
                    </div>
                    }
                </div>
                <span className={style.displayName}>{user.email}</span>
                <Link to="/profile/edit" className={style.button}>Изменить</Link>
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
                        <span className={style.infobarItemCount}>{100}%</span>
                        <span className={style.infobarItemLabel}>Рейтинг</span>
                    </div>
                </div>}
            </div>
            <Button className={style.allRiddles}>Показать загадки</Button>
            {/* <span onClick={() => signout()}>выйти</span> */}
        </div>
    )
}
