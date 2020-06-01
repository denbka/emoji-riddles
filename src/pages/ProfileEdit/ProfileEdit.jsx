import React, { useEffect, useState } from 'react'
import style from './profileEdit.module.scss'
import { Button } from '../../ui'
import { firestore } from '../../services/firebase'
export const ProfileEdit = ({ user }) => {

    const [ formData, setFormData ] = useState(null)
    const [ info, setInfo ] = useState(null)
    const [ social, setSocial ] = useState(null)
    useEffect(() => {
        setFormData(user)
        setSocial(user.info.social)
        setInfo(user.info)
    }, [user])

    const handleChange = (event) => {
        const { name, value } = event.target
        setFormData({
            ...formData,
            [name]: value
        })
    }

    const handleInfo = (event) => {
        const { name, value } = event.target
        setInfo({
            ...info,
            [name]: value
        })
    }

    const handleSocial = (event) => {
        const { name, value } = event.target
        setSocial({
            ...social,
            [name]: value
        })
    }

    const handleSubmit = () => {
        console.log({
            ...formData,
            info: {
                ...info,
                social: social
            }
        });
        firestore.collection('users').doc(user.uid).set({
            ...formData,
            info: {
                ...info,
                social
            }
        })
    }

        return (
            // В форму оберни
            info ? <div className={style.container}>
                <div className={style.info}>
                    <div className={style.infoItem}>
                        <span className={style.title}>Имя</span>
                        <input name="username" className={style.value} value={info.username} onChange={handleInfo} />
                    </div>
                    <div className={style.infoItem}>
                        <span className={style.title}>Email</span>
                        <input name="email" className={style.value} value={formData.email} onChange={handleChange} />
                    </div>
                    <div className={style.infoItem}>
                        <span className={style.title}>Телефон</span>
                        <input name="phone" className={style.value} value={info.phone} onChange={handleInfo} />
                    </div>
                    <div className={style.infoItem}>
                        <span className={style.title}>Описание</span>
                        <input name="description" className={style.value} value={info.description} onChange={handleInfo} />
                    </div>
                </div>
                <hr />
                <div className={style.info}>
                    <div className={style.infoItem}>
                        <span className={style.title}>VK</span>
                        <input name="vk" className={style.value} value={social.vk} onChange={handleSocial} />
                    </div>
                    <div className={style.infoItem}>
                        <span className={style.title}>Instagram</span>
                        <input name="instagram" className={style.value} value={social.instagram} onChange={handleSocial} />
                    </div>
                </div>
                <Button onClick={handleSubmit}>Сохранить</Button>
            </div>
            : <div>loading</div>
        )
}
