import {auth, provider} from '../config/firebase';
import {signInWithPopup} from 'firebase/auth';
import {useNavigate}  from 'react-router-dom';

export const Login = () =>{

  const navigate = useNavigate();

  // Sign in with google on popup window
  const signInWithGoogle = async () =>{
    const result = await signInWithPopup(auth, provider);
    // Once logged in, redirected to home page
    navigate('/');
  }

  return (
    <div className='loginPage'>
        <img src='./img/googlelogo.png'/>
        <button onClick={signInWithGoogle}> Sign In With Google </button>
    </div>
  );
}