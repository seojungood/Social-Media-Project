import { linkWithRedirect } from 'firebase/auth';
import { addDoc, getDocs, collection, query, where, deleteDoc, doc, getDoc} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../../config/firebase';
import { Post as IPost} from './main';

interface Props {
  post: IPost;
}

interface Like{
  likeId: string;
  userId: string;
}

export const Post = (props: Props)=>{
  const{post} = props;
  const [user] = useAuthState(auth);

  const [likes, setLikes] = useState<Like[] | null>(null);

    // Reference to collection of likes in db
    const likesRef = collection(db, "likes");

    // Gets doc of ids that liked the post 
    const likesDoc = query(likesRef, where("postId", "==", post.id));

    // Gets all docs with likesDoc 
    const getLikes = async () =>{
      const data = await getDocs(likesDoc);
      setLikes(data.docs.map((doc)=>({
        userId: doc.data().userId, 
        likeId: doc.id
      }))); 
    }

    // Adds userId that likes a post to doc
    const addLike = async () =>{
      try{
        const newDoc = await addDoc(likesRef, {userId: user?.uid, postId: post.id});
        if(user){
          setLikes((prev)=> prev ? 
            [...prev,{userId: user?.uid, likeId: newDoc.id}] 
            : [{userId: user?.uid, likeId: newDoc.id}]);
        }
      }
      catch(err){
        console.log(err);
      }
    };

    const removeLike = async () =>{
      try{

        //Query to get likeId
        const likeToDeleteQuery = query(likesRef, 
          where("postId", "==", post.id),
          where("userId", "==", user?.uid));

        // Data from the like query 
        const likeToDeleteData = await getDocs(likeToDeleteQuery);

        // Id of like
        const likeId = likeToDeleteData.docs[0].id

        // Putting the like inside doc 
        const likeToDelete = doc(db, "likes", likeId);

        // Delete the like from doc
        await deleteDoc(likeToDelete);

        if(user){
          setLikes((prev)=> prev && prev.filter((like) => like.likeId !== likeId));
        }
      }
      catch(err){
        console.log(err);
      }
    };

    // Checks if current user has liked the post
    const hasUserLiked = likes?.find((like)=> like.userId === user?.uid);

    useEffect(()=>{
      getLikes();
    },[]);

    
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
        <button onClick={hasUserLiked ? removeLike :  addLike}> {hasUserLiked ? <>&#9829;</> : <>&#9825;</>} </button>
        {likes && <p> Likes: {likes?.length} </p>}
      </div>
    </div>
  );
}