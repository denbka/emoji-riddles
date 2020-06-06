import React, { useState } from 'react'
import { Button, message, Form } from '../../ui'
import style from './crud.module.scss'
import { firestore } from '../../services/firebase'
export const Crud = ({ user }) => {
    const { Item } = Form
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

    const save = () => {
        const data = { ...form }
        data.title = data.title.trim()
        data.emojies = data.emojies.trim()
        data.answer = formatAnswer(data.answer)
        firestore.collection('riddles').add({
            ...data,
            author: user.uid
        })
        message.success('Успешно создано!')
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
            <Form className={style.bodyUi}>
                <Item label="Название">
                    <input
                    onChange={handleChange}
                    name="title"
                    placeholder="Введите название загадки..." />
                </Item>
                <Item label="Загадка">
                    <textarea
                    name="emojies"
                    onChange={handleChange}
                    placeholder="Введите емоджи..." />
                </Item>
                <Item label="Ответ">
                    <textarea
                    name="answer"
                    onChange={handleChange}
                    placeholder="Введите варианты ответа через запятую..." />
                </Item>
                <Item>
                    <Button
                    onClick={save}>
                        Готово
                    </Button>
                </Item>
            </Form>
        </div>
    )
}