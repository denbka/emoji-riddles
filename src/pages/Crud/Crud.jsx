import React, { useState } from 'react'
import { Button } from '../../ui'
import style from './crud.module.scss'
import { firestore } from '../../services/firebase'
export const Crud = () => {

    const [ form, setForm ] = useState({
        title: '',
        emojies: '',
        answer: '',
    })

    const handleChange = event => {
        setForm({
            ...form,
            [event.target.name]: event.target.value
        })
    }

    const save = (data) => {
        console.log(data);
        firestore.collection('riddles').add(data)

    }

    return (
        <div className={style.body}>
            <div className={style.text}>
                Придумайте что-то интересное. если загадка понравится пользователям, вам будут начисляться очки.
            </div>
            <div className={style.bodyUi}>
                <label>Название</label>
                <input
                onChange={handleChange}
                name="title"
                placeholder="Введите название загадки..." />
                <label>Загадка</label>
                <textarea
                name="emojies"
                onChange={handleChange}
                placeholder="Введите слово или предложение..." />
                <label>Ответ</label>
                <textarea
                name="answer"
                onChange={handleChange}
                placeholder="Введите слово или предложение..." />
                <Button
                onClick={() => save(form)}>
                    Готово
                </Button>
            </div>
        </div>
    )
}