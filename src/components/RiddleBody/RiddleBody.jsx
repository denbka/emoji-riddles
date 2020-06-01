import React from 'react'
import { Button } from '../../ui'
import { Footer } from '../Footer'

export const RiddleBody = ({ riddle, changeRiddle, disabledButton, handleChangeAnswer, answer, style, author }) => {
    return (
        <div className={style.bodyContent}>
            <div className={style.bodyEmodji}>
                <span>{riddle.title}</span>
                <span>{riddle.emojies}</span>
            </div>
            <div className={style.bodyUi}>
                <textarea placeholder="Введите слово или предложение..." value={answer} onChange={handleChangeAnswer} />
                <Button onClick={() => changeRiddle(riddle)} disabled={disabledButton}>Готово</Button>
            </div>
            {author && <Footer author={author} riddleId={riddle.key} />}
        </div>
    )
}
