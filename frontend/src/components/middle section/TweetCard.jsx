import React ,{useState}from "react";
import RepeatIcon from "@mui/icons-material/Repeat";
import { Avatar, Button } from "@mui/material";
import ProfileImage from "../../assets/profile.png";
import UserImage from "../../assets/user.jpeg";
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

function TweetCard() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const[openReplyModal,setOpenReplyModal]=useState(false);
  const handleOpenReplyModel = () => setOpenReplyModal(true);
  const handleCloseReplyModal = () => setOpenReplyModal(false);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };



  const handleDeleteTweet = () => {
    console.log("delete tweet");
    handleClose();
  };

  const navigate = useNavigate();

  // const handleOpenReplyModel=()=>{
  //   console.log("Open model")
  // }

  const handleCreateRetweet=()=>{
    console.log("handle create retweet")
  }

  const handleLikeTweet=()=>{
    console.log("handle like tweet")
  }

  return (
    <React.Fragment>
      {/* <div className='flex items-center font-semibold text-gray-700 py-2'>
            <RepeatIcon/>
            <p>You retweet</p>
        </div> */}

      <div className="flex space-x-5">
        <Avatar
          onClick={() => navigate(`/profile/${6}`)}
          alt="username"
          src={ProfileImage}
          width={30}
          height={30}
          className="cursor-pointer"
        />
        <div className="w-full">
          <div className="flex justify-between items-center">
            <div className="flex cursor-pointer items-center space-x-2">
              <span className="font-semibold">Kanchana Koralage</span>
              <span className="text-gray-600">@kanchana .2m</span>
              <img src={Verified} alt="" className="ml-2 w-5 h-5" />
            </div>
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
                <MenuItem onClick={handleDeleteTweet}>Edit</MenuItem>
              </Menu>
            </div>


          </div>

          <div className="mt-2">
            <div className="cursor-pointer" onClick={()=>navigate(`/tweet/${3}`)}>
                <p className="mb-2 p-0">Twitter clone project</p>
                <img src={UserImage} alt="" className="w-[28rem] border border-gray-400 p-5 rounded-md"/>
            </div>
            <div className="py-5 flex flex-wrap justify-between items-center">

                <div className="space-x-3 flex items-center text-gray-600">
                    <ChatBubbleOutlineIcon className="cursor-pointer" onClick={handleOpenReplyModel}/>
                    <p>43</p>
                </div>

                <div className={`${true? "text-pink-600":"text-gray-600"} space-x-3 flex items-center`}>
                    <RepeatIcon onClick={handleCreateRetweet} className="cursor-pointer"/>
                    <p>43</p>
                </div>

                <div className={`${true? "text-pink-600":"text-gray-600"} space-x-3 flex items-center`}>
                    {true? <FavoriteIcon onClick={handleLikeTweet} className="cursor-pointer"/>:<FavoriteBorderIcon onClick={handleLikeTweet} className="cursor-pointer"/>}
                    <p>43</p>
                </div>

                <div className="space-x-3 flex items-center text-gray-600">
                    <BarChartIcon className="cursor-pointer" onClick={handleOpenReplyModel}/>
                    <p>43</p>
                </div>

                <div className="space-x-3 flex items-center text-gray-600">
                    <FileUploadIcon className="cursor-pointer" onClick={handleOpenReplyModel}/>
                    <p>43</p>
                </div>

            </div>
          </div>
        </div>
      </div>

      <section>
        <ReplyModal open={openReplyModal} handleClose={handleCloseReplyModal}/>
      </section>

    </React.Fragment>
  );
}

export default TweetCard;
