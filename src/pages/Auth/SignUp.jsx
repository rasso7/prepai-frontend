import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Input from '../../components/Inputs/Input';
import ProfilePhotoSelector from '../../components/Inputs/ProfilePhotoSelector';
import { validateEmail } from '../../utils/helper';
import { UserContext } from '../../contexts/UserContext';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import uploadImage from '../../utils/uploadImage';

const SignUp = ({setCurrentPage}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [profilePic, setProfilePic] = useState(null);

  const { updateUser } = useContext(UserContext);

  const handleSignUp = async (e) => {
    e.preventDefault();
    
    // Validation
    if(!fullName.trim()) { 
      setError('Please enter a full name'); 
      return;
    }
    if(!validateEmail(email)) {
      setError('Please enter a valid email address'); 
      return;
    }
    if(!password) { 
      setError('Please enter a password'); 
      return;
    }
    
    setError('');
    setIsLoading(true);

    try {
      let profileImageUrl = "";
      
      // Upload image only if profilePic exists
      if (profilePic) {
        try {
          const imgUploadRes = await uploadImage(profilePic);
          profileImageUrl = imgUploadRes.imageUrl || "";
        } catch (uploadError) {
          console.error('Image upload error:', uploadError);
          // Continue with signup even if image upload fails
          setError('Image upload failed, but continuing with signup...');
        }
      }

      // Proceed with signup regardless of image upload status
      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        name: fullName.trim(),
        email: email.trim(),
        password,
        profileImageUrl,
      });

      const { token } = response.data;

      if (token) {
        localStorage.setItem("token", token);
        updateUser(response.data);
        navigate('/dashboard');
      }

    } catch(error) {
      console.error('Signup error:', error);
      
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (error.message) {
        setError(error.message);
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='w-[90vw] md:w-[33vw] p-7 flex flex-col justify-center'>
      <h3 className="text-lg font-semibold text-black">
        Create an Account
      </h3>
      <p className="text-xs text-slate-700 mt-[5px] mb-6">
        Join us today by entering your details below
      </p>

      <form onSubmit={handleSignUp}>
        <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />
        
        <div className="grid grid-cols-1 md:grid-cols-1 gap-2">
          <Input
            label="Full Name" 
            type="text"
            placeholder="John Doe"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)} 
            required
            disabled={isLoading}
          />
          <Input
            label="Email Address" 
            type="email"  
            placeholder="user@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)} 
            required
            disabled={isLoading}
          />
          <Input
            label="Password" 
            type="password"
            placeholder="Min 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)} 
            required
            disabled={isLoading}
          />
        </div>

        {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}

        <button 
          type="submit" 
          className="btn-primary" 
          disabled={isLoading}
        >
          {isLoading ? 'Signing Up...' : 'Sign Up'}
        </button>

        <p className="text-[13px] text-slate-800 mt-3">
          Already have an account?{' '}
          <button 
            type="button"
            className="text-blue-600 font-medium underline cursor-pointer" 
            onClick={() => setCurrentPage('login')}
            disabled={isLoading}
          >
            Log In
          </button>
        </p>
      </form>
    </div>
  )
}

export default SignUp