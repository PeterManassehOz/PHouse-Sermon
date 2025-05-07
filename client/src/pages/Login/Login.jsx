import { Link, useNavigate } from 'react-router-dom'
import './Login.css'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useLoginUserMutation } from '../../redux/userAuthApi'
import { profileUpdateApi } from '../../redux/profileUpdateApi'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'



const Login = () => {
    const schema = yup.object().shape({
      phcode: yup.string().required(),
      password: yup.string().min(6).required(),
      term: yup.boolean().oneOf([true], "You must agree to the terms"),
    })
    

    const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(schema) });
    const [loginUser, { isLoading }] = useLoginUserMutation();
    const navigate = useNavigate();
    const dispatch = useDispatch(); 
  
    const onSubmit = async (data) => {
      try {
        const response = await loginUser(data).unwrap();
        localStorage.setItem('token', response.token);
        localStorage.setItem('phcode', data.phcode); // Store phcode in localStorage
  
        dispatch(profileUpdateApi.util.invalidateTags(['Profile'])); // Invalidate old profile data
        if (!response.user.profileCompleted) {
          navigate('/profile');
        } else {
          navigate('/home');
        }
      } catch (error) {
        console.error(error);
        toast.error(error?.data?.message || "Login failed");
      }
    };

    
  return (
    <div className="login">
      <form onSubmit={handleSubmit(onSubmit)} className='login-form'>
        <h2>Log in</h2>
        <input className='form-input' type="text" placeholder='PH Code' {...register("phcode", { required: true })}/>
        <input className='form-input' type="password" placeholder='Password' {...register("password", { required: true })}/>
                
        {Object.keys(errors).length > 0 && (
          <p className="error">Please fill out all required fields correctly.</p>
        )}

        <div className='form-checkbox'>
          <input className='login-checkbox' type="checkbox" {...register("term", { required: true })} />
          <span className='checkbox-text'>Agree to terms and conditions</span>
        </div>

        <button className='form-button' type="submit" disabled={isLoading}>
          {isLoading ? "Logging in..." : "Log in"}
        </button>
        
        <div className='signup-reset'>
          <div className='login-forgot'>Don&apos;t have an account? <span><Link to="/">Sign up</Link></span> </div>
          <div className='password-reset'>Forgot password? <span><Link to="/forgot-password">Reset</Link></span></div>
        </div>
      </form>
    </div>
  )
}

export default Login