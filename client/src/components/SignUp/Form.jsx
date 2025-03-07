import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';
import { apiService } from '../../services/api/apiService';

import Modal from '../Modal';

const loginPath = '/login';

function SignUpForm() {
  const navigate = useNavigate();

  const { control, handleSubmit } = useForm();
  const [modalMessage, setModalMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false); //Todo Sentry -- update password invisible
  const [isModalVisible, setModalVisible] = useState(false);

  const onSubmit = async (data) => {
    const response = await apiService.auth.handleRegister(data);
    if (!response) {
      setModalMessage('Registration failed. Please try again.');
      setModalVisible(true);
      console.error('Error: Invalid response or token missing.');
    } else {
      setModalMessage('Registration successful!');
      setModalVisible(true);
    }
  };

  const handleNavigate = () => {
    setModalVisible(false);
    navigate(loginPath);
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <Controller
            name="firstName"
            control={control}
            rules={{ required: 'First name is required' }}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                placeholder="First name"
                className="border border-gray-300 p-2 rounded placeholder:text-xs"
              />
            )}
          />
          <Controller
            name="lastName"
            control={control}
            rules={{ required: 'Last name is required' }}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                placeholder="Last name"
                className="border border-gray-300 p-2 rounded placeholder:text-xs"
              />
            )}
          />
        </div>
        <div className="mb-4">
          <Controller
            name="email"
            control={control}
            rules={{
              required: 'Email is required',
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                message: 'Invalid email address',
              },
            }}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                placeholder="Email address"
                className="border border-gray-300 p-2 rounded w-full placeholder:text-xs"
              />
            )}
          />
        </div>
        <div className="mb-4">
          <Controller
            name="username"
            control={control}
            rules={{ required: 'Username is required' }}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                placeholder="Username"
                className="border border-gray-300 p-2 rounded placeholder:text-xs"
              />
            )}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <Controller
            name="password"
            control={control}
            rules={{
              required: 'Password is required',
              minLength: {
                value: 8,
                message: 'Password must be at least 8 characters long',
              },
              pattern: {
                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                message:
                  'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
              },
            }}
            render={({ field }) => (
              <input
                {...field}
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                className="border border-gray-300 p-2 rounded placeholder:text-xs"
              />
            )}
          />
          <Controller
            name="confirm password"
            control={control}
            rules={{
              validate: (value, formValues) =>
                value === formValues.password ? true : 'Passwords must match. Please try again.',
            }}
            render={({ field }) => (
              <input
                {...field}
                type={showPassword ? 'text' : 'password'}
                placeholder="Confirm your password"
                className="border border-gray-300 p-2 rounded placeholder:text-xs"
              />
            )}
          />
        </div>
        <p className="text-gray-500 text-sm mb-4">Use 8 or more characters with a mix of letters, numbers & symbols</p>
        <button
          type="submit"
          className="w-full py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
        >
          Log in
        </button>
      </form>
      {isModalVisible && <Modal message={modalMessage} onClose={handleNavigate} />}
    </div>
  );
}

export default SignUpForm;
