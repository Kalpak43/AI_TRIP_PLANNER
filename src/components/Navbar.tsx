import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hook";
import { signOut } from "firebase/auth";
import { clearUser } from "@/features/auth/authSlice";
import { auth } from "@/firebaseConfig";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, User, LogOut } from "lucide-react";
import type React from "react";
import "../styles/custom.css";
import { Link, useLocation } from "react-router";

interface OptionType {
  title: string;
  link?: string;
  type: "link" | "button";
  action?: () => void;
  icon?: React.ReactNode;
}

function Navbar() {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      dispatch(clearUser()); // Clear user data from Redux store
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const signedOutOptions: OptionType[] = [
    {
      title: "Sign in",
      link: "/signin",
      type: "link",
    },
    {
      title: "Sign up",
      link: "/signup",
      type: "link",
    },
  ];

  const signedInOptions: OptionType[] = [
    {
      title: "Profile",
      link: "/profile",
      type: "link",
      icon: <User className="mr-2 h-4 w-4" />,
    },
    {
      title: "Log Out",
      type: "button",
      action: handleLogout,
      icon: <LogOut className="mr-2 h-4 w-4" />,
    },
  ];

  const navLinks: OptionType[] = [
    {
      title: "Home",
      link: "/home",
      type: "link",
    },
    // Add more navigation links here
  ];

  const isLinkActive = (currentPath: string, targetPath: string) => {
    return currentPath.startsWith(targetPath);
  };

  return (
    <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 pb-[1px] shadow-md">
      <header className="flex bg-white items-center justify-between py-4 px-4 sm:px-6 lg:px-8">
        <Link to="/home" className="flex items-center">
          <h2 className="font-bold text-2xl sm:text-3xl bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">
            AI Trip Planner
          </h2>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-4">
          {navLinks.map((link) => (
            <Link
              key={link.title}
              to={link.link || ""}
              className={`transition-colors ${
                isLinkActive(location.pathname, link.link || "")
                  ? "text-primary font-semibold"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {link.title}
            </Link>
          ))}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={user.photoURL || undefined}
                      alt={user.displayName || "User"}
                    />
                    <AvatarFallback>
                      {user.displayName?.[0] || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuItem className="flex items-center">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user.displayName}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {signedInOptions.map((option) =>
                  option.type === "link" ? (
                    <DropdownMenuItem key={option.title} asChild>
                      <Link
                        to={option.link || ""}
                        className="flex items-center"
                      >
                        {option.icon}
                        {option.title}
                      </Link>
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem
                      key={option.title}
                      onSelect={option.action}
                    >
                      {option.icon}
                      {option.title}
                    </DropdownMenuItem>
                  )
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            signedOutOptions.map((option) => (
              <Button key={option.title} variant="ghost" asChild>
                <Link to={option.link || ""}>{option.title}</Link>
              </Button>
            ))
          )}
        </nav>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Button
            variant="ghost"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <nav className="md:hidden bg-white px-4 py-2 shadow-md  transition-all duration-300">
          {navLinks.map((link) => (
            <Link
              key={link.title}
              to={link.link || ""}
              className={`block py-2 transition-colors ${
                isLinkActive(location.pathname, link.link || "")
                  ? "text-primary font-semibold"
                  : "text-gray-600 hover:text-gray-900"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.title}
            </Link>
          ))}
          {user ? (
            <>
              <div className="py-2 flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={user.photoURL || undefined}
                    alt={user.displayName || "User"}
                  />
                  <AvatarFallback>
                    {user.displayName?.[0] || "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{user.displayName}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
              </div>
              {signedInOptions.map((option) =>
                option.type === "link" ? (
                  <Link
                    key={option.title}
                    to={option.link || ""}
                    className="flex items-center py-2 text-gray-600 hover:text-gray-900 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {option.icon}
                    {option.title}
                  </Link>
                ) : (
                  <button
                    key={option.title}
                    onClick={() => {
                      option.action?.();
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center w-full py-2 text-left text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    {option.icon}
                    {option.title}
                  </button>
                )
              )}
            </>
          ) : (
            signedOutOptions.map((option) => (
              <Link
                key={option.title}
                to={option.link || ""}
                className="block py-2 text-gray-600 hover:text-gray-900 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {option.title}
              </Link>
            ))
          )}
        </nav>
      )}
    </div>
  );
}

export default Navbar;
