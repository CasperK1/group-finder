import React from 'react';
import InputField from './InputField';
import PasswordField from './PasswordField';
import { Controller, useForm } from 'react-hook-form';
import apiService from '../../services/api/apiService';

function Form() {
  const { control, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    console.log("Form Submitted:", data);
    const response = apiService.handleSiggIn(data)
    if(response === null){
      console.error("Error: Invalid response or token missing.");
    } else {
      localStorage.setItem("SavedToken",response.data.token);
      console.log("Token saved successfully.");
      navigator("/")
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
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
          <div>
            <InputField
              {...field}
              type="text"
              label="Email address or user name"
              placeholder="Enter your email or username"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>
        )}
      />

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
          <div>
            <PasswordField
              {...field}
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>
        )}
      />

      <div className="flex items-center mb-4">
        <input type="checkbox" className="mr-2" />
        <label className="text-gray-700">Remember me</label>
      </div>

      <button
        type="submit"
        className="w-full py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
      >
        Log in
      </button>
    </form>
  );
}

export default Form;
