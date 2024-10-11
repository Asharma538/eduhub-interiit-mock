import { createSignal } from "solid-js";
import { Avatar, IconButton, MenuItem, Menu } from "@suid/material";
import { Add, Apps, Menu as MenuIcon } from "@suid/icons-material";
import CreateClass from "../Dashboard/CreateClass";
import JoinClass from "../Dashboard/JoinClass";

// Simulate user data for demonstration
const useAuthState = () => {
  const user = { photoURL: "path_to_user_photo.jpg" }; // Simulated user data
  const loading = false;
  const error = null;
  return [user, loading, error];
};

// Simulated logout function
const logout = () => {
  alert("Logged out");
};

const Navbar = () => {
  const [user] = useAuthState();
  const [anchorEl, setAnchorEl] = createSignal<HTMLElement | null>(null);
  const [createOpened, setCreateOpened] = createSignal(false);
  const [joinOpened, setJoinOpened] = createSignal(false);

  const handleClick = (event: MouseEvent) => {
    setAnchorEl(event.currentTarget as HTMLElement);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <nav class="w-full h-16 border-b border-gray-300 flex justify-between px-5 items-center">
      <CreateClass
        open={createOpened}
        handleClose={() => setCreateOpened(false)}
      />
      <JoinClass open={joinOpened} handleClose={() => setJoinOpened(false)} />
      <div class="flex items-center">
        <IconButton>
          <MenuIcon />
        </IconButton>
        <span class="text-lg">EduHub</span>
      </div>
      <div class="flex items-center">
        <IconButton onClick={handleClick}>
          <Add />
        </IconButton>
        <IconButton>
          <Apps />
        </IconButton>
        <IconButton onClick={logout}>
          <Avatar src={""} />
        </IconButton>
        <Menu
          anchorEl={anchorEl()}
          open={Boolean(anchorEl())}
          onClose={handleClose}
        >
          <MenuItem
            onClick={() => {
              setCreateOpened(true);
              handleClose();
            }}
          >
            Create Class
          </MenuItem>
          <MenuItem
            onClick={() => {
              setJoinOpened(true);
              handleClose();
            }}
          >
            Join Class
          </MenuItem>
        </Menu>
      </div>
    </nav>
  );
};

export default Navbar;
