import React from 'react'
import 'rc-notification/assets/index.css'
import Notification from 'rc-notification'
import style from './message.module.scss'
import { InfoCircleFilled, CheckCircleFilled, CloseCircleFilled  } from '@ant-design/icons'
let messageInstance
let message = {}
let transitionName = 'move-up'

const Icon = ({ type }) => {
    switch (type) {
        case 'success': return <CheckCircleFilled style={{color: 'rgb(43, 182, 25)'}}  />
        case 'error': return <CloseCircleFilled style={{color: 'rgb(214, 80, 80)'}} />
        case 'info': return <InfoCircleFilled style={{color: 'rgb(214, 156, 80)'}} />
    }
}

const getMessageInstance = (callback) => {
    if (messageInstance) {
        callback(messageInstance)
        return
    }
    Notification.newInstance({
        prefixCls: "r-message",
        transitionName,
        style: {},
    }, (instance) => {
        if (messageInstance) {
            callback(messageInstance)
            return
        }
        messageInstance = instance
        callback(instance)
    })
}

const init = (args, type) => {
    let key = 0
    getMessageInstance(instance => {
        instance.notice({
            key: key++,
            duration: 3,
            content: <div className={`r-message__content r-message__content-${type}`}>
                <span className="r-message__content__icon">{<Icon {...{type}} />}</span>
                <span>{args}</span>
            </div>,
            style: {},
            onClose() {
                // messageInstance.removeNotice(args)
            },
        })
    })
}

message.success = (args) => {
    init(args, 'success')
}

message.error = (args) => {
    init(args, 'error')
}

message.info = (args) => {
    init(args, 'info')
}

export { message }
