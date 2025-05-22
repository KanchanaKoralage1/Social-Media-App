import React from "react";
import ImageIcon from "../../assets/twitter.png";
import { NavigationMenu } from "./NavigationMenu";
import { useNavigate } from "react-router-dom";
import { Avatar, Button } from "@mui/material";
import ProfileImage from "../../assets/profile.png";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

function Navigation() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    console.log("logout");
    handleClose();
  };

  const navigate = useNavigate();

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
              className="cursor-pointer flex space-x-3 items-center "
              onClick={() =>
                item.title === "Profile"
                  ? navigate(`/profile/${5}`)
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
            }}
          >
            Tweet
          </Button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar alt="username" src={ProfileImage} width={30} height={30} />
            <div>
              <span>Kanchana Koralage</span>
              <br />
              <span className="opacity-70">kanchana@gmail.com</span>
            </div>

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
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </div>
        </div>
      </div>
    </>
  );
}

export default Navigation;
