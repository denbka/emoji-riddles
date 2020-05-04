import React from 'react'
import { Link } from 'react-router-dom'
import { signin } from '../../helpers'
import { Input, Button, Form } from '../../ui'
import style from './login.module.scss'

export const Login = () => {
    const [ formData, setFormData ] = React.useState({
        email: '',
        password: ''
    })
    const [ error, setError ] = React.useState('')

    const handleSubmit = async event => {
        event.preventDefault()
        setError('')
        try {
          const response = await signin(formData.email, formData.password)
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
        <h1 className={style.title}>Авторизация</h1>
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
            <Button onClick={handleSubmit}>Войти</Button>
            {error}
          </Form.Item>
        </Form>
        <p className={style.already}>Нет аккаунта? <Link to="/register">Присоединиться</Link></p>
      </div>
    )
}
