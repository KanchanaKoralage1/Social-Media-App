import React from 'react';
import HomeIcon from '@mui/icons-material/Home';
import ExploreIcon from '@mui/icons-material/Explore';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MessageIcon from '@mui/icons-material/Message';
import ListAltIcon from '@mui/icons-material/ListAlt';
import GroupIcon from '@mui/icons-material/Group';
import VerifiedIcon from '@mui/icons-material/Verified';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PendingIcon from '@mui/icons-material/Pending';

export const NavigationMenu = [
    {
        title: "Home",
        icon: React.createElement(HomeIcon),  
        path: "/home"
    },
    {
        title: "Explore",
        icon: React.createElement(ExploreIcon),
        path: "/explore"
    },
    {
        title: "Notifications",
        icon: React.createElement(NotificationsIcon),
        path: "/notifications"
    },
    {
        title: "Message",
        icon: React.createElement(MessageIcon),
        path: "/message"
    },
    {
        title: "Lists",
        icon: React.createElement(ListAltIcon),
        path: "/lists"
    },
    {
        title: "Communities",
        icon: React.createElement(GroupIcon),
        path: "/communities"
    },
    {
        title: "Verification",
        icon: React.createElement(VerifiedIcon),
        path: "/verification"
    },
    {
        title: "Profile",
        icon: React.createElement(AccountCircleIcon),
        path: "/profile"
    },
    {
        title: "More",
        icon: React.createElement(PendingIcon),
        path: "/more"
    }
];
