import {useForm} from 'react-hook-form';
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';
import {addDoc, collection} from 'firebase/firestore';
import {db, auth} from '../../config/firebase';
import {useAuthState} from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';

// Interface to specify types of input for TS
interface CreateFormData {
  title: string;
  description: string;
}

export const CreateForm = () =>{
  // Grabs user information from FB
  const [user] = useAuthState(auth);

  const navigate = useNavigate();


  // Schema specifying title and description content format
  const schema = yup.object().shape({
    title: yup.string().required("Title Required"),
    description: yup.string(),
  });

  // Register using the schema created above
  // handleSubmit to be called when form is submitted
  const {register, handleSubmit, formState:{errors}} = useForm<CreateFormData>({
    resolver: yupResolver(schema),
  });

  // Reference to collection of posts in db
  const postsRef = collection(db, "posts");

  // Called when form submitted
  const onCreatePost = async (data: CreateFormData) =>{
    await addDoc(postsRef, {
      ...data,
      username: user?.displayName,
      userId: user?.uid,
    })
    //Navigate back to homepage
    navigate('/');
  };

  return (
    <form onSubmit={handleSubmit(onCreatePost)}>
      <input placeholder='Title...' {...register("title")}/>
      <p style={{color: "red"}}>{errors.title?.message}</p>
      <textarea placeholder='Description...'{...register("description")}/>
      <input type="submit" className='submitForm' />
    </form>
  );
};