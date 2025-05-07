import './resetPassword.css';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { useResetPasswordMutation } from '../../redux/userAuthApi';
import { toast } from 'react-toastify';
import { FaArrowLeft } from 'react-icons/fa';
import PropTypes from 'prop-types';
import { useEffect } from 'react';

const ResetPassword = ({ onBack }) => {
  const schema = yup.object().shape({
    phcode: yup.string().required('PH Code is required'),
    password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref('password'), null], 'Passwords must match')
      .required('Please confirm your password'),
  });

  const { register, handleSubmit, formState: { errors }, setValue, reset } = useForm({ resolver: yupResolver(schema) });
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  
    useEffect(() => {
      const storedPHCode = localStorage.getItem('phcode'); // Get email from localStorage
      if (storedPHCode) {
        setValue('phcode', storedPHCode); // Set the phcode field
        console.log('PH Code from localStorage:', storedPHCode);
      }
    }, [setValue]);
  

  const onSubmit = async (data) => {
    try {
      const response = await resetPassword(data).unwrap();
      localStorage.setItem('token', response.token);
      reset();
      toast.success('Password reset successful');
    } catch (error) {
      console.error(error);
      toast.error('Password reset failed');
    }
  };

  return (
    <div className="reset-container">
      {onBack && (
        <button className="back-button" onClick={onBack}>
          <FaArrowLeft />
        </button>
      )}
      <form className="reset-form" onSubmit={handleSubmit(onSubmit)}>
        <h2 className="reset-title">Create New Password</h2>
        
        <input 
          type="text" 
          className={`reset-input ${errors.phcode ? 'input-error' : ''}`} 
          placeholder="PH Code" 
          {...register('phcode')}
          readOnly
        />
        {errors.phcode && <p className="error-message">{errors.phcode.message}</p>}

        <input
          className={`reset-input ${errors.password ? 'input-error' : ''}`}
          type="password"
          placeholder="New Password"
          {...register('password')}
        />
        {errors.password && <p className="error-message">{errors.password.message}</p>}

        <input
          className={`reset-input ${errors.confirmPassword ? 'input-error' : ''}`}
          type="password"
          placeholder="Confirm Password"
          {...register('confirmPassword')}
        />
        {errors.confirmPassword && <p className="error-message">{errors.confirmPassword.message}</p>}

        <button className="reset-button" type="submit" disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Reset Password'}
        </button>
      </form>
    </div>
  );
};

// Add PropTypes validation
ResetPassword.propTypes = {
  onBack: PropTypes.func, // Change to optional if needed
};

export default ResetPassword;
