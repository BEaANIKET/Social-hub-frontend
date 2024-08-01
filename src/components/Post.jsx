import React, { useContext, useEffect, useState } from 'react';
import { userContext } from '../App';
import '../App.css';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export const Post = ({ postData }) => {
  const [comments, setComments] = useState(postData.comments);
  const [newComment, setNewComment] = useState('');
  const [liked, setLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [countLikes, setCountLikes] = useState(postData.likes.length);
  const [likeLoading, setLikeLoading] = useState(false);
  const [dislikeLoading, setDislikeLoading] = useState(false);
  const [commentLoading, setCommentLoading] = useState(false);

  const { state } = useContext(userContext);
  const navigate = useNavigate();

  useEffect(() => {
    const userLiked = postData.likes.some((like) => like === state?.id);
    setLiked(userLiked);
    setCountLikes(postData.likes.length);
  }, [state, postData.likes]);

  const handleLike = async () => {
    if (likeLoading) return;
    setLikeLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_URL}/api/like`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ postId: postData._id }),
        credentials: 'include',
      });

      const data = await response.json();
      if (response.status === 200) {
        setLiked(true);
        setCountLikes(countLikes + 1);
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error("An error occurred while liking the post.");
    } finally {
      setLikeLoading(false);
    }
  };

  const handleDisLike = async () => {
    if (dislikeLoading) return;
    setDislikeLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_URL}/api/unlike`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ postId: postData._id }),
        credentials: 'include',
      });

      const data = await response.json();
      if (response.status === 200) {
        setLiked(false);
        setCountLikes(countLikes - 1);
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error("An error occurred while disliking the post.");
    } finally {
      setDislikeLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (commentLoading || newComment.trim() === '') return;
    setCommentLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_URL}/api/comment`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: newComment,
          postId: postData._id,
        }),
        credentials: 'include',
      });

      const data = await response.json();
      if (response.status === 200) {
        setComments([...comments, data.comment]);
        setNewComment('');
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error("An error occurred while adding a comment.");
    } finally {
      setCommentLoading(false);
    }
  };

  const handleUserProfileClick = () => {
    if (postData.postedBy._id === state?.id) {
      navigate('/profile');
    } else {
      navigate(`/profile/${postData.postedBy._id}`);
    }
  };

  const toggleComments = () => {
    setShowComments(!showComments);
  };

  return (
    <div className="max-w-md mx-auto bg-[#FFFF] rounded-lg shadow-md overflow-hidden w-fit my-4">
      <div onClick={handleUserProfileClick} className="p-4 flex items-center cursor-pointer">
        <img
          className="h-12 w-12 rounded-full object-cover"
          src={postData.postedBy.image}
          alt={postData.postedBy.name}
        />
        <div className="ml-4">
          <div className="text-lg font-semibold">{postData?.postedBy?.name}</div>
          <div className="text-sm text-gray-500">{postData.title}</div>
        </div>
      </div>
      <img className="h-auto w-full object-cover" src={postData.image} alt={postData.title} />
      <div className="p-4">
        <p className="text-gray-700">{postData.body}</p>
        <div className="mt-4 flex items-center">
          {liked ? (
            <button
              onClick={handleDisLike}
              disabled={dislikeLoading}
              className="text-black hover:text-indigo-700 focus:outline-none"
            >
              ❤️ Like {countLikes}
            </button>
          ) : (
            <button
              onClick={handleLike}
              disabled={likeLoading}
              className="text-black hover:text-indigo-700 focus:outline-none"
            >
              🤍 Like {countLikes}
            </button>
          )}
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
                    src={comment.postedBy.image}
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
                disabled={commentLoading}
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
