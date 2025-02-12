import React from 'react';

const Modal = ({ message, onClose }) => {
    return (
        <div style={modalStyles.overlay}>
            <div style={modalStyles.modal}>
                <h2>{message}</h2>
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

const modalStyles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modal: {
        background: 'white',
        padding: '20px',
        borderRadius: '8px',
        width: '300px',
        textAlign: 'center',
    }
};

export default Modal;
