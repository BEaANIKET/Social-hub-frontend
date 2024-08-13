import toast from "react-hot-toast";

export const initializeSocketListeners = (
  socket,
  setAllPosts,
  setUserProfile,
  userProfile,
  allPosts
) => {
  const handlePostLike = (data) => {
    try {
      setAllPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === data.postId
            ? { ...post, likes: [...post.likes, data.userId] }
            : post
        )
      );

      // Update user profile posts
      if (userProfile) {
        setUserProfile((prevProfile) => ({
          ...prevProfile,
          userPosts: prevProfile.userPosts.map((post) =>
            post._id === data.postId
              ? { ...post, likes: [...post.likes, data.userId] }
              : post
          ),
        }));
      }
    } catch (error) {
      console.error("Error handling postLike:", error);
      toast.error("An error occurred while liking the post.");
    }
  };

  const handlePostDisliked = (data) => {
    try {
      setAllPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === data.postId
            ? { ...post, likes: post.likes.filter((id) => id !== data.userId) }
            : post
        )
      );

      // Update user profile posts
      if (userProfile) {
        setUserProfile((prevProfile) => ({
          ...prevProfile,
          userPosts: prevProfile.userPosts.map((post) =>
            post._id === data.postId
              ? {
                  ...post,
                  likes: post.likes.filter((id) => id !== data.userId),
                }
              : post
          ),
        }));
      }
    } catch (error) {
      console.error("Error handling postDisliked:", error);
      toast.error("An error occurred while disliking the post.");
    }
  };

  const handlePostDeleted = (data) => {
    try {
      setAllPosts((prevPosts) =>
        prevPosts.filter((post) => post._id !== data.postId)
      );

      // Update user profile posts
      if (userProfile) {
        setUserProfile((prevProfile) => ({
          ...prevProfile,
          userPosts: prevProfile.userPosts.filter(
            (post) => post._id !== data.postId
          ),
        }));
      }
    } catch (error) {
      console.error("Error handling postDeleted:", error);
      toast.error("An error occurred while deleting the post.");
    }
  };

  const handlePostComment = (data) => {
    try {
      setAllPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === data.postId
            ? {
                ...post,
                comments: [...post.comments, data.comment],
              }
            : post
        )
      );

      // Update user profile posts
      if (userProfile) {
        setUserProfile((prevProfile) => ({
          ...prevProfile,
          userPosts: prevProfile.userPosts.map((post) =>
            post._id === data.postId
              ? {
                  ...post,
                  comments: [...post.comments, data.comment],
                }
              : post
          ),
        }));
      }
    } catch (error) {
      console.error("Error handling postComment:", error);
      toast.error("An error occurred while adding a comment.");
    }
  };

  const handlePostCreated = (data) => {
    try {
      if (allPosts) {
        setAllPosts((prevPosts) => [...prevPosts, data.post]);
      }
      if (userProfile) {
        setUserProfile((prevProfile) => ({
          ...prevProfile,
          userPosts: [...prevProfile.userPosts, data.post],
        }));
      }
    } catch (error) {
      console.error("Error handling postCreated:", error);
      toast.error("An error occurred while creating a post.");
    }
  };

  const handleFollowing = (data) => {
    console.log(data);
    
    if (userProfile && data.following === userProfile.user._id) {
      setUserProfile((prev) => ({
        ...prev,
        user: {
          ...prev.user,
          followers: [...prev.user.followers, data.follower],
        },
      }));
    }
  };

  const handleUnFollowing = (data) => {
    if (userProfile) {
      if (userProfile && data.following === userProfile.user._id) {
        setUserProfile((prev) => ({
          ...prev,
          user: {
            ...prev.user,
            followers: prev.user.followers.filter((UiD) => UiD !== data.follower),
          },
        }));
      }
    }
  };

  // Listen for socket events
  socket?.on("postLike", handlePostLike);
  socket?.on("postDisliked", handlePostDisliked);
  socket?.on("postDeleted", handlePostDeleted);
  socket?.on("postComment", handlePostComment);
  socket?.on("createPost", handlePostCreated);
  socket?.on("newFollow", handleFollowing);
  socket?.on("unfollow", handleUnFollowing);

  return () => {
    // Clean up socket listeners
    socket?.off("postLike", handlePostLike);
    socket?.off("postDisliked", handlePostDisliked);
    socket?.off("postDeleted", handlePostDeleted);
    socket?.off("postComment", handlePostComment);
    socket?.off("createPost", handlePostCreated);
    socket?.off("newFollow", handleFollowing);
    socket?.off("unfollow", handleUnFollowing);
  };
};
