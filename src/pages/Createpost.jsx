import React, { useState } from 'react';
import Swal from 'sweetalert2';
import '../App.css';
import { useAppContext } from '../context/Appcontext';
import { Cloudinary } from '@cloudinary/url-gen';
import { auto } from '@cloudinary/url-gen/actions/resize';
import { autoGravity } from '@cloudinary/url-gen/qualifiers/gravity';
import { AdvancedImage } from '@cloudinary/react';
import toast from 'react-hot-toast';

const cld = new Cloudinary({ cloud: { cloudName: import.meta.env.VITE_CLOUD_NAME } });

export const CreatePost = () => {
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({
    message: '',
    show: false
  });
  const { allPosts, setAllPosts } = useAppContext();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError({
      message: '',
      show: false
    });

    if (description.length > 280) {
      setError({
        message: 'Text exceeds 280 characters',
        show: true
      });
      return;
    }

    setLoading(true);

    try {
      let url = '';
      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', import.meta.env.VITE_UPLOAD_PRESET);

        const cloudinaryResponse = await fetch(
          `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUD_NAME}/image/upload`,
          {
            method: 'POST',
            body: formData
          }
        );

        const cloudinaryData = await cloudinaryResponse.json();
        url = cloudinaryData.secure_url;
        console.log(url);
        

        // Apply transformations after uploading the image
        const img = cld
          .image(cloudinaryData.public_id)
          .format('auto')
          .quality('auto')
          .resize(auto().gravity(autoGravity()).width(500).height(500));

        url = img.toURL(); // Get the transformed image URL
      }
      console.log(url);
      

      // Create post using the uploaded and transformed image URL
      const response = await fetch(`${import.meta.env.VITE_URL}/api/createpost`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
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
          message: 'An error occurred. Please try again later.',
          show: true
        });

        setLoading(false);
      }
      if (response.ok) {
        setDescription('');
        setFile(null);
        setError({
          message: '',
          show: false
        });

        Swal.fire({
          position: 'top-end',
          title: 'Post Created',
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
        message: 'An error occurred. Please try again later.',
        show: true
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  return (
    <div className='flex w-full justify-center'>
      <div className='max-w-md mx-auto rounded-lg shadow-md overflow-hidden md:max-w-2xl my-4 w-full'>
        <form onSubmit={handleSubmit} className='p-6'>
          <div className='mb-4'>
            <textarea
              id='description'
              className='border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-[270px] '
              placeholder='Description'
              value={description}
              maxLength='280'
              onChange={(e) => setDescription(e.target.value)}
            />
            <div className={`text-right mt-2 ${description.length > 280 ? 'text-red-500' : 'text-gray-500'}`}>
              {description.length}/280
            </div>
          </div>
          <div className='mb-4'>
            <label className='block text-gray-700 text-sm font-bold mb-2'>
              Attach Photo
            </label>
            <div className='relative'>
              <input
                type='file'
                className='hidden'
                id='file'
                onChange={handleFileChange}
              />
              <label
                htmlFor='file'
                className='block border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline cursor-pointer text-center'
              >
                {file ? file.name : 'Select File'}
              </label>
            </div>
          </div>
          {file && (
            <div className='w-full flex justify-center items-center'>
              <img
                src={URL.createObjectURL(file)}
                className='w-auto h-[300px]'
                alt='Uploaded Preview'
              />
            </div>
          )}
          {error.show && (
            <div className='text-red-500 text-xs italic w-full text-center '>
              {error.message}
            </div>
          )}
          <div className='flex items-center justify-center mt-4'>
            {loading ? (
              <button className='bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'>
                Loading
              </button>
            ) : (
              <button
                type='submit'
                className='bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
              >
                Create Post
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
