const Notification = ({ message, success }) => {
  if (message === null) {
    return null
  }

  const status = success ? "success" : "error"

  return (
    <div className={status}>
      {message}
    </div>
  )
}

export default Notification