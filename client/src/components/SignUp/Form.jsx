import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';
import { apiService } from '../../services/api/apiService';
import { toast } from 'react-toastify';

function SignUpForm() {
  const navigate = useNavigate();
  const { control, handleSubmit } = useForm();
  // Remove modal state if you no longer need a modal notification.
  const [showPassword, setShowPassword] = useState(false);

  // This onSubmit is called only when validation passes.
  const onSubmit = async (data) => {
    const response = await apiService.auth.handleRegister(data);
    if (!response) {
      // Display error notification if registration failed
      toast.error('Registration failed. Please try again.');
      console.error('Error: Invalid response or token missing.');
    } else {
      // Display success notification
      toast.success('Registration successful!');
      // Optionally navigate to the login page after a short delay
      setTimeout(() => navigate('/login'), 2000);
    }
  };

  // This onError callback handles validation errors by showing a toast for each error.
  const onError = (errors) => {
    // Loop over each error and display its message.
    Object.values(errors).forEach((err) => {
      toast.error(err.message);
    });
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit, onError)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-black">
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
        <div className="mb-4 text-black">
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
        <div className="mb-4 text-black">
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-black">
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
            name="confirm Password"
            control={control}
            rules={{
              required: 'Please confirm your password',
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
        <p className="text-gray-500 text-sm mb-4">
          Use 8 or more characters with a mix of letters, numbers & symbols
        </p>
        <button
          type="submit"
          className="w-full py-2 bg-gray-600 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600"
        >
          Sign up
        </button>
      </form>
    </div>
  );
}

export default SignUpForm;
