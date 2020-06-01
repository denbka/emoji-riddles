import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './tabs.sass'

export const Tabs = ({ tabs, currentTab, onChange }) => {

    const [ data, setData ] = useState(tabs)

    useEffect(() => {
        const newData = data.map(element => {
            if (element.name === currentTab) {
                element.className = 'tab active'
            } else {
                element.className = 'tab'
            }
            return element
        })
        setData(newData)
    }, [currentTab])
    
    return (
        <ul className="tabs-container" style={{paddingTop: '100px'}}>
            {data.map(item => <li
                key={item.name}
                className={item.className}
                name={item.name}
                onClick={onChange}>
                    {item.label}
            </li>)}
        </ul>
    )
}