import React, { useState } from 'react'
import { useSpring, animated } from 'react-spring'


export const ClickAnimation = ({ children }) => {
    const [state, toggle] = useState(true)
    const { x } = useSpring({ from: { x: 0, color: 'red' }, x: state ? 1 : 0, config: { duration: 200 } })
    return (
        <div onClick={() => toggle(!state)}>
            <animated.div
                style={{
                outline: 0,
                // opacity: x.interpolate({ range: [0, 1], output: [0.3, 1] }),
                transform: x
                    .interpolate({
                    range: [0, 0.5, 1],
                    output: [1, 0.8, 1]
                    })
                    .interpolate(x => `scale(${x})`),
                color: x.color
                }}>
                { children }
            </animated.div>
        </div>
    )
}
