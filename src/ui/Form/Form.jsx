import React from 'react'
import style from './form.module.scss'
import FormItem from './FormItem'
const Form = (props) => {
    const renderChildren = () => {
        return React.Children.map(props.children, child => {
          return React.cloneElement(child, {
            formerrors: props.formErrors
          })
        })
    }
    return (
        <form {...props}>
            {renderChildren()}
        </form>
    )

}

Form.Item = FormItem

export { Form }
