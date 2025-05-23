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

function Navigation() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [userData, setUserData] = useState({
    username: '',
    email: ''
  });
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setUserData({
        username: user.username || 'User',
        email: user.email || 'user@example.com'
      });
    }
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
      <div className="h-screen sticky top-0">
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

        <div className="py-10">
          <Button
            sx={{
              width: "100%",
              borderRadius: "29px",
              py: "15px",
              backgroundColor: "#000000",
              color: "white",
              "&:hover": {
                backgroundColor: "#333333"
              }
            }}
          >
            Tweet
          </Button>
        </div>

        <div className="flex items-center justify-between p-3 hover:bg-gray-100 rounded-full cursor-pointer">
          <div className="flex items-center space-x-3">
            <Avatar 
              alt={userData.username} 
              src={ProfileImage} 
              sx={{ width: 40, height: 40 }}
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