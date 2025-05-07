import { Link, useNavigate } from 'react-router-dom'
import './AdminLogin.css'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useLoginAdminMutation } from '../../redux/adminAttribute/adminAuthApi'
import { toast } from 'react-toastify'



const Login = () => {
    const schema = yup.object().shape({
      email: yup.string().required(),
      password: yup.string().min(6).required(),
    })
    

    const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(schema) });
    const [loginAdmin, { isLoading }] = useLoginAdminMutation();
    const navigate = useNavigate();
    
  
    const onSubmit = async (data) => {
      try {
        const response = await loginAdmin(data).unwrap();
        if (response?.token) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('isAdmin', JSON.stringify(response.admin?.isAdmin || false)); 
        }

        console.log(response);

        toast.success("Login successful");
  
        setTimeout(() => {
          navigate("/admin-dashboard");
        }, 100);
  
      } catch (error) {
        console.error(error);
        toast.error(error?.data?.message || "Login failed");
      }
    };
    

    
  return (
    <div className="login">
      <form onSubmit={handleSubmit(onSubmit)} className='login-form'>
        <h2>Admin Login</h2>
        <input className='form-input' type="text" placeholder='Email' {...register("email", { required: true })}/>
        <input className='form-input' type="password" placeholder='Password' {...register("password", { required: true })}/>

                
        {Object.keys(errors).length > 0 && (
          <p className="error">Please fill out all required fields correctly.</p>
        )}

        <button className='form-button' type="submit" disabled={isLoading}>
          {isLoading ? "Logging in..." : "Log in"}
        </button>
        
        <div className='signup-reset'>
          <div className='login-forgot'>Don&apos;t have an account? <span><Link to="/admin-signup">Sign up</Link></span> </div>
          <div className='password-reset'>Forgot password? <span><Link to="/forgot-password">Reset</Link></span></div>
        </div>
      </form>
    </div>
  )
}

export default Login



