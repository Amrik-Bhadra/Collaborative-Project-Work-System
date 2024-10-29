import React, { useState, useEffect, useContext } from 'react';
import './Form.css';
import { Button, Input, useToast } from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext'; // Import AuthContext
import logo from '../../../public/logo-white.png';
import { toast } from "react-hot-toast";

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext); // Get login function from context

  const submitForm = (e) => {
    e.preventDefault();

    if (email === '' || password === '') {
      alert('Please fill in all fields');
    } else {
      setIsSubmitted(true);
    }
  };

  useEffect(() => {
    if (isSubmitted) {
      const formData = { email, password };
      axios.post('http://localhost:3000/userAuthen/loginSubmission', formData)
        .then(response => {
          if (response.data.token && response.data.id) {
            // Store both token and userId in the context
            login(response.data.token, response.data.id);
            toast.success('Logged In Successfully!');
            navigate('/home'); // Redirect to home
          } else {
            toast.error('Failed to Login!');
          }
        })
        .catch(error => {
          console.error('Error submitting form:', error);
          toast.error('Failed to Login!');
        })
        .finally(() => {
          setIsSubmitted(false);
        });
    }
  }, [isSubmitted, email, password, login, navigate]);

  return (
    <main className='main-container'>
      <div className="form-container">
        {/* logo box */}
        <div className="logo-box" style={{height: "3rem", display: "flex" , alignItems: "center", gap:"0 0.6rem", marginBottom:"1rem"}}>
          <img src={logo} alt="logo-dark" style={{height: "2.5rem", borderRight: "1px solid #eee", paddingRight:"0.5rem"}} />
          <p style={{color: "#eee", fontSize:"1rem", fontWeight: "500"}}>Code Share</p>
        </div>

        <h1>Login Form</h1>
        <form onSubmit={submitForm}>
          <Input
            name="email"
            type='email'
            placeholder='Email Id'
            size='md'
            variant='outline'
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="password-box">
            <Input
              name="password"
              type='password'
              placeholder='Password'
              size='md'
              variant='outline'
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Button size='md' type='submit'>Login</Button>
        </form>
        <p className='formPara'>
          Don't Have Account?{' '}
          <span>
            <Link to='/registration'>Register</Link>
          </span>
        </p>
      </div>
    </main>
  );
};

export default LoginForm;
