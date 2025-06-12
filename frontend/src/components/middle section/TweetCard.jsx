import React, { useState } from "react";
import RepeatIcon from "@mui/icons-material/Repeat";
import { Avatar, Paper, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Verified from "../../assets/verified.png";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import BarChartIcon from "@mui/icons-material/BarChart";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import FavoriteIcon from "@mui/icons-material/Favorite";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ReplyModal from "./ReplyModal";
import { deletePost, likePost } from "../../services/postService";

function TweetCard({ post, onPostDeleted, onUpdatePost }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [openReplyModal, setOpenReplyModal] = useState(false);
  const [liked, setLiked] = useState(post.isLiked || false);
  const [likesCount, setLikesCount] = useState(post.likes || 0);
  const [retweeted, setRetweeted] = useState(post.retweets > 0);
  const [retweetsCount, setRetweetsCount] = useState(post.retweets || 0);
  const [commentsCount, setCommentsCount] = useState(post.comments || 0);
  const [viewsCount, setViewsCount] = useState(post.views || 0);
  const navigate = useNavigate();

  const handleOpenReplyModal = () => setOpenReplyModal(true);
  const handleCloseReplyModal = () => setOpenReplyModal(false);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDeleteTweet = async () => {
    try {
      await deletePost(post.id);
      onPostDeleted();
      handleClose();
    } catch (err) {
      console.error("Error deleting post:", err);
      alert("Failed to delete post. Please try again.");
    }
  };

  const handleCreateRetweet = () => {
    // Placeholder: Backend doesn't support retweets
    setRetweeted(!retweeted);
    setRetweetsCount((prevCount) => (retweeted ? prevCount - 1 : prevCount + 1));
    console.log("Retweet post:", post.id);
  };

  const handleLikeTweet = async () => {
    try {
      if (!post.id) {
        throw new Error("Invalid post ID");
      }
      const response = await likePost(post.id);
      setLiked(response.liked);
      setLikesCount((prevCount) => (response.liked ? prevCount + 1 : prevCount - 1));
    } catch (error) {
      console.error("Error liking post:", error.response ? error.response.data : error.message);
      alert("Failed to like/unlike post. Please try again.");
    }
  };

  const handleCommentAdded = () => {
    setCommentsCount((prevCount) => prevCount + 1);
    if (typeof onUpdatePost === "function") {
      onUpdatePost({ ...post, comments: commentsCount + 1 });
    } else {
      console.warn("onUpdatePost is not a function. Post list not updated.");
    }
  };

  const currentUser = JSON.parse(localStorage.getItem("user")) || {};

  return (
    <React.Fragment>
      {retweeted && (
        <div className="flex items-center font-semibold text-gray-600 py-2 pl-4 mb-2">
          <RepeatIcon className="text-green-500 mr-2" />
          <p className="text-sm">You retweeted</p>
        </div>
      )}

      <Paper
        elevation={8}
        className="p-6 bg-white/80 backdrop-blur-lg border border-white/20 hover:bg-white/90 transition-all duration-300"
        sx={{
          borderRadius: "20px",
          background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
          "&:hover": {
            boxShadow: "0 15px 35px -5px rgba(0, 0, 0, 0.15)",
            transform: "translateY(-2px)",
          },
        }}
      >
        <div className="flex space-x-4">
          <div className="flex flex-col items-center">
            <Avatar
              onClick={() => navigate(`/profile/${post.user.username}`)}
              alt={post.user.username}
              src={post.user.profileImage || undefined}
              sx={{
                width: 48,
                height: 48,
                cursor: "pointer",
                border: "2px solid rgba(59, 130, 246, 0.2)",
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  transform: "scale(1.05)",
                  borderColor: "rgba(59, 130, 246, 0.4)",
                },
              }}
            />
          </div>

          <div className="w-full">
            <div className="flex justify-between items-start">
              <div className="flex cursor-pointer items-center space-x-2 mb-2">
                <span className="font-semibold text-gray-900 hover:text-blue-600 transition-colors duration-200">
                  {post.user.fullName}
                </span>
                <span className="text-gray-500 text-sm">
                  @{post.user.username} · {new Date(post.createdAt).toLocaleTimeString()}
                </span>
                {post.user.verified && <img src={Verified} alt="verified" className="ml-2 w-5 h-5" />}
              </div>

              {currentUser.username === post.user.username && (
                <div>
                  <IconButton
                    id="basic-button"
                    aria-controls={open ? "basic-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? "true" : undefined}
                    onClick={handleClick}
                    sx={{
                      color: "#6b7280",
                      "&:hover": { backgroundColor: "rgba(59, 130, 246, 0.1)" },
                    }}
                  >
                    <MoreHorizIcon />
                  </IconButton>
                  <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    MenuListProps={{
                      "aria-labelledby": "basic-button",
                    }}
                    PaperProps={{
                      sx: {
                        borderRadius: "12px",
                        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                      },
                    }}
                  >
                    <MenuItem
                      onClick={handleDeleteTweet}
                      sx={{
                        color: "#ef4444",
                        "&:hover": { backgroundColor: "rgba(239, 68, 68, 0.1)" },
                      }}
                    >
                      <DeleteIcon sx={{ mr: 1, fontSize: 20 }} />
                      Delete
                    </MenuItem>
                    <MenuItem
                      onClick={() => console.log("Edit post:", post.id)}
                      sx={{
                        color: "#3b82f6",
                        "&:hover": { backgroundColor: "rgba(59, 130, 246, 0.1)" },
                      }}
                    >
                      <EditIcon sx={{ mr: 1, fontSize: 20 }} />
                      Edit
                    </MenuItem>
                  </Menu>
                </div>
              )}
            </div>

            <div className="mt-2">
              <div className="cursor-pointer" onClick={() => navigate(`/tweet/${post.id}`)}>
                <p className="mb-4 text-gray-800 leading-relaxed">{post.content}</p>

                {post.imageUrl && post.imageUrl.length > 0 && (
                  <div className="max-w-[600px] mb-4">
                    {post.imageUrl.length === 1 ? (
                      <img
                        src={post.imageUrl[0]}
                        alt="Post"
                        className="w-full max-w-[600px] h-auto rounded-2xl object-contain border border-gray-200"
                        onError={(e) => console.error("Image failed to load:", post.imageUrl[0])}
                      />
                    ) : (
                      <div
                        className={`grid ${post.imageUrl.length >= 3 ? "grid-cols-2 grid-rows-2" : "grid-cols-2"} gap-2`}
                      >
                        {post.imageUrl
                          .slice(0, post.imageUrl.length >= 4 ? 3 : post.imageUrl.length)
                          .map((url, index) => (
                            <div key={index} className="relative">
                              <img
                                src={url}
                                alt="Post"
                                className="w-full h-[150px] rounded-xl object-cover border border-gray-200"
                                onError={(e) => console.error("Image failed to load:", url)}
                              />
                              {post.imageUrl.length >= 4 && index === 2 && (
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-lg font-bold rounded-xl">
                                  +{post.imageUrl.length - 3}
                                </div>
                              )}
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                <div className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 cursor-pointer transition-colors duration-200 p-2 rounded-full hover:bg-blue-50">
                  <ChatBubbleOutlineIcon fontSize="small" onClick={handleOpenReplyModal} />
                  <span className="text-sm">{commentsCount}</span>
                </div>

                <div
                  className={`flex items-center space-x-2 cursor-pointer transition-colors duration-200 p-2 rounded-full ${
                    retweeted
                      ? "text-green-500 hover:text-green-600 hover:bg-green-50"
                      : "text-gray-500 hover:text-green-500 hover:bg-green-50"
                  }`}
                >
                  <RepeatIcon fontSize="small" onClick={handleCreateRetweet} />
                  <span className="text-sm">{retweetsCount}</span>
                </div>

                <div
                  className={`flex items-center space-x-2 cursor-pointer transition-colors duration-200 p-2 rounded-full ${
                    liked
                      ? "text-red-500 hover:text-red-600 hover:bg-red-50"
                      : "text-gray-500 hover:text-red-500 hover:bg-red-50"
                  }`}
                >
                  {liked ? (
                    <FavoriteIcon fontSize="small" onClick={handleLikeTweet} />
                  ) : (
                    <FavoriteBorderIcon fontSize="small" onClick={handleLikeTweet} />
                  )}
                  <span className="text-sm">{likesCount}</span>
                </div>

                <div className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 cursor-pointer transition-colors duration-200 p-2 rounded-full hover:bg-blue-50">
                  <BarChartIcon fontSize="small" />
                  <span className="text-sm">{viewsCount}</span>
                </div>

                <div className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 cursor-pointer transition-colors duration-200 p-2 rounded-full hover:bg-blue-50">
                  <FileUploadIcon fontSize="small" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Paper>

      <section>
        <ReplyModal
          open={openReplyModal}
          handleClose={handleCloseReplyModal}
          post={post}
          onCommentAdded={handleCommentAdded}
        />
      </section>
    </React.Fragment>
  );
}

export default TweetCard;