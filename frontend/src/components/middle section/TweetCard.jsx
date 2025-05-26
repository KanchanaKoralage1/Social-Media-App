import React, { useState } from "react";
import RepeatIcon from "@mui/icons-material/Repeat";
import { Avatar, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Verified from "../../assets/verified.png";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import BarChartIcon from '@mui/icons-material/BarChart';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ReplyModal from "./ReplyModal";
import { deletePost } from "../../services/postService";

function TweetCard({ post, onPostDeleted }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [openReplyModal, setOpenReplyModal] = useState(false);
  const [liked, setLiked] = useState(false);
  const [retweeted, setRetweeted] = useState(false);
  const navigate = useNavigate();

  const handleOpenReplyModel = () => setOpenReplyModal(true);
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
      console.error('Error deleting post:', err);
    }
  };

  const handleCreateRetweet = () => {
    setRetweeted(!retweeted);
    console.log("Retweet post:", post.id);
  };

  const handleLikeTweet = () => {
    setLiked(!liked);
    console.log("Like post:", post.id);
  };

  const currentUser = JSON.parse(localStorage.getItem('user')) || {};

  return (
    <React.Fragment>
      {retweeted && (
        <div className='flex items-center font-semibold text-gray-700 py-2'>
          <RepeatIcon />
          <p>You retweeted</p>
        </div>
      )}

      <div className="flex space-x-5">
        <Avatar
          onClick={() => navigate(`/profile/${post.user.username}`)}
          alt={post.user.username}
          src={post.user.profileImage || undefined}
          width={30}
          height={30}
          className="cursor-pointer"
        />
        <div className="w-full">
          <div className="flex justify-between items-center">
            <div className="flex cursor-pointer items-center space-x-2">
              <span className="font-semibold">{post.user.fullName}</span>
              <span className="text-gray-600">@{post.user.username} · {new Date(post.createdAt).toLocaleTimeString()}</span>
              {post.user.verified && <img src={Verified} alt="" className="ml-2 w-5 h-5" />}
            </div>
            {currentUser.username === post.user.username && (
              <div>
                <Button
                  id="basic-button"
                  aria-controls={open ? "basic-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
                  onClick={handleClick}
                >
                  <MoreHorizIcon />
                </Button>
                <Menu
                  id="basic-menu"
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  MenuListProps={{
                    "aria-labelledby": "basic-button",
                  }}
                >
                  <MenuItem onClick={handleDeleteTweet}>Delete</MenuItem>
                  <MenuItem onClick={() => console.log('Edit post:', post.id)}>Edit</MenuItem>
                </Menu>
              </div>
            )}
          </div>

          <div className="mt-2">
            <div className="cursor-pointer" onClick={() => navigate(`/tweet/${post.id}`)}>
              <p className="mb-2 p-0">{post.content}</p>
              
              {post.imageUrl && post.imageUrl.length > 0 && (
                // CHANGED: Dynamic layout based on image count
                <div className="max-w-[600px]">
                  {post.imageUrl.length === 1 ? (
                    // Single image: full size
                    <img
                      src={post.imageUrl[0]}
                      alt="Post"
                      className="w-full max-w-[600px] h-auto border border-gray-400 p-1 rounded-md object-contain"
                      onError={(e) => console.error('Image failed to load:', post.imageUrl[0])}
                    />
                  ) : (
                    // 2 or more images: grid layout
                    <div className={`grid ${post.imageUrl.length >= 3 ? 'grid-cols-2 grid-rows-2' : 'grid-cols-2'} gap-1`}>
                      {post.imageUrl.slice(0, post.imageUrl.length >= 4 ? 3 : post.imageUrl.length).map((url, index) => (
                        <div key={index} className="relative">
                          <img
                            src={url}
                            alt="Post"
                            className="w-full h-[150px] border border-gray-400 p-1 rounded-md object-cover"
                            onError={(e) => console.error('Image failed to load:', url)}
                          />
                          {/* CHANGED: +1 overlay for 4+ images */}
                          {post.imageUrl.length >= 4 && index === 2 && (
                            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white text-lg font-bold rounded-md">
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
            <div className="py-5 flex flex-wrap justify-between items-center">
              <div className="space-x-3 flex items-center text-gray-600">
                <ChatBubbleOutlineIcon className="cursor-pointer" onClick={handleOpenReplyModel} />
                <p>8</p>
              </div>

              <div className={`${retweeted ? "text-blue-600" : "text-gray-600"} space-x-3 flex items-center`}>
                <RepeatIcon onClick={handleCreateRetweet} className="cursor-pointer" />
                <p>{retweeted ? 5 : 0}</p>
              </div>

              <div className={`${liked ? "text-red-600" : "text-gray-600"} space-x-3 flex items-center`}>
                {liked ? (
                  <FavoriteIcon onClick={handleLikeTweet} className="cursor-pointer" />
                ) : (
                  <FavoriteBorderIcon onClick={handleLikeTweet} className="cursor-pointer" />
                )}
                <p>{liked ? 10 : 0}</p>
              </div>

              <div className="space-x-3 flex items-center text-gray-600">
                <BarChartIcon className="cursor-pointer" />
                <p>12</p>
              </div>

              <div className="space-x-3 flex items-center text-gray-600">
                <FileUploadIcon className="cursor-pointer" />
                <p>3</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section>
        <ReplyModal open={openReplyModal} handleClose={handleCloseReplyModal} />
      </section>
    </React.Fragment>
  );
}

export default TweetCard;