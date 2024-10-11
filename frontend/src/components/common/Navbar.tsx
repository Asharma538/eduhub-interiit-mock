import { createSignal } from "solid-js";
import {  IconButton, MenuItem, Menu } from "@suid/material";
import { Add,  Menu as MenuIcon } from "@suid/icons-material";
import CreateClass from "../Dashboard/CreateClass";
import JoinClass from "../Dashboard/JoinClass";


const Navbar = () => {
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
        <span class="text-lg" onclick={() => (window.location.href = "/dashboard")}>EduHub</span>
      </div> 
      <div class="flex items-center">
        <IconButton onClick={handleClick}>
          <Add />
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
