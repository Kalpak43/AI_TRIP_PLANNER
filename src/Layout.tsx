import Navbar from "./components/Navbar";
import { Outlet } from "react-router";
import { Toaster } from "./components/ui/toaster";

function Layout() {
  return (
    <>
      <Navbar />
      <Outlet />
      <Toaster />
    </>
  );
}

export default Layout;
