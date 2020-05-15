import React from 'react'
import Notification from 'rc-notification'
let notification = null
Notification.newInstance({}, n => notification = n)
export const message = () => {

    const app = Notification.newInstance({}, notification => {
        notification.notice({
            content: 'content'
        })
    })
    console.log(app);

    return (
        <div>
            
        </div>
    )
}
