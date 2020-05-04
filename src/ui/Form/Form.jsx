import React from 'react'
import style from './form.module.scss'
import FormItem from './FormItem'
//внедрить мб classnames
const Form = (props) => {

    return (
        <form {...props}>
            {props.children}
        </form>
    )

}

Form.Item = FormItem

export { Form }
