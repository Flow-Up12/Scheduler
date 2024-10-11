import { Avatar, Box } from "@mui/material";

export const Header = () => {
  return (
    <header className="bg-gray-900 p-4 fixed top-0 left-0 right-0 z-50 shadow-lg">
      <Box className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="text-white">
          <h1 className="text-3xl font-bold tracking-wide">Schedule App</h1>
        </div>
        <div>
         <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
        </div>
      </Box>
    </header>
  );
};

export default Header;