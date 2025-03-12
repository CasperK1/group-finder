import { useContext } from 'react';
import InputField from './InputField';
import PasswordField from './PasswordField';
import { useNavigate } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';
import { apiService } from '../../services/api/apiService';
import { AuthContext } from '../../provider/AuthProvider';
import { useDispatch } from 'react-redux';
import { setUserData } from '../../redux/reducer/userDataSlice';
import { toast } from 'react-toastify'; 

function Form() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { login } = useContext(AuthContext);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const response = await apiService.auth.handleLogin(data);
    if (!response) {
      console.error('Error: Invalid response or token missing.');
      toast.error('Login failed. Please try again.');
    } else {
      localStorage.setItem('jwtToken', response.token);
      dispatch(setUserData(response));
      login(response);
      console.log('Token saved successfully.');
      navigate('/');
      toast.success('Logged in successfully!');
    }
  };

  // Error callback for when validation fails.
  const onError = (errors) => {
    if (errors.email) {
      toast.error(errors.email.message);
    }
    if (errors.password) {
      toast.error(errors.password.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit, onError)}>
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
            <InputField {...field} type="text" label="Email address or username" placeholder="Enter your email" />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>
        )}
      />

      <Controller
        name="password"
        control={control}
        rules={{
          required: 'Password is required',
        }}
        render={({ field }) => (
          <div>
            <PasswordField {...field} />
            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
          </div>
        )}
      />

      <div className="flex items-center mb-4">
        <input type="checkbox" className="mr-2" />
        <label className="text-gray-700">Remember me</label>
      </div>

      <button
        type="submit"
        className="w-full py-2 bg-gray-600 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600"
      >
        Login
      </button>
    </form>
  );
}

export default Form;