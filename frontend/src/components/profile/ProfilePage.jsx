import React, { useState } from 'react';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { useNavigate } from "react-router-dom";
import ProfileImage from "../../assets/profile.png";
import { Avatar, Button } from "@mui/material";
import Verified from "../../assets/verified.png";
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import TweetCard from '../middle section/TweetCard';
import ProfileModal from './ProfileModal';


function ProfilePage() {

    const navigate=useNavigate();
    const[tabValue, setTabValue]=useState("1");

    const[openProfileModal,setOpenProfileModal]=useState(false);

    const handleOpenProfileModel = () => setOpenProfileModal(true);
    const handleClose = () => setOpenProfileModal(false);

    const handleBack=()=>navigate(-1)

    // const handleOpenProfileModel=()=>{
    //     console.log("open profile model")
    // }

    const handleFollowUser=()=>{
        console.log("handle follow user")
    }

    const handleChange=(event,newValue)=>{
        
        setTabValue(newValue)

        if(newValue===4){
            console.log("likes tweet")
        }
        else if(newValue===1){
            console.log("users tweet")
        }
    }

  return (
    <div className='ml-[-90px] '>
      <section className={`z-50 flex items-center sticky top-0 bg-opacity-95 ml-[-20px] bg-white`}>

        <KeyboardBackspaceIcon className='cursor-pointer' onClick={handleBack}/>
        <h1 className='py-5 text-xl font-bold opacity-90 ml-5'>Kanchana Koralage</h1>

      </section>

      <section>
        <img src="https://cdn.pixabay.com/photo/2020/03/13/23/33/trees-4929310_1280.jpg" alt="" className='w-[100%] h-[20rem] object-cover '/>
      </section>

      <section className='pl-6'>
        <div className='flex justify-between items-start mt-5 h-[5rem]'>
        <Avatar
          alt="username"
          src={ProfileImage}
          sx={{width:"10rem",
          height:"10rem",
          border:"4px solid white"}}
          className='transform -translate-y-24'
        />

        {true?<Button variant="contained" onClick={handleOpenProfileModel} sx={{borderRadius:"20px"}}>Edit Profile</Button>:
        <Button variant="contained" onClick={handleFollowUser} sx={{borderRadius:"20px"}}>{true?"Follow":"Unfollow"}</Button>}
        
        </div>

        <div>
            <div className='flex items-center'>
                <h1 className='font-bold text-lg'>Kanchana Koralage</h1>
                {true &&(<img src={Verified} alt="" className="ml-2 w-5 h-5" />)}
            </div>

            <h1 className='text-gray-500'>@kanchana</h1>
        </div>

        <div className='mt-2 space-y-3'>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
            <div className='oy-1 flex space-x-5'>
                <div className='flex ir=tems-center text-gray-500'>
                    <BusinessCenterIcon/>
                    <p className='ml-2'>Education</p>
                </div>
                <div className='flex ir=tems-center text-gray-500'>
                    <LocationOnIcon/>
                    <p className='ml-2'>SriLanka</p>
                </div>
                <div className='flex ir=tems-center text-gray-500'>
                    <CalendarMonthIcon/>
                    <p className='ml-2'>Joined 2025 April</p>
                </div>
            </div>

            <div className='flex items-center space-x-5'>
                <div className='flex items-center space-x-1 font-semibold'>
                    <span>100</span>
                    <span className='text-gray-500'>followers</span>
                </div>
                <div className='flex items-center space-x-1 font-semibold'>
                    <span>200</span>
                    <span className='text-gray-500'>following</span>
                </div>
            </div>
        </div>
      </section>

      <section className='py-5'>

      <Box sx={{ width: '100%', typography: 'body1' }}>
      <TabContext value={tabValue}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="Tweets" value="1" />
            <Tab label="Replies" value="2" />
            <Tab label="Media" value="3" />
            <Tab label="Likes" value="4" />
          </TabList>
        </Box>
        <TabPanel value="1">{[1,1,1,1].map((item)=><TweetCard/>)}</TabPanel>
        <TabPanel value="2">Replies</TabPanel>
        <TabPanel value="3">Media</TabPanel>
        <TabPanel value="4">Likes</TabPanel>
      </TabContext>
    </Box>
      </section>

      <section>
        <ProfileModal handleClose={handleClose} open={openProfileModal}/>
      </section>
    </div>
  )
}

export default ProfilePage
