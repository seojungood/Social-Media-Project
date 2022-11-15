import {useForm} from 'react-hook-form';
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';
import {addDoc, collection} from 'firebase/firestore';
import {db, auth} from '../../config/firebase';
import {useAuthState} from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
// Imports for uploading image
import {storage} from '../../config/firebase';
import {ref} from 'firebase/storage';
import {v4} from 'uuid';

// Interface to specify types of input for TS
interface CreateFormData {
  title: string;
  description: string;
}

export const CreateForm = () =>{
  // Grabs user information from FB
  const [user] = useAuthState(auth);
  // Grab useNavigate to implement automatic link navigation
  const navigate = useNavigate();
  // Grab images using useState 
  const [imageUpload, setImageUpload] = useState<File | null >(null);


  // Schema specifying title and description content format
  const schema = yup.object().shape({
    // Title requires some string, if no input is made, throws message
    title: yup.string().required("Title Required"),
    // Description takes in some string, but not required for input
    description: yup.string(),
  });

  // Register using the schema created above
  // handleSubmit to be called when form is submitted
  const {register, handleSubmit, formState:{errors}} = useForm<CreateFormData>({
    resolver: yupResolver(schema),
  });

  // Reference to collection of posts in db
  const postsRef = collection(db, "posts");

  // Called when form is submitted
  const onCreatePost = async (data: CreateFormData) =>{
    // adds the post to the doc with all posts
    await addDoc(postsRef, {
      ...data,
      username: user?.displayName,
      userId: user?.uid,
    })
    //Navigate back to homepage
    navigate('/');
  };

  const uploadImage = () =>{
    // If imageuploaded is null, just return nothing
    if(imageUpload == null) return;
    
    const imageRef = ref(storage, `posts/${imageUpload.name + v4()}`);

  };

  return (
    <form onSubmit={handleSubmit(onCreatePost)}>
      <input placeholder='Title...' {...register("title")}/>
      <p style={{color: "white"}}>{errors.title?.message}</p>
    
      <input 
        type='file' 
        onChange={(event) => {
          setImageUpload(event.target.files![0])
        }} 
      />
      <button onClick={uploadImage}>Upload Image</button>

      <textarea placeholder='Description...'{...register("description")}/>
      <input type="submit" className='submitForm' />
    </form>
  );
};