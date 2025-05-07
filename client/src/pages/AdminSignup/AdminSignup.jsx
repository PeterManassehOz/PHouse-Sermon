import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import './AdminSignup.css'
import { useRegisterAdminMutation } from '../../redux/adminAttribute/adminAuthApi'
import { toast } from 'react-toastify'



const Signup = () => {
  const schema = yup.object().shape({
    username: yup.string().required(),
    email: yup.string().email().required(),
    password: yup.string().min(6).required(),
  })

  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(schema) });
  const [registerUser, { isLoading }] = useRegisterAdminMutation();
  const navigate = useNavigate();


  const onSubmit = async (data) => {
    try {
      const response = await registerUser(data).unwrap();
      localStorage.setItem('token', response.token);
     
        toast.success("Registration successful");
        navigate("/admin-dashboard");
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
        <input className='form-input' type="password" placeholder='Password' {...register("password")} />
        {errors.confirmPassword && <p className="error">{errors.confirmPassword.message}</p>}

       
        <button className='form-button' type="submit" disabled={isLoading}>
          {isLoading ? "Signing up..." : "Sign up"}
        </button>
        <div className='signup-forgot'>
          <span><Link to="/admin-login">Log in</Link></span>
        </div>
      </form>
    </div>
  );
};

export default Signup;