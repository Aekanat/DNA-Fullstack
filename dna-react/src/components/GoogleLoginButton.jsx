import React from 'react';

const GoogleLoginButton = ({ handleGoogleLogin }) => (
  <div className="mt-4 text-center">
    <button
      onClick={handleGoogleLogin}
      className="btn btn-outline btn-primary w-full"
    >
      Login with Google
    </button>
  </div>
);

export default GoogleLoginButton;
