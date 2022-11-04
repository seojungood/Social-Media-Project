import { linkWithRedirect } from 'firebase/auth';
import { addDoc, getDocs, collection, query, where, deleteDoc, doc, getDoc} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../../config/firebase';
import { Post as IPost} from './main';

// Interface for types of components of Props
interface Props {
  post: IPost;
}

// Interface for types of components of Like 
interface Like{
  //Id of the like itself
  likeId: string;
  //Id of the user that liked the post
  userId: string;
}

export const Post = (props: Props)=>{
  const {post} = props;

  // Grabs user data from firebase
  const [user] = useAuthState(auth);

  // Likes will be Like[] or null 
  const [likes, setLikes] = useState<Like[] | null>(null);

  // Reference to collection of likes in db
  const likesRef = collection(db, "likes");

  // Gets doc of ids that liked the post 
  const likesDoc = query(likesRef, where("postId", "==", post.id));

  // Gets data of all posts that have been liked
  const getLikes = async () =>{
    const data = await getDocs(likesDoc);

    setLikes(data.docs.map((doc)=>({
      userId: doc.data().userId, 
      likeId: doc.id
    }))); 
  }

    // Adds userId that likes a post to doc
    const addLike = async () =>{
      // Catch errors while trying to addDoc
      try{
        // Add userId and postId to likesRef as a newDoc
        const newDoc = await addDoc(likesRef, {userId: user?.uid, postId: post.id});
        // Null check on user
        if(user){
          // adds the new like to the prev [] of likes 
          // or sets new like as [] if theres no prev likes
          setLikes((prev)=> prev ? 
            [...prev,{userId: user?.uid, likeId: newDoc.id}] 
            : [{userId: user?.uid, likeId: newDoc.id}]);
        }
      }
      // For errors while addDoc, just console log for now
      catch(err){
        console.log(err);
      }
    };

    // Remove/Unlike a post
    const removeLike = async () =>{
      // Catch errors for getDocs/query
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

        // Null check on user 
        if(user){
          // Filter through prev and get rid of the like that matches the likeId
          setLikes((prev)=> prev && prev.filter((like) => like.likeId !== likeId));
        }
      }
      // For errors while getDoc/query, just console log for now
      catch(err){
        console.log(err);
      }
    };

    // bool that checks if current user has liked the post
    const hasUserLiked = likes?.find((like)=> like.userId === user?.uid);

    // Get list of likes when page renders
    useEffect(()=>{
      getLikes();
    },[]);

    
  return (
    <div className='post'>
      <div className='title'> 
        <h1> {post.title} </h1>
      </div>
      <div className='body'>
        <p>{post.description}</p>
      </div>

      <div className='footer'>
        <p> @{post.username}</p>
        <div className='likes'>ß
          <button onClick={hasUserLiked ? removeLike :  addLike}> {hasUserLiked ? <>&#9829;</> : <>&#9825;</>} </button>
          {likes && <p> {likes?.length} likes </p>}
        </div>
      </div>
    </div>
  );
}