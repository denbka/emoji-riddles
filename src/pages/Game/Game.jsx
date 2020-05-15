import React, { useRef, useState, useEffect } from 'react'
import { useSprings, animated } from 'react-spring'
import { getRandomNumber } from '../../helpers'
import style from './game.module.sass'
import { Footer } from '../../components'
import { Button, Modal } from '../../ui'
import { firestore } from '../../services/firebase'
import { LikeOutlined, LikeFilled, DislikeFilled, DiffOutlined, DislikeOutlined, LoadingOutlined } from '@ant-design/icons'
import Empty from '../../assets/img/empty.svg'
export const Game = ({ user }) => {

    const colors = ['#EE5053', '#5AD6FC', '#B362C8', '#EE5053', '#7FC256', '0019ff']

    const [riddles, setRiddles] = useState([])
    const [ answer, setAnswer ] = useState('')
    const [ isModal, setIsModal ] = useState(false)
    const [ feedback, setFeedback ] = useState(null)
    const [ guessed, setGuessed ] = useState(false)
    const [ disabledButton, setDisabledButton ] = useState(true)
    const [ author, setAuthor ] = useState(null)
    const index = useRef(0)

    useEffect(() => {
        // Опять же. Лучше вынести это. А в useEffect просто оставить выхов
        firestore.collection('riddles').onSnapshot(async snap => {
            const newData = []
            snap.docs.map(item => {
                if (user && !user.checkedRiddles.includes(item.id)) {
                    newData.push({ key: item.id, ...item.data(), background: colors[getRandomNumber(colors.length)] })
                } else if (!user) {
                    newData.push({ key: item.id, ...item.data(), background: colors[getRandomNumber(colors.length)] })
                }
            })
            setRiddles(newData)
            if (newData.length && newData[0].author) {
                const author = await getAuthor(newData[0].author)
                setAuthor(author.data())
            }
        })
    }, [])

    // Название параметров от странное
    const [props, set] = useSprings(riddles.length, i => ({ y: i * window.innerHeight, display: 'block' }))

    const nextRiddle = () => {
        index.current++
        set(i => {
            // Это все точно никак через css-классы и classNames не сделать?
            if (i < index.current - 1 || i > index.current + 1) return { display: 'none' }

            const y = (i - index.current) * window.innerHeight
            return { y: y, display: 'block' }
        })
        setAnswer('')
        setIsModal(false)
        setFeedback(null)
        setDisabledButton(true)
    }
    const changeRiddle = async (currentRiddle) => {
        if (!answer.length) return
        // Вынести все эти преобразования в переменные
        // const newGuessed = currentRiddle.answer.trim().toLowerCase().includes(answer.trim().toLowerCase());
        // setGuessed(newGuessed)
        if (currentRiddle.answer.trim().toLowerCase().indexOf(answer.trim().toLowerCase()) !== -1) setGuessed(true)
        else setGuessed(false)
        if (user) {
            // Снова сервер в компоненте 
            firestore.collection('users').doc(user.email).update({
                ...user,
                points: user.points + 10,
                checkedRiddles: [...user.checkedRiddles, currentRiddle.key]
            })
        }
        setIsModal(true)
    }

    const handleFeedback = (value) => {
        setFeedback(value)
        // Что дает таймаут на 100?
        const time = setTimeout(() => {
            setFeedbackForAuthor(value)
            nextRiddle()
            clearTimeout(time)
        }, 100)
    }

    const setFeedbackForAuthor = async (fb) => {
            const snap = await getAuthor(riddles[index.current].author)
            const stats = snap.data().stats
            if (fb === 'like') stats.likes++
            if (fb === 'dislike') stats.dislikes++
            firestore.collection('users').doc(riddles[index.current].author).update({ ...snap.data(), stats })
    }

    const getAuthor = (id) => {
        return firestore.collection('users').doc(id).get()
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

    // Модалку лучше вынести отдельно
    if (props.length || index.current <= props.length-1) {
        return <div className={style.container}>
            {props.map(({ display, y }, i) => (
                // Поч так страшна?
                <animated.div className={style.body} style={{display, transform: y.interpolate(y => `translate3d(0,${y}px,0)`), background: riddles[i].background }} key={i}>
                    <div className={style.bodyContent}>
                        <div className={style.bodyEmodji}>
                            <span>{riddles[i].title}</span>
                            <span>{riddles[i].emojies}</span>
                        </div>
                        <div className={style.bodyUi}>
                            {/* Тоже должно быть в форме */}
                            <textarea placeholder="Введите слово или предложение..." value={answer} onChange={handleChangeAnswer} />
                            <Button onClick={() => changeRiddle(riddles[i])} disabled={disabledButton}>Готово</Button>
                        </div>
                        {author && <Footer author={author} />}
                    </div>
                </animated.div>
            ))}
            {isModal && <Modal bgOpacity="0.5" width="50%" height="200px">
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
                        Ответ: {riddles[index.current].answer}

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
    //  else не нужен. Лучше сразу return делать
    // И поразбивай на компоненты
    } else return <div className={style.emptyContainer}>
        <div className={style.titleEmptyContainer}>Упс! Загадки кончились. Пустота...</div>
        <img src={Empty} alt="Пустота..."/>
    </div>

        

}
