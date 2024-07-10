import React, { useContext, useEffect, useState } from 'react';
import { userContext } from '../App';
import Swal from 'sweetalert2'
import '../App.css'
import { useNavigate } from 'react-router-dom';

export const Post = ({ postData }) => {
  const [likes, setLikes] = useState(0);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [liked, setLiked] = useState(false)
  const [showComments, setShowComments] = useState(false);
  const Navigate = useNavigate()

  const { state, dispatch } = useContext(userContext)

  useEffect(() => {
    setLikes(postData.likes.length)
    setComments(postData?.comments)
    const userLiked = postData.likes.some(like => like === state?.id)
    setLiked(userLiked)
  }, [state])

  const handleLike = async () => {
    try {
      if (!state) {
        Swal.fire({
          position: "top-end",
          title: "User must be login ",
          showConfirmButton: false,
          width: '300px',
          timer: 1500,
          customClass: {
            popup: 'custom-swal-background'
          }
        });
        return
      }
      setLiked(true)

      const response = await fetch(`${import.meta.env.VITE_URL}/api/like`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          postId: postData._id
        }),
        credentials: 'include'
      })

      const data = await response.json();
      if (response.ok) {
        setLikes(data.updatedData.likes.length)
      }

    } catch (error) {
      console.log("errro during likes ", error);
    }
  };


  const handleDisLike = async () => {

    if (!state) {
      Swal.fire({
        position: "top-end",
        title: "User must be login ",
        showConfirmButton: false,
        width: '300px',
        timer: 1500,
        customClass: {
          popup: 'custom-swal-background'
        }
      });
      return
    }
    setLiked(false)
    try {
      const response = await fetch(`${import.meta.env.VITE_URL}/api/unlike`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          postId: postData._id
        }),
        credentials: 'include'
      })

      const data = await response.json();
      if (response.ok) {
        setLikes(data.updatedData.likes.length)
      }

    } catch (error) {
      console.log("errro during likes ", error);
    }
  };
  // console.log(postData);

  const handleAddComment = async () => {
    if (newComment.trim() === '') {
      return
    }

    if (!state) {
      Swal.fire({
        position: "top-end",
        title: "User must be login ",
        showConfirmButton: false,
        width: '300px',
        timer: 1500,
        customClass: {
          popup: 'custom-swal-background'
        }
      });
      return
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_URL}/api/comment`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: newComment,
          postId: postData._id
        }),
        credentials: 'include'
      })

      const data = await response.json()

      if (response.ok) {
        setComments(data.updatedData.comments)
      }

    } catch (error) {
      console.log("comment error ", error);
    }

  };


  const handleUserProfileClick = async () => {
    console.log(postData.postedBy._id, state.id);
    if(postData.postedBy._id === state?.id){
      console.log("sdjfksdsfs");
      Navigate('/profile')
    }
    else{
      Navigate(`/profile/${postData.postedBy._id}`)
    }
  }


  const toggleComments = () => {
    setShowComments(!showComments);
  };
 

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden  w-fit my-4">
      <div onClick={handleUserProfileClick} className="p-4 flex items-center cursor-pointer">
        <img
          className="h-12 w-12 rounded-full object-cover"
          src={`https://avatars.dicebear.com/api/initials/${postData.postedBy.name}.svg`}
          alt={postData.postedBy.name}
        />
        <div className="ml-4">
          <div className="text-lg font-semibold">{postData?.postedBy?.name}</div>
          <div className="text-sm text-gray-500">{postData.title}</div>
        </div>
      </div>
      <img className=" h-auto w-full  object-cover" src={postData.image} />
      <div className="p-4">
        <p className="text-gray-700">{postData.body}</p>
        <div className="mt-4 flex items-center">

          {
            liked ? (
              <button
                disabled={!liked}
                onClick={handleDisLike}
                className="text-black hover:text-indigo-700 focus:outline-none"
              >
                ❤️ Like {likes}
              </button>
            ) : (
              <button
                disabled={liked}
                onClick={handleLike}
                className="text-black hover:text-indigo-700 focus:outline-none"
              >
                🤍 Like {likes}
              </button>
            )
          }
          <button
            onClick={toggleComments}
            className="ml-2 text-black hover:text-indigo-700 focus:outline-none"
          >
            💬 Comments
          </button>
        </div>
        {showComments && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold">Comments</h3>
            <div className="mt-2 space-y-2">
              {comments.map((comment, index) => (
                <div key={index} className="flex items-center mb-2">
                  <img
                    className="h-8 w-8 rounded-full object-cover mr-2"
                    src={`https://avatars.dicebear.com/api/initials/${comment.postedBy.name}.svg`}
                    alt={comment.postedBy.name}
                  />
                  <div>
                    <p className="text-sm font-semibold">{comment.postedBy.name}</p>
                    <p className="text-sm text-gray-700">{comment.text}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex">
              <input
                type="text"
                className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Add a comment"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <button
                onClick={handleAddComment}
                className="ml-2 bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Comment
              </button>
            </div>
          </div>
        )}
      </div>
    </div>

  );
};

