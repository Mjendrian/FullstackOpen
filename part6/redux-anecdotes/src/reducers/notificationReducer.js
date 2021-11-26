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

export const notifySuccess = (notification, timeout) => {
  return async dispatch => {
    dispatch({
      type: 'NOTIFY_SUCCESS',
      message : notification
    })
    setTimeout(() => {
      dispatch({
        type: 'NOTIFY_HIDE',
        message : ''
      })
    }, timeout * 1000);
  }
}

export const notifyError = (notification, timeout) => {
  return async dispatch => {
    dispatch({
      type: 'NOTIFY_ERROR',
      message : notification
    })
    setTimeout(() => {
      dispatch({
        type: 'NOTIFY_HIDE',
        message : ''
      })
    }, timeout * 1000);
  }
}

export default notificationReducer