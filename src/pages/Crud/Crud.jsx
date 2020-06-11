import React, { useState, useEffect } from 'react'
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
    const [ disabled, setDisabled ] = useState(false)

    const [ formErrors, setFormErrors ] = useState({})

    const rules = {
        title: { required: true, message: 'Введите название загадки' },
        emojies: { required: true, message: 'Придумайте загадку' },
        answer: { required: true, message: 'Введите ответ' }
    }

    useEffect(() => {
        setFormErrors(Object.fromEntries(Object.entries(rules).map(rule => [rule[0], null])))
    }, [])

    

    const handleChange = event => {
        const { name, value } = event.target
        if (rules[name]) {
            if (rules[name].required && !value.trim().length) {
                setFormErrors({...formErrors, [name]: rules[name].message || 'Заполните поле'})
            } else if (value.length) {
                setFormErrors({...formErrors, [name]: null})
            }
        }
        setForm({
            ...form,
            [name]: value
        })
    }

    const displayErrors = () => {
        let errors = {}
        Object.entries(form).map(formItem => {
            const name = formItem[0]
            const value = formItem[1]
            if (rules[name].required && !value.trim().length) {
                errors = {...errors, [name]: rules[name].message || 'Заполните поле'}
            }
        })
        setFormErrors(errors)
        return errors
    }

    const сheckValid = () => {
        const errors = displayErrors()
        const queue = []
        Object.entries(errors).map(rule => {
            if (rule[1]) queue.push(rule[1])
        })
        return queue.length ? false : true
    }

    const save = async (event) => {
        const data = { ...form }
        data.title = data.title.trim()
        data.emojies = data.emojies.trim()
        data.answer = formatAnswer(data.answer)
        if (!сheckValid()) {
            message.error('Заполните поля!')
            return
        }
        setDisabled(true)
        await firestore.collection('riddles').add({
            ...data,
            author: user.uid
        })
        setDisabled(false)
        message.success('Успешно создано!')
        setForm({
            title: '',
            emojies: '',
            answer: ''
        })
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
            <Form className={style.bodyUi} {...{formErrors}}>
                <Item label="Название">
                    <input
                    onChange={handleChange}
                    value={form.title}
                    name="title"
                    placeholder="Введите название загадки..." />
                </Item>
                <Item label="Загадка">
                    <textarea
                    name="emojies"
                    onChange={handleChange}
                    value={form.emojies}
                    placeholder="Введите емоджи..." />
                </Item>
                <Item label="Ответ">
                    <textarea
                    name="answer"
                    onChange={handleChange}
                    value={form.answer}
                    placeholder="Введите варианты ответа через запятую..." />
                </Item>
                <Item>
                    <Button
                    {...{disabled}}
                    onClick={save}>
                        Готово
                    </Button>
                </Item>
            </Form>
        </div>
    )
}