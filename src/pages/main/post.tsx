import { addDoc, collection } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../../config/firebase';
import { Post as IPost} from './main';

interface Props {
  post: IPost;
}

export const Post = (props: Props)=>{
  const{post} = props;
  const [user] = useAuthState(auth);

    // Reference to collection of posts in db
    const likesRef = collection(db, "likes");

    // Called when post is liked
    const addLike = async () =>{
      await addDoc(likesRef, {userId: user?.uid, postId: post.id});
    };

    
  return (
    <div>
      <div className='title'> 
        <h1> {post.title} </h1>
      </div>
      <div className='body'>
        <p>{post.description}</p>
      </div>

      <div className='footer'>
        <p> @{post.username}</p>
        <button onClick={addLike}> &#9825; </button>
      </div>
    </div>
  );
}