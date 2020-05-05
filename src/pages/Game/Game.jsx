import React, { useRef, useState } from 'react'
import { useSprings, animated } from 'react-spring'
import { getRandomNumber } from '../../helpers'
import style from './game.module.sass'
import { Button, Modal } from '../../ui'
import { firestore } from '../../services/firebase'
import { LikeOutlined, LikeFilled, DislikeFilled, DiffOutlined, DislikeOutlined } from '@ant-design/icons'
export const Game = ({ user }) => {

    const colors = ['#EE5053', '#5AD6FC', '#B362C8', '#EE5053', '#7FC256', '0019ff']

    const [riddles, setRiddles] = useState([])
    const [ answer, setAnswer ] = useState('')
    const [ isModal, setIsModal ] = useState(false)
    const [ feedback, setFeedback ] = useState(null)
    const [ guessed, setGuessed ] = useState(false)
    const [ time, setTime ] = useState(20)
    const [ stopTime, setStopTime ] = useState(false)
    const [ disabledButton, setDisabledButton ] = useState(true)
    const index = useRef(0)

    const timerStart = () => {
        // const interval = setInterval(() => {
        //     setTime(time-1)
        //     console.log(time);
        //     if (time == 0) {
        //         clearInterval(interval)
        //     }
        // }, 500)
    }

    React.useEffect(() => {
        firestore.collection('riddles').onSnapshot(snap => {
            const newData = []
            snap.docs.map(item => {
                if (user && !user.checkedRiddles.includes(item.id)) {
                    newData.push({ key: item.id, ...item.data(), background: colors[getRandomNumber(colors.length)] })
                }
            })
            setRiddles(newData)
        })
    }, [])

    React.useEffect(() => {
        const interval = setInterval(() => {
            if (!stopTime) setTime(time-1)
            if (time === 1) {
                nextRiddle()
            }
            clearInterval(interval)
        }, 1000)
    }, [!stopTime && time > 1 && time])


    const [props, set] = useSprings(riddles.length, i => ({ y: i * window.innerHeight, display: 'block' }))

    const nextRiddle = () => {
        index.current++
        set(i => {
            if (i < index.current - 1 || i > index.current + 1) return { display: 'none' }

            const y = (i - index.current) * window.innerHeight
            return { y: y, display: 'block' }
        })
        setAnswer('')
        setIsModal(false)
        setTime(20)
        setFeedback(null)
        setStopTime(false)
        setDisabledButton(true)
    }
    const changeRiddle = async (currentRiddle) => {
        if (!answer.length) return
        setStopTime(true)
        if (currentRiddle.answer.indexOf(answer) !== -1) setGuessed(true)
        if (user) {
            firestore.collection('users').doc(user.email).update({
                ...user,
                points: user.points + 10,
                checkedRiddles: [...user.checkedRiddles, currentRiddle.key]
            })
            // const app = await firestore.collection('answers').add({
            //     answer,
            //     guessed,
            //     userId: user.uid,
            //     riddleId: currentRiddle.key
            // })
        }
        setIsModal(true)
    }

    const handleFeedback = (value) => {
        setFeedback(value)
        const time = setTimeout(() => {
            nextRiddle()
            clearTimeout(time)
        }, 100)
    }

    const handleContinue = () => {
        const time = setTimeout(() => {
            nextRiddle()
            clearTimeout(time)
        }, 100)
    }

    const handleChangeAnswer = event => {
        setAnswer(event.target.value)
        setDisabledButton(answer.length ? false : true)
    }

        return <div className={style.container}>
            {props.map(({ display, y }, i) => (
                <animated.div className={style.body} style={{display, transform: y.interpolate(y => `translate3d(0,${y}px,0)`), background: riddles[i].background }} key={i}>
                    <div className={style.bodyContent}>
                        <div className={style.bodyEmodji}>
                            <span>{riddles[i].title}</span>
                            <span>{riddles[i].emojies}</span>
                        </div>
                        <div className={style.bodyUi}>
                            <textarea placeholder="Введите слово или предложение..." value={answer} onChange={handleChangeAnswer} />
                            <Button onClick={() => changeRiddle(riddles[i])} disabled={disabledButton}>Готово</Button>
                            <span className={style.timer}>00:{time}:00</span>
                        </div>
                    </div>
                </animated.div>
            ))}
            {isModal && <Modal bgOpacity="0.5" width="50%" height="150px">
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
                    </div>
                    <div className={style.modalContent}>
                        <div className={style.modalFeedback}>
                            {!feedback ? <LikeOutlined onClick={() => !feedback && handleFeedback('like')} /> : feedback === 'like' ? <LikeFilled /> : <LikeOutlined />}
                            {!feedback ? <DislikeOutlined onClick={() => !feedback && handleFeedback('dislike')} /> : feedback === 'dislike' ? <DislikeFilled /> : <DislikeOutlined /> }
                        </div>
                        <Button className={style.modalContinue} onClick={handleContinue}>Пропустить</Button>
                    </div>
                </div>
            </Modal>}
      </div>

}
