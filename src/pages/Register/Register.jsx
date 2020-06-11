import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { signup } from '../../helpers'
import { firestore } from '../../services/firebase'
import { Input, Button, Form, message } from '../../ui'
import style from './register.module.scss'

export const Register = () => {
  const { Item } = Form
    const [ formData, setFormData ] = React.useState({
        email: '',
        password: ''
    })
    const [ error, setError ] = React.useState('')
    const [ formErrors, setFormErrors ] = useState({})
    const rules = {
      email: { required: true, message: 'Введите email' },
      password: { required: true, message: 'Введите пароль' }
    }

    useEffect(() => {
      setFormErrors(Object.fromEntries(Object.entries(rules).map(rule => [rule[0], null])))
    }, [])

    const displayErrors = () => {
      let errors = {}
      Object.entries(formData).map(formItem => {
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

      const handleSubmit = async event => {
        if (!сheckValid()) {
          message.error('Заполните поля!')
          return
        }
        setError('')
        try {
          const response = await signup(formData.email, formData.password)
          firestore.collection('users').doc(response.user.uid).set({
            email: response.user.email,
            checkedRiddles: [],
            points: 0,
            photoURL: null,
            info: {
              username: null,
              description: null,
              phone: null,
              social: {
                vk: null,
                instagram: null
              }
            },
            stats: {
              followers: 0,
              following: 0,
              likes: 0,
              dislikes: 0
            },
            notifications: {
              likes: false,
              newFollowers: false,
              recommendations: false
            },
            theme: 'default',
            lang: 'ru',
            uid: response.user.uid
          })
      
          firestore.collection('followers').doc(response.user.uid).set({users: []})
          firestore.collection('following').doc(response.user.uid).set({users: []})
          
        } catch (error) {
          setError(error.message)
          message.error('Ошибка, повторите попытку!')
        }
      }

    const handleChange = event => {
      const { name, value } = event.target
      if (rules[name]) {
          if (rules[name].required && !value.trim().length) {
              setFormErrors({...formErrors, [name]: rules[name].message || 'Заполните поле'})
          } else if (value.length) {
              setFormErrors({...formErrors, [name]: null})
          }
      }
      setFormData({
          ...formData,
          [name]: value
      })
    }

    return (
      <div className={style.container}>
        <h1 className={style.title}>Регистрация</h1>
        <Form className={style.formContainer} {...{formErrors}}>
          <Item>
            <Input
            placeholder="Email"
            name="email"
            type="email"
            onChange={handleChange}
            value={formData.email}>
            </Input>
          </Item>
          <Item>
            <Input
            placeholder="Пароль"
            name="password"
            onChange={handleChange}
            value={formData.password}
            type="password">
            </Input>
          </Item>
          <Item>
            <Button onClick={handleSubmit}>Присоединиться</Button>
          </Item>
        </Form>
        {error}
        <p className={style.already}>Уже есть аккаунт? <Link to="/login">Войти</Link></p>
      </div>
    )
}
