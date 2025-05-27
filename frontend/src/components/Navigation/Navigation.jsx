import React, { useEffect, useState } from "react";
import ImageIcon from "../../assets/twitter.png";
import { NavigationMenu } from "./NavigationMenu";
import { useNavigate } from "react-router-dom";
import { Avatar, Button } from "@mui/material";
import ProfileImage from "../../assets/profile.png";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { logout } from "../../services/authService";
import { getProfile } from "../../services/profileService";

function Navigation() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    profileImage: null
  });
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

 useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Get user from localStorage
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
          setUserData(prev => ({
            ...prev,
            username: user.username || 'User',
            email: user.email || 'user@example.com'
          }));
        }

        // Fetch profile data including profileImage
        const profile = await getProfile();
        console.log('Fetched profile for navigation:', profile); // Debug log
        if (profile && profile.profileImage) {
          setUserData(prev => ({
            ...prev,
            profileImage: profile.profileImage
          }));
        }
      } catch (error) {
        console.error('Failed to fetch profile for navigation:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout(); // This will clear localStorage
    navigate('/login');
    handleClose();
  };

  return (
    <>
      <div className="h-screen sticky top-0 ml-[-10px]">
        <div>
          <div className="py-5">
            <img
              src={ImageIcon}
              alt="navigation image"
              height={30}
              width={30}
            />
          </div>
        </div>

        <div className="space-y-6">
          {NavigationMenu.map((item) => (
            <div
              key={item.title}
              className="cursor-pointer flex space-x-3 items-center hover:bg-gray-100 rounded-full px-4 py-2"
              onClick={() =>
                item.title === "Profile"
                  ? navigate(`/profile/${userData.username}`)
                  : navigate(item.path)
              }
            >
              {item.icon}
              <p className="text-xl">{item.title}</p>
            </div>
          ))}
        </div>

        <div className="py-5">
        
        </div>

        <div className="flex items-center justify-between p-3 hover:bg-gray-100 rounded-full cursor-pointer">
          <div className="flex items-center space-x-3">
           <Avatar 
              alt={userData.username} 
              src={userData.profileImage || ProfileImage} 
              sx={{ width: 40, height: 40 }}
              onError={(e) => console.error('Navigation profile image failed to load:', userData.profileImage)}
            />
            <div className="flex flex-col">
              <span className="font-bold text-sm">{userData.username}</span>
              <span className="text-gray-500 text-sm">{userData.email}</span>
            </div>

            <Button
              id="basic-button"
              aria-controls={open ? "basic-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={handleClick}
              sx={{ minWidth: 'auto' }}
            >
              <MoreHorizIcon />
            </Button>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                "aria-labelledby": "basic-button"
              }}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </div>
        </div>
      </div>
    </>
  );
}

export default Navigation;