import React from 'react'
import { LikeOutlined, LikeFilled, DislikeFilled, DiffOutlined, DislikeOutlined, LoadingOutlined } from '@ant-design/icons'
import { Button, Modal } from '../../ui'

export const FeedbackModal = ({ style, guessed, guessedText, feedback, handleContinue, handleFeedback }) => {
    return (
        <Modal bgOpacity="0.5" width="50%" height="200px">
            <div className={style.modalContainer}>
                <div className={style.modalTitle}>
                    {guessed === true && <div className={style.success}>
                        <span>Успешно!</span>
                        <span>+10 очков</span>
                    </div>}
                    {guessed === false && <div className={style.fault}>
                        <span>Как жаль!</span>
                        <span>+0 очков</span>
                    </div>}
                    {guessed && `Ответ: ${guessedText}`}
                </div>
                <div className={style.modalContent}>
                    <div className={style.modalFeedback}>
                        {!feedback ? <LikeOutlined onClick={() => !feedback && handleFeedback('like')} /> : feedback === 'like' ? <LikeFilled /> : <LikeOutlined />}
                        {!feedback ? <DislikeOutlined onClick={() => !feedback && handleFeedback('dislike')} /> : feedback === 'dislike' ? <DislikeFilled /> : <DislikeOutlined /> }
                    </div>
                    <Button className={style.modalContinue} onClick={handleContinue}>Пропустить</Button>
                </div>
            </div>
        </Modal>
    )
}
