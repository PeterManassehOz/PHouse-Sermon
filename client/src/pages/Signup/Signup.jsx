import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import './Signup.css'
import { useRegisterUserMutation } from '../../redux/userAuthApi'
import { toast } from 'react-toastify'



const Signup = () => {
  const schema = yup.object().shape({
    username: yup.string().required(),
    email: yup.string().email().required(),
    phcode: yup.string().required(),
    password: yup.string().min(6).required(),
    confirmPassword: yup.string().oneOf([yup.ref('password'), null]),
    terms: yup.boolean().oneOf([true], 'You must agree to the terms and conditions')
  })

  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(schema) });
  const [registerUser, { isLoading }] = useRegisterUserMutation();
  const navigate = useNavigate();



  const onSubmit = async (data) => {
    try {
      const response = await registerUser(data).unwrap();
      localStorage.setItem('token', response.token);
      localStorage.setItem('phcode', data.phcode); // Store phcode in localStorage

      if (!response.user.profileCompleted) {
        navigate('/profile');  // Redirect to complete profile
      } else {
        navigate('/home'); // Redirect to home
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.data?.message || "Registration failed");
    }
  };



  return (
    <div className="signup">
      <form className='signup-form' onSubmit={handleSubmit(onSubmit)}>
        <h2>Sign up</h2>
        <input className='form-input' type="text" placeholder='Username' {...register("username")} />
        <input className='form-input' type="email" placeholder='Email' {...register("email")} />
        <input className='form-input' type="text" placeholder='PH Code' {...register("phcode")} />
        <input className='form-input' type="password" placeholder='Password' {...register("password")} />
        <input className='form-input' type="password" placeholder='Confirm Password' {...register("confirmPassword")} />
        {errors.confirmPassword && <p className="error">{errors.confirmPassword.message}</p>}

        <div className='form-checkbox'>
          <input className='signup-checkbox' type="checkbox" {...register("term", { required: true })} />
          <span className='checkbox-text'>Agree to terms and conditions</span>
        </div>
        <button className='form-button' type="submit" disabled={isLoading}>
          {isLoading ? "Signing up..." : "Sign up"}
        </button>
        <div className='signup-forgot'>
          Have an account? <span><Link to="/login">Log in</Link></span>
        </div>
      </form>
    </div>
  );
};

export default Signup;