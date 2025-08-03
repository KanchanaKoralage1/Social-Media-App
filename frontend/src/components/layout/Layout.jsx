import Sidebar from "../navigation/Sidebar";
import RightSide from "../rightSide/RightSide";
import Header from "../navigation/Header";
import { Outlet } from "react-router-dom";

const Layout = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      {/* Sidebar for desktop */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Main content + right sidebar */}
      <div className="flex flex-1 min-w-0">
        {/* Main content */}
        <main className="flex-1 overflow-y-auto bg-white dark:bg-gray-800 border-x border-gray-200 dark:border-gray-700">
          <div className="max-w-2xl mx-auto">
            <Outlet />
            {/* {children} */}
          </div>
        </main>

        {/* RightSide for desktop */}
        <div className="hidden lg:block">
          <RightSide />
        </div>
      </div>
    </div>
  );
};

export default Layout;
