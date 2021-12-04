const initialNotification = {
  type : 'success',
  message : '',
  duration : 5,
  style : 'none',
  timeoutId : ''
}

const notificationReducer = (state = initialNotification, action) => {
  switch (action.type) {
  case 'NOTIFY_SUCCESS':
    clearTimeout(state.timeoutId)
    return { ...state, message : action.message, style : 'success' }
  case 'NOTIFY_ERROR':
    clearTimeout(state.timeoutId)
    return { ...state, message : action.message, style : 'error' }
  case 'NOTIFY_HIDE':
    return { ...state, message : action.message, style : 'hide' }
  case 'SET_TIMEOUT':
    return { ...state, timeoutId : action.timeoutId }
  default:
    return state
  }
}


export const notifySuccess = (message, timeout) => {
  return async dispatch => {
    dispatch({
      type: 'NOTIFY_SUCCESS',
      message : message
    })
    const timeoutId = setTimeout(() => {
      dispatch({
        type: 'NOTIFY_HIDE',
        message : ''
      })
    }, timeout * 1000)
    dispatch({
      type: 'SET_TIMEOUT',
      timeoutId : timeoutId
    })
  }
}

export const notifyError = (message, timeout) => {
  return async dispatch => {
    dispatch({
      type: 'NOTIFY_ERROR',
      message : message
    })
    const timeoutId = setTimeout(() => {
      dispatch({
        type: 'NOTIFY_HIDE',
        message : ''
      })
    }, timeout * 1000)
    dispatch({
      type: 'SET_TIMEOUT',
      timeoutId : timeoutId
    })
  }
}


export default notificationReducer