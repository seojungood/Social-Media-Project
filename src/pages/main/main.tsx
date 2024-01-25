import {getDocs, collection} from 'firebase/firestore';
import {db} from '../../config/firebase';
import { useEffect, useState } from 'react';
import { Post } from './post';

// Interface holding types of input for Post 
export  interface Post {
  id: string;
  userId: string;
  title: string;
  username: string;
  description: string;
}

export const Main = () =>{
  // PostsList will be Post[] or null 
  const [postsList, setPostsList] = useState<Post[] | null >(null);
  // Reference to collection of posts in db
  const postsRef = collection(db, "posts");

  // Gets all posts from the db through postsRef
  const getPosts = async () =>{
    const data = await getDocs(postsRef);
    //Set PostsList as array of info from data.doc 
    setPostsList(data.docs.map((doc)=>({
      ...doc.data(), id: doc.id
    })) as Post[] );
  };

  // Gets all posts when site is rendered
  useEffect(()=>{
    getPosts();
  }, []);

  return (
    <div className='mainpage'>
      {postsList?.map((post) => <Post post={post}/>)}
    </div>
  );
};

export const postsRef = collection(db, "posts");
