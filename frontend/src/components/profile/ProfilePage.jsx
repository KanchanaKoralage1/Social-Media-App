import React, { useState, useEffect } from 'react';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { useNavigate } from "react-router-dom";
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
import { getProfile } from '../../services/profileService';
import { getUserPosts } from '../../services/postService';

function ProfilePage() {
    const navigate = useNavigate();
    const [tabValue, setTabValue] = useState("1");
    const [openProfileModal, setOpenProfileModal] = useState(false);
    const [profile, setProfile] = useState({
        id: null,
        fullName: 'Kanchana Koralage',
        username: 'kanchana',
        bio: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
        location: 'SriLanka',
        website: 'Education',
        profileImage: null,
        backgroundImage: null,
        verified: false
    });
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const profileData = await getProfile();
                console.log('Fetched profile data:', profileData);
                if (profileData) {
                    setProfile(profileData);
                    if (profileData.id) {
                        const postsData = await getUserPosts(profileData.id);
                        setPosts(postsData);
                    }
                }
                setError(null);
            } catch (error) {
                console.error('Failed to fetch data:', error);
                setError('Failed to load profile or posts');
            }
        };
        fetchData();
    }, []);

    const handleProfileUpdate = async (updatedProfile) => {
        console.log('Updated profile data:', updatedProfile);
        setProfile(prev => ({
            ...prev,
            ...updatedProfile
        }));
        try {
            const data = await getProfile();
            console.log('Refetched profile data:', data);
            setProfile(data);
        } catch (error) {
            console.error('Failed to refetch profile:', error);
        }
    };

    const handleOpenProfileModel = () => setOpenProfileModal(true);
    const handleClose = () => setOpenProfileModal(false);
    const handleBack = () => navigate(-1);

    const handleFollowUser = () => {
        console.log("handle follow user");
    };

    const handleChange = (event, newValue) => {
        setTabValue(newValue);
        if (newValue === "4") {
            console.log("likes tweet");
        } else if (newValue === "1") {
            console.log("users tweet");
        }
    };

    const handlePostDeleted = (postId) => {
        setPosts(posts.filter(post => post.id !== postId));
    };

    return (
        <div className="border-x border-gray-100">
            <section className="z-50 flex items-center sticky top-0 bg-opacity-95 bg-white px-4">
                <KeyboardBackspaceIcon className="cursor-pointer" onClick={handleBack} />
                <h1 className="py-5 text-xl font-bold opacity-90 ml-5">{profile.fullName}</h1>
            </section>

            <section>
                {profile.backgroundImage ? (
                    <img
                        src={profile.backgroundImage}
                        alt="Background"
                        className="w-full h-[20rem] object-cover"
                        onError={(e) => console.error('Background image failed to load:', profile.backgroundImage)}
                    />
                ) : (
                    <div className="w-full h-[20rem] bg-gray-200" />
                )}
            </section>

            <section className="px-4">
                <div className="flex justify-between items-start mt-5 h-[5rem]">
                    <Avatar
                        alt={profile.username}
                        src={profile.profileImage || undefined}
                        sx={{ width: "10rem", height: "10rem", border: "4px solid white" }}
                        className="transform -translate-y-24"
                        onError={(e) => console.error('Profile image failed to load:', profile.profileImage)}
                    />
                    <Button
                        variant="contained"
                        onClick={handleOpenProfileModel}
                        sx={{ 
                            borderRadius: "20px",
                            backgroundColor: "#000000",
                        }}
                    >
                        Edit Profile
                    </Button>
                </div>

                <div>
                    <div className="flex items-center">
                        <h1 className="font-bold text-lg">{profile.fullName}</h1>
                        {profile.verified && (<img src={Verified} alt="Verified" className="ml-2 w-5 h-5" />)}
                    </div>
                    <h1 className="text-gray-500">@{profile.username}</h1>
                </div>

                <div className="mt-2 space-y-3">
                    <p>{profile.bio}</p>
                    <div className="py-1 flex space-x-5">
                        <div className="flex items-center text-gray-500">
                            <BusinessCenterIcon />
                            <p className="ml-2">{profile.website}</p>
                        </div>
                        <div className="flex items-center text-gray-500">
                            <LocationOnIcon />
                            <p className="ml-2">{profile.location}</p>
                        </div>
                        <div className="flex items-center text-gray-500">
                            <CalendarMonthIcon />
                            <p className="ml-2">Joined 2025 April</p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-5">
                        <div className="flex items-center space-x-1 font-semibold">
                            <span>100</span>
                            <span className="text-gray-500">followers</span>
                        </div>
                        <div className="flex items-center space-x-1 font-semibold">
                            <span>200</span>
                            <span className="text-gray-500">following</span>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-5 px-4">
                <Box sx={{ width: '100%', typography: 'body1' }}>
                    <TabContext value={tabValue}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <TabList onChange={handleChange} aria-label="profile tabs">
                                <Tab label="Tweets" value="1" />
                                <Tab label="Replies" value="2" />
                                <Tab label="Media" value="3" />
                                <Tab label="Likes" value="4" />
                            </TabList>
                        </Box>
                        <TabPanel value="1" sx={{ padding: 0 }}>
                            {error && <p className="text-red-500">{error}</p>}
                            {posts.length > 0 ? (
                                posts.map(post => (
                                    <TweetCard key={post.id} post={post} onPostDeleted={() => handlePostDeleted(post.id)} />
                                ))
                            ) : (
                                <p className="text-gray-500">No tweets yet.</p>
                            )}
                        </TabPanel>
                        <TabPanel value="2" sx={{ padding: 0 }}>Replies</TabPanel>
                        <TabPanel value="3" sx={{ padding: 0 }}>Media</TabPanel>
                        <TabPanel value="4" sx={{ padding: 0 }}>Likes</TabPanel>
                    </TabContext>
                </Box>
            </section>

            <section>
                <ProfileModal
                    handleClose={handleClose}
                    open={openProfileModal}
                    profile={profile}
                    onUpdateSuccess={handleProfileUpdate}
                />
            </section>
        </div>
    );
}

export default ProfilePage;