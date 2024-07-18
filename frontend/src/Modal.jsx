import React from "react";

const Modal = ({title,onClose, onAccept, children}) => {
  return (
    <div className="modal d-block" tabIndex="-1">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{title}</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            {children}
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
              onClick={onClose}
            >
              Decline
            </button>
            <button onClick={onAccept} type="button" className="btn btn-primary">
              Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;