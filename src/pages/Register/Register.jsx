import React from 'react'
import { Link } from 'react-router-dom'
import { signup } from '../../helpers'
import { Input, Button, Form } from '../../ui'
import style from './register.module.scss'
import { firestore } from '../../services/firebase'

export const Register = () => {
    const [ formData, setFormData ] = React.useState({
        email: '',
        password: ''
    })
    const [ error, setError ] = React.useState('')

    const handleSubmit = async event => {
        event.preventDefault()
        setError('')
        try {
          const response = await signup(formData.email, formData.password)
          firestore.collection('users').doc(response.user.email).set({
            email: response.user.email,
            checkedRiddles: [],
            points: 0,
            info: {
              firstName: null,
              lastName: null,
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
            lang: 'ru'
          })
        } catch (error) {
          setError(error.message)
        }
      }

    const handleChange = (e) => {
        const {name, value} = e.target
        setFormData({...formData, [name]: value})
    }

    return (
      <div className={style.container}>
        <h1 className={style.title}>Регистрация</h1>
        <Form className={style.formContainer}>
          <Form.Item>
            <Input
            placeholder="Email"
            name="email"
            type="email"
            onChange={handleChange}
            value={formData.email}>
            </Input>
          </Form.Item>
          <Form.Item>
            <Input
            placeholder="Пароль"
            name="password"
            onChange={handleChange}
            value={formData.password}
            type="password">
            </Input>
          </Form.Item>
          <Form.Item>
            <Button onClick={handleSubmit}>Зарегистрироваться</Button>
            {error}
          </Form.Item>
        </Form>
        <p className={style.already}>Уже есть аккаунт? <Link to="/login">Войти в систему</Link></p>
      </div>
    )
}
