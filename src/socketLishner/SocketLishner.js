import Swal from "sweetalert2";

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
    } catch (error) {
      console.error("Error handling postLike:", error);
      Swal.fire("Error", "An error occurred while liking the post.", "error");
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
    } catch (error) {
      console.error("Error handling postDisliked:", error);
      Swal.fire("Error", "An error occurred while disliking the post.", "error");
    }
  };

  const handlePostDeleted = (data) => {
    try {
      setAllPosts((prevPosts) =>
        prevPosts.filter((post) => post._id !== data.postId)
      );
    } catch (error) {
      console.error("Error handling postDeleted:", error);
      Swal.fire("Error", "An error occurred while deleting the post.", "error");
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
    } catch (error) {
      console.error("Error handling postComment:", error);
      Swal.fire("Error", "An error occurred while adding a comment.", "error");
    }
  };

  const handlePostCreated = (data) => {
    console.log("data :", data);
    console.log("oldData : ", userProfile);

    try {
      if (allPosts) {
        setAllPosts((prevPosts) => [...prevPosts, data.post]);
      }
      if (userProfile) {
        setUserProfile((prev) => ({
          ...prev,
          userPosts: [...prev.userPosts, data.post],
        }));
      }
    } catch (error) {
      console.error("Error handling postCreated:", error);
      Swal.fire("Error", "An error occurred while creating a post.", "error");
    }
  };

  
  socket?.on("postLike", handlePostLike);
  socket?.on("postDisliked", handlePostDisliked);
  socket?.on("postDeleted", handlePostDeleted);
  socket?.on("postComment", handlePostComment);
  socket?.on("createPost", handlePostCreated);

  return () => {
    socket?.off("postLike", handlePostLike);
    socket?.off("postDisliked", handlePostDisliked);
    socket?.off("postDeleted", handlePostDeleted);
    socket?.off("postComment", handlePostComment);
    socket?.off("createPost", handlePostCreated);
  };
};
