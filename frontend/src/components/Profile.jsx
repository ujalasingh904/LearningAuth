import { useSelector } from "react-redux"
import { useRef, useState, useEffect } from "react"
import { app } from "../firebase";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'

const Profile = () => {
  const fileRef = useRef(null);
  const [image, setImage] = useState(undefined)
  const [percent, setPercent] = useState(0)
  const [imageError, setImageError] = useState(false)
  const [formData, setFormData] = useState({}); 
  const { currentUser } = useSelector((state) => state.user)

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

  const handleUpdate = async () => {
    try {
       // Update user profile
       console.log(currentUser.profilePicture = formData.profilePicture)
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>

      <form className="flex flex-col gap-4">
        <input type="file" ref={fileRef} hidden accept="image/*" onChange={(e) => setImage(e.target.files[0])} />

        <img src={formData.profilePicture || currentUser.profilePicture} alt="profile" className="h-24 w-24 self-center cursor-pointer rounded-full object-cover" onClick={() => fileRef.current.click()} />

        <p className="text-center">
          {imageError ? (<span className="text-red-500">Error Ocuured While Uploading (Image should be less than 2mb)</span>) : (percent > 0 && percent < 100) ? (<span className="text-red-500">{`Uploaded ${percent}%`}</span>) : (percent === 100) ? <span className="text-green-500">Image Uploaded successfully</span> : ''}
        </p>

        <input defaultValue={currentUser.username} type="text" id='username' placeholder="Username" className="bg-slate-100 p-3 rounded-md outline-none" />

        <input defaultValue={currentUser.email} type="email" id='email' placeholder="Email" className="bg-slate-100 p-3 rounded-md outline-none" />

        <input type="text" id='password' placeholder="Password" className="bg-slate-100 p-3 rounded-md outline-none" />

        <button
          onClick={handleUpdate}
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-90 disabled:opacity-60">update</button>
      </form>
      <div className="flex justify-between mt-5">
        <span className="text-red-500 cursor-pointer">Delete Account</span>
        <span className="text-red-500 cursor-pointer">Sign out</span>
      </div>
    </div>
  )
}

export default Profile
