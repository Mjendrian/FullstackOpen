const initialNotification = {
  type : 'success',
  message : '',
  duration : 5,
  style : 'none'
}

const notificationReducer = (state = initialNotification, action) => {
  switch (action.type) {
    case 'NOTIFY_SUCCESS':
      return {...state, message : action.message, style : 'success' }
    case 'NOTIFY_ERROR':
      return {...state, message : action.message, style : 'error' }
    case 'NOTIFY_HIDE':
      return {...state, message : action.message, style : 'hide' }
    default:
      return state
  }
}

export const notifySuccess = (notification) => {
  return {
    type: 'NOTIFY_SUCCESS',
    message : notification
  }
}

export const notifyError = (notification) => {
  return {
    type: 'NOTIFY_ERROR',
    message : notification
  }
}

export const notifyHide = () => {
  return {
    type: 'NOTIFY_HIDE',
    message : ''
  }
}

export default notificationReducer