function Modal({ open, title, children, onClose }) {
  if (!open) {
    return null
  }

  return (
    <div className="modal" role="presentation" onClick={onClose}>
      <div className="modal__panel" role="dialog" aria-modal="true" aria-label={title} onClick={(event) => event.stopPropagation()}>
        <div className="modal__header">
          <h2 className="modal__title">{title}</h2>
          <button type="button" className="modal__close" onClick={onClose} aria-label="Close modal">
            Close
          </button>
        </div>
        <div className="modal__body">{children}</div>
      </div>
    </div>
  )
}

export default Modal