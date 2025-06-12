import React from 'react';
import PasswordField from './PasswordField';

const AuthForm = ({
  type,
  onSubmit,
  error,
  showPassword,
  togglePassword,
  email,
  setEmail,
  password,
  setPassword,
}) => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-center">{type}</h2>
      {error && <div className="alert alert-error mt-4">{error}</div>}
      <form onSubmit={onSubmit}>
        <div className="form-control mt-4">
          <input
            type="email"
            className="input input-bordered w-full"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <PasswordField
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          showPassword={showPassword}
          togglePassword={togglePassword}
        />
        <div className="form-control mt-6">
          <button type="submit" className="btn btn-primary w-full">
            {type}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AuthForm;
