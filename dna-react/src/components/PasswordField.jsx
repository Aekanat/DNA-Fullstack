import React from 'react';

const PasswordField = ({ label, value, onChange, showPassword, togglePassword }) => (
  <div className="form-control mt-4">
    <div className="relative">
      <input
        type={showPassword ? "text" : "password"}
        className="input input-bordered w-full pr-12"
        placeholder={label}
        value={value}
        onChange={onChange}
        required
      />
      <button
        type="button"
        className="absolute right-3 top-3 text-sm text-blue-500"
        onClick={togglePassword}
      >
        {showPassword ? "Hide" : "Show"}
      </button>
    </div>
  </div>
);

export default PasswordField;
