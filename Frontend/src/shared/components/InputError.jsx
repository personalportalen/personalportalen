import React from 'react';
import './InputError.css';

const InputError = ({ show, message, id }) => {
  if (!show || !message) {
    return <div className="input-error-shared min-height"></div>;
  }

  return (
    <div className="input-error-shared min-height">
      <p id={id} className="input-error">
        {message}
      </p>
    </div>
  );
};

export default InputError;
