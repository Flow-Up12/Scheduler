import React, { useState } from "react";
import { Avatar, Box, Menu, MenuItem } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../helpers/AuthProvider";

export const Header: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  // Menu state
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isMenuOpen = Boolean(anchorEl);

  // Handlers for opening/closing the menu
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Handlers for menu items
  const handleProfileClick = () => {
    navigate("/profile");
    handleMenuClose();
  };

  const handleRegisterOrganizationClick = () => {
    navigate("/register-organization");
    handleMenuClose();
  };

  return (
    <header className="bg-gray-900 p-4 fixed top-0 left-0 right-0 z-50 shadow-lg">
      <Box className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="text-white ">
          <h1 onClick={() => {
            navigate("/schedule");
          }} className="text-3xl font-bold tracking-wide hover:scale-125 transition-transform cursor-pointer">Fratgenda</h1>
        </div>
        <div>
          {currentUser && (
            <>
              {/* Avatar */}
              <Avatar
                alt={currentUser.displayName || "User"}
                src={currentUser.photoURL ? currentUser.photoURL : undefined}
                onClick={handleMenuOpen} // Click opens the menu
                className="cursor-pointer hover:scale-125 transition-transform" 
              />

              {/* Menu for Avatar */}
              <Menu
                anchorEl={anchorEl}
                open={isMenuOpen}
                onClose={handleMenuClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
              >
                <MenuItem onClick={handleProfileClick}>Profile</MenuItem>
                <MenuItem onClick={handleRegisterOrganizationClick}>
                  Organization
                </MenuItem>
                <MenuItem onClick={() => {
                  logout()
                  handleMenuClose();
                  navigate("/login");
                }                  
                }>Logout</MenuItem>
              </Menu>
            </>
          )}
        </div>
      </Box>
    </header>
  );
};

export default Header;