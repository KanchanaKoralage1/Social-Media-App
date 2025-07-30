import React from "react";
import Sidebar from "../navigation/Sidebar";
import RightSide from "../rightSide/RightSide";
import Header from "../navigation/Header";
import { Outlet} from "react-router-dom";


const Layout = ({ children }) => {
  return (
    <div className="flex h-screen relative">
      <Header />
      {/* Sidebar for desktop */}
      <div className="hidden md:block">
        <Sidebar />
      </div>


      {/* Main content + right sidebar */}

      <div className="flex flex-1">
        {/* Main content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4">
           <Outlet />
          {/* {children} */}
        </main>

        {/* RightSide for desktop */}
        <div className="hidden md:block">
          <RightSide />
        </div>
      </div>
      {/* All mobile hamburger menus and drawers are removed */}
    </div>
  );
};

export default Layout;