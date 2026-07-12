import React, { useState } from 'react';
import { Form, InputGroup, Button } from 'react-bootstrap';

/**
 * A password <Form.Control> with a show/hide toggle button.
 * Renders exactly like a normal Bootstrap form field to keep styling consistent.
 */
export default function PasswordField({ value, onChange, placeholder, required, minLength, autoFocus, name, id }) {
  const [visible, setVisible] = useState(false);

  return (
    <InputGroup>
      <Form.Control
        type={visible ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        minLength={minLength}
        autoFocus={autoFocus}
        name={name}
        id={id}
      />
      <Button
        variant="outline-secondary"
        type="button"
        onClick={() => setVisible((v) => !v)}
        tabIndex={-1}
        aria-label={visible ? 'Hide password' : 'Show password'}
      >
        <i className={`bi ${visible ? 'bi-eye-slash' : 'bi-eye'}`}></i>
      </Button>
    </InputGroup>
  );
}
