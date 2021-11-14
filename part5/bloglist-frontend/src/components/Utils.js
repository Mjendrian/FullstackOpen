/* eslint-disable react/display-name */
import React, { useState, useImperativeHandle } from 'react'
import PropTypes from 'prop-types'

const Togglable = React.forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  useImperativeHandle(ref, () => {
    return {
      toggleVisibility
    }
  })

  return (
    <span>
      <button onClick={toggleVisibility}>{ (visible ? props.cancelButtonLabel : props.buttonLabel) }</button>,
      <div >
        <div style={hideWhenVisible}>
        </div>
        <div style={showWhenVisible}>
          {props.children}
        </div>
      </div>
    </span> )
})

Togglable.propTypes = {
  buttonLabel: PropTypes.string.isRequired,
  cancelButtonLabel: PropTypes.string.isRequired
}

Togglable.displayName = 'Togglable'

export { Togglable }