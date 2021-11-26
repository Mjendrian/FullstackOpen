import React from 'react'
import { connect } from 'react-redux'

const Notification = (props) => {

  return (
    <div className={props.notification.style}>
      {props.notification.message}
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    notification : state.notification
  }
}

const ConnectedNotification = connect(mapStateToProps)(Notification)

export default ConnectedNotification