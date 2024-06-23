import React, { useState } from 'react';
import Swal from 'sweetalert2'
import '../App.css'

export const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  // const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState({
    message: "",
    show: false
  })

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError({
      message: "",
      show: false
    })


    if (!title || !description || !file) {
      setError({
        message: "All fields are required",
        show: true
      });
      return;
    }

    setLoading(true)

    try {
      // Create form data for the Cloudinary upload
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', import.meta.env.VITE_UPLOAD_PRESET);
      formData.append('cloud_name', import.meta.env.VITE_CLOUD_NAME);

      // Upload the image to Cloudinary
      const cloudinaryResponse = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData
      });

      const cloudinaryData = await cloudinaryResponse.json();
      const url = cloudinaryData.url;
      console.log(url);

      // Create post using the uploaded image URL
      const response = await fetch(`${import.meta.env.VITE_URL}/api/createpost`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title,
          body: description,
          url: url
        }),
        credentials: 'include'
      });

      const data = await response.json();
      console.log(data);

      // Reset form fields and state
      if (!response.ok) {
        setError({
          message: "An error occurred. Please try again later.",
          show: true
        });

        setLoading(false)
      }
      if (response.ok) {
        setTitle('');
        setDescription('');
        setFile(null);
        setError({
          message: "",
          show: false
        })
        
        Swal.fire({
          position: "top-end",
          title: "Post Created",
          showConfirmButton: false,
          width: '300px',
          timer: 1500,
          customClass: {
            popup: 'custom-swal-background'
          }
        });
      }
    } catch (err) {
      console.error(err);
      setError({
        message: "An error occurred. Please try again later.",
        show: true
      });
    } finally {
      setLoading(false)
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  return (
    <>
      <div className=' flex w-full item-center justify-center  '>
      <div className=" max-w-md mx-auto rounded-lg shadow-md overflow-hidden md:max-w-2xl my-4  w-full ">
      <form onSubmit={handleSubmit} className="p-6">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
            Title
          </label>
          <input
            type="text"
            id="title"
            className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
            About
          </label>
          <textarea
            id="description"
            className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Upload Photo
          </label>
          <div className="relative">
            <input
              type="file"
              className="hidden"
              id="file"
              onChange={handleFileChange}
              required
            />
            <label
              htmlFor="file"
              className="block border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline cursor-pointer text-center"
            >
              {file ? file.name : "Select File"}
            </label>
          </div>
        </div>
        {
          file &&
          <>
            <div className=' w-full flex justify-center items-center'>
              <img src={URL.createObjectURL(file)} className="w-auto h-[300px] " />
            </div>
          </>
        }
        {
          error.show && (
            <div className="text-red-500 text-xs italic w-full text-center ">{error.message}</div>
          )
        }
        <div className="flex items-center justify-center mt-4">

          {
            loading ? (
              <button
                className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                loading
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Create Post
              </button>
            )
          }


        </div>
      </form>
    </div>
      </div>
    </>
    
  );
};

