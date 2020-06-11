import React from 'react'
import { Button, Form } from '../../ui'
import { Footer } from '../Footer'

export const RiddleBody = ({ riddle, changeRiddle, disabledButton, handleChangeAnswer, answer, style, author, formErrors }) => {
    const { Item } = Form
    return (
        <div className={style.bodyContent}>
            <div className={style.bodyEmodji}>
                <span>{riddle.title}</span>
                <span>{riddle.emojies}</span>
            </div>
            <Form className={style.bodyUi} {...{formErrors}}>
                <Item>
                    <textarea placeholder="Введите слово или предложение..." name="answer" value={answer} onChange={handleChangeAnswer} />
                </Item>
                <Item>
                    <Button onClick={() => changeRiddle(riddle)} disabled={disabledButton}>Готово</Button>
                </Item>
            </Form>
            {author && <Footer author={author} riddleId={riddle.key} />}
        </div>
    )
}
