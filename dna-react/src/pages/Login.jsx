import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailPassword, signInWithGoogle } from '../firebase';
import AuthForm from '../components/AuthForm';
import GoogleLoginButton from '../components/GoogleLoginButton';
import bg from '../assets/img/bg.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailPassword(email, password);
      navigate('/');
    } catch {
      setError('Invalid email or password.');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
      navigate('/');
    } catch {
      setError('Google login failed.');
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${bg})` }} 
    >
      <div className="card w-96 bg-white shadow-xl p-6">
        <AuthForm
          type="Login"
          onSubmit={handleLogin}
          error={error}
          showPassword={showPassword}
          togglePassword={() => setShowPassword(!showPassword)}
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
        />
        <GoogleLoginButton handleGoogleLogin={handleGoogleLogin} />
        <div className="mt-4 text-center">
          Don’t have an account?{' '}
          <a href="/signup" className="text-blue-500">
            Sign up
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
