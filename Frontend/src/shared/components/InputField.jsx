import React from 'react';
import InputError from './InputError';
import './InputField.css';

const InputField = ({
  invisibleLabel,
  label,
  errorMessage,
  touched,
  className,
  errorClassName,
  ...inputProps
}) => {
  return (
    <div className={className}>
      {(invisibleLabel || label) && (
        <div className="input-label-wrapper">
          {label && <label htmlFor="first-name">{label}</label>}
        </div>
      )}

      <input {...inputProps} />

      <InputError
        className={errorClassName}
        id={`${inputProps.id}-error`}
        show={touched}
        message={errorMessage}
      />
    </div>
  );
};

export default InputField;
