import React from 'react'
import { useSelector } from 'react-redux'
import { Alert } from '@material-ui/lab'

// Notification composant
const Notification = () => {

  const notification = useSelector(state => state.notification)

  if (notification.message === null || notification.style === 'hide') {
    return null
  }

  return (
    <Alert severity={ notification.style }>
      {notification.message}
    </Alert>
  )
}

export default Notification