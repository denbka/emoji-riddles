import React, { useRef, useState, useEffect } from 'react'
import { useSprings, animated } from 'react-spring'
import { getRandomNumber, parseUrlQueries } from '../../helpers'
import style from './game.module.sass'
import { Footer, EmptyStub, RiddleBody, FeedbackModal } from '../../components'
import { firestore } from '../../services/firebase'
import { useLocation, useHistory } from 'react-router-dom'
export const Game = ({ user }) => {

    const colors = ['#EE5053', '#5AD6FC', '#B362C8', '#EE5053', '#7FC256', '0019ff']
    const location = useLocation()
    const router = useHistory()
    const [riddles, setRiddles] = useState([])
    const [ answer, setAnswer ] = useState('')
    const [ isModal, setIsModal ] = useState(false)
    const [ feedback, setFeedback ] = useState(null)
    const [ guessed, setGuessed ] = useState(false)
    const [ guessedText, setGuessedText ] = useState(null)
    const [ disabledButton, setDisabledButton ] = useState(false)
    const [ author, setAuthor ] = useState(null)
    const index = useRef(0)
    const [ type, setType ] = useState(null)
    const [ singleRiddle, setSingleRiddle ] = useState(null)
    const [ formErrors, setFormErrors ] = useState({})
    const rules = {
        answer: { required: true, message: 'Заполните ответ' }
    }
    const displayErrors = () => {
        let errors = {}
            if (!answer.trim().length) {
                errors = {answer: 'Заполните ответ'}
            }
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

    useEffect(() => {
        checkTypeGame()
        setFormErrors({answer: null})
    }, [])

    const checkTypeGame = async () => {
        const queries = parseUrlQueries(location.search)
        const issetIdInQuery = queries && queries.some(query => query.name === 'riddleId')
        if (issetIdInQuery) {
            setType('single')
            const response = await getRiddleById(queries.find(query => query.name === 'riddleId'))
            const author = await getAuthor(response.data().author)
            setAuthor(author.data())
            setSingleRiddle({ key: response.id, ...response.data(), background: colors[getRandomNumber(colors.length)]})
        } else {
            setType('list')
            await getRiddles()
        }
    } 

    const getRiddleById = query => {
        return firestore.collection('riddles').doc(query.value).get()
    }

    const getRiddles = () => {
        firestore.collection('riddles').onSnapshot(async snap => {
            const newData = []
            snap.docs.map(item => {
                if (user && !user.checkedRiddles.includes(item.id) && item.data().author !== user.uid) {
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
    }

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
        setFeedback(null)
        // setDisabledButton(true)
    }
    const changeRiddle = async (currentRiddle) => {
        if (!сheckValid()) {
            // message.error('Выберите ответ!')
            return
        }
        const textAnswer = answer.trim().toLowerCase()
        const newGuessed = currentRiddle.answer.includes(textAnswer)
        setGuessed(newGuessed)
        setGuessedText(currentRiddle.answer.find(item => item === textAnswer))
        if (user) {
            firestore.collection('users').doc(user.uid).update({
                ...user,
                points: user.points + 10,
                checkedRiddles: [...user.checkedRiddles, currentRiddle.key]
            })
        }
        setIsModal(true)
    }

    const handleFeedback = async (value) => {
        setFeedback(value)
        await setFeedbackForAuthor(value)
        if (type === 'list') nextRiddle()
        else router.push(`/users/${singleRiddle.author}`)
    }

    const setFeedbackForAuthor = async (fb) => {
        const snap = await getAuthor(type === 'list' ? riddles[index.current].author : singleRiddle.author)
        const stats = snap.data().stats
        if (fb === 'like') stats.likes++
        if (fb === 'dislike') stats.dislikes++
        if (type === 'list')
        return await firestore.collection('users').doc(riddles[index.current].author).update({ ...snap.data(), stats })
        if (type === 'single')
        return await firestore.collection('users').doc(singleRiddle.author).update({ ...snap.data(), stats })
    }

    const getAuthor = (id) => {
        return firestore.collection('users').doc(id).get()
    }

    const handleContinue = () => {
        if (type === 'list') nextRiddle()
        else router.push(`/users/${singleRiddle.author}`)
    }

    const handleChangeAnswer = event => {
        const { name, value } = event.target
        if (rules[name]) {
            console.log(rules[name], value)
            if (rules[name].required && !value.trim().length) {
                setFormErrors({...formErrors, [name]: rules[name].message || 'Заполните ответ'})
            } else if (value.length) {
                setFormErrors({...formErrors, [name]: null})
            }
        }
        setAnswer(value)
    }
        return (
        <div className={style.container}>
            {type === 'list' && <div>
                {props.length || index.current <= props.length-1 ? props.map(({ display, y }, i) => (
                    <animated.div
                    key={i}
                    className={style.body}
                    style={{
                        display,
                        transform: y.interpolate(y => `translate3d(0,${y}px,0)`),
                        background: riddles[i].background
                    }}>
                        <RiddleBody {...{
                            handleChangeAnswer,
                            style,
                            riddle: riddles[i],
                            changeRiddle,
                            disabledButton,
                            formErrors,
                            answer,
                            author
                        }} />
                    </animated.div>
                )) : ''}
            { !props.length || index.current > props.length-1 ? <EmptyStub>Упс! Загадки кончились. Пустота...</EmptyStub> : ''}
            </div>}
            {singleRiddle && <RiddleBody {...{
                            handleChangeAnswer,
                            style,
                            riddle: singleRiddle,
                            changeRiddle,
                            disabledButton,
                            formErrors,
                            answer,
                            author
                        }} />}
            {isModal && <FeedbackModal {...{ style, guessed, guessedText, feedback, handleContinue, handleFeedback }} />}
        </div>
        )
}
