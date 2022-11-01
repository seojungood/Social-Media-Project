import { Link } from "react-router-dom";
import { auth } from '../config/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import {signOut} from 'firebase/auth';

export const Navbar = () =>{
  const [user] = useAuthState(auth);

  // Function to signout from current user
  const signUserOut = async () =>{
    await signOut(auth);
  }

  return (
    <div className="navbar">
      <div className="links">
        <Link to="/"> Home </Link>
        {!user ? <Link to="/login"> Login </Link> : 
        <Link to="/createpost"> Create Post </Link>
        }
      </div>
    {/* Display Profile name and picture */}
      <div className="user">
        {/* Only display when logged in */}
        {user &&(
            <>
              <p>{user?.displayName} </p>
              <img src={user?.photoURL || ""} />
              <button onClick={signUserOut}> Log Out </button>
            </>
          )}
      </div>
    </div>
  );
}