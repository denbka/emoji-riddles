import React, { useState } from 'react'
import { Button, message } from '../../ui'
import style from './crud.module.scss'
import { firestore } from '../../services/firebase'
export const Crud = ({ user }) => {

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
        data.title = data.title.trim()
        data.emojies = data.emojies.trim()
        data.answer = formatAnswer(data.answer)
        firestore.collection('riddles').add({
            ...data,
            author: user.uid
        })
        message.info('Успешно создано!')
    }

    const formatAnswer = (answer) => {
        const data = answer.trim().split(',')
        const formatArray = []
        data.map(item => {
            if (!item.trim().length) return
            formatArray.push(item.trim().toLowerCase())
        })
        return formatArray
    }

    return (
        <div className={style.body}>
            <div className={style.text}>
                Придумайте что-то интересное. если загадка понравится пользователям, вам будут начисляться очки.
            </div>
            <div className={style.bodyUi}>
                <label>Название</label>
                {/* Форматирование поехало. И инпуты должны быть в форме. А кнопка должна быть type="submit" */}
                <input
                onChange={handleChange}
                name="title"
                placeholder="Введите название загадки..." />
                <label>Загадка</label>
                <textarea
                name="emojies"
                onChange={handleChange}
                placeholder="Введите емоджи..." />
                <label>Ответ</label>
                <textarea
                name="answer"
                onChange={handleChange}
                placeholder="Введите варианты ответа через запятую..." />
                <Button
                onClick={() => save(form)}>
                    Готово
                </Button>
            </div>
        </div>
    )
}