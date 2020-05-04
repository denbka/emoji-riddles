import React, { useRef, useState } from 'react'
import clamp from 'lodash-es/clamp'
import { useSprings, animated } from 'react-spring'
import { useGesture } from 'react-use-gesture'
import { getRandomNumber } from '../../helpers'
import style from './game.module.sass'
import { Button } from '../../ui'
import { firestore } from '../../services/firebase'
export const Game = ({ user }) => {

    const colors = ['#EE5053', '#5AD6FC', '#B362C8', '#EE5053', '#7FC256', '0019ff']

    const [riddles, setRiddles] = useState([])
    const [ answer, setAnswer ] = useState('')

    React.useEffect(() => {
        firestore.collection('riddles').onSnapshot(snap => {
            const newData = []
            snap.docs.map(item => {
                if (user && !user.checkedRiddles.includes(item.id)) {
                    newData.push({ key: item.id, ...item.data() })
                }
            })
            setRiddles(newData)
        })
    }, [user, firestore])

    const index = useRef(0)
    const [props, set] = useSprings(riddles.length, i => ({ y: i * window.innerHeight, sc: 1, display: 'block', background: colors[getRandomNumber(colors.length-1)] }))
    const bind = useGesture(({ down, delta: [xDelta, yDelta], direction: [xDir, yDir], distance, cancel }) => {
        if (down && distance > window.innerHeight / 2)
        cancel((index.current = clamp(index.current + (yDir > 0 ? -1 : 1), 0, riddles.length - 1)))
        set(i => {
        if (i < index.current - 1 || i > index.current + 1) return { display: 'none' }
        const y = (i - index.current) * window.innerHeight + (down ? yDelta : 0)
        const sc = down ? 1 - distance / window.innerHeight / 2 : 1
        return { y, sc, display: 'block' }
        })
    })

    const changeRiddle = async (currentRiddle, index) => {
        let guessed = false
        if (currentRiddle.answer.indexOf(answer) !== -1) guessed = true
        if (user) {
            const app = await firestore.collection('answers').add({
                answer,
                guessed,
                userId: user.uid,
                riddleId: currentRiddle.key
            })
            firestore.collection('users').doc(user.email).update({
                ...user,
                points: user.points + 10,
                checkedRiddles: [...user.checkedRiddles, currentRiddle.key]
            })
            console.log(app);
        }
        const newData = [...riddles]
        // newData.splice(newData[index], 1)
        setRiddles(newData)
    }

        return <div className={style.container}>
            {props.map(({ y, display, sc }, i) => (
            <animated.div {...bind()} key={i} style={{ display, transform: y.interpolate(y => `translate3d(0,${y}px,0)`) }}>
                <animated.div style={{ transform: sc.interpolate(s => `scale(${s})`), background: props[i].background }}>
                    <div className={style.body}>
                        <div className={style.bodyEmodji}>
                            <span>{riddles[i].emojies}</span>
                        </div>
                        <div className={style.bodyUi}>
                            <textarea placeholder="Введите слово или предложение..." value={answer} onChange={event => setAnswer(event.target.value)} />
                            <Button onClick={() => changeRiddle(riddles[i], i)}>Готово</Button>
                            <span className={style.timer}>00:20:00</span>
                        </div>
                    </div>
                </animated.div>
            </animated.div>
            ))}
      </div>

}
