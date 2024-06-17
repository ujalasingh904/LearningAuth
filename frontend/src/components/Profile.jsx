import { useDispatch, useSelector } from "react-redux"
import { useRef, useState, useEffect } from "react"
import { app } from "../firebase";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import {
  updateUserStart, updateUserSuccess, updateUserFailure, deleteUserStart
  , deleteUserSuccess, deleteUserFailure ,signoutSuccess
} from '../redux/user/userSlice.js'
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const fileRef = useRef(null);
  const [image, setImage] = useState(undefined)
  const [percent, setPercent] = useState(0)
  const [imageError, setImageError] = useState(false)
  const [formData, setFormData] = useState({});
  const [Updated, setUpdated] = useState(false)
  const navigate = useNavigate()
  const { currentUser, loading, error } = useSelector((state) => state.user)
  const dispatch = useDispatch();
  console.log(currentUser)

  useEffect(() => {
    if (image) { 
      handleFileUpload(image);
    }

  }, [image])

  const handleFileUpload = async (image) => {
    const storage = getStorage(app)
    const fileName = new Date().getTime() + image.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, image);
    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setPercent(Math.round(progress))
      },
      (error) => {
        setImageError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => setFormData({ ...formData, profilePicture: downloadURL }));
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/users/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success === false) {
        // setError(true) 
        console.log(data);
        dispatch(updateUserFailure(data))
        return
      }
      dispatch(updateUserSuccess(data))
      setUpdated(true)
    } catch (err) {
      console.log(err)
      dispatch(updateUserFailure(err))

    }
  }


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }

  const handleDelete = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/users/delete/${currentUser._id}`, {
        method: 'DELETE',
      });

      const data = await res.json();
      console.log(data)
      if (data.success === false) {
        dispatch(deleteUserFailure(data))
        return;
      }

      dispatch(deleteUserSuccess())
      navigate('/')

    } catch (error) {
      console.log(error)
      dispatch(deleteUserFailure(error))
    }
  }

  const handleSignout = async () => {
    try {
      await fetch('/api/auth/signout')
      dispatch(signoutSuccess())
      navigate('/')
    } catch (error) {
      console.log(error)
    }

  }

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input type="file" ref={fileRef} hidden accept="image/*" onChange={(e) => setImage(e.target.files[0])} />

        <img src={formData.profilePicture || currentUser.profilePicture} alt="profile" className="h-24 w-24 self-center cursor-pointer rounded-full object-cover" onClick={() => fileRef.current.click()} />

        <p className="text-center">
          {imageError ? (<span className="text-red-500">Error Ocuured While Uploading (Image should be less than 2mb)</span>) : (percent > 0 && percent < 100) ? (<span className="text-red-500">{`Uploaded ${percent}%`}</span>) : (percent === 100) ? <span className="text-green-500">Image Uploaded successfully</span> : ''}
        </p>

        <input defaultValue={currentUser.username} type="text" id='username' placeholder="Username" className="bg-slate-100 p-3 rounded-md outline-none" onChange={handleChange} />

        <input defaultValue={currentUser.email} type="email" id='email' placeholder="Email" className="bg-slate-100 p-3 rounded-md outline-none" onChange={handleChange} />

        <input type="text" id='password' placeholder="Password" className="bg-slate-100 p-3 rounded-md outline-none" onChange={handleChange} />

        <button
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-90 disabled:opacity-60">{loading ? 'Loading...' : 'update'}</button>
      </form>

      <div className="flex justify-between mt-5">
        <span className="text-red-500 cursor-pointer" onClick={handleDelete}>Delete Account</span>
        <span className="text-red-500 cursor-pointer" onClick={handleSignout}>Sign out</span>
      </div>
      <p className="text-red-500  mt-5 font-bold">{error && 'Something Went Wrong'}</p>
      <p className="text-green-500   mt-5 font-bold">{Updated && 'User Updated Successfully'}</p>
    </div>
  )
}

export default Profile
