import { IconButton, Menu, MenuItem } from "@suid/material";
import {
  FolderOpenOutlined,
  AssignmentIndOutlined,
  MoreVert,
} from "@suid/icons-material";
import { Component, JSX, createSignal } from "solid-js";

export interface ClassCardProps {
  name: string;
  creatorName: string;
  id: string;
  details: string;
  style?: JSX.CSSProperties;
  onDeleteClass: (id: string) => void;
}

const ClassCard: Component<ClassCardProps> = (props) => {
  const [anchorEl, setAnchorEl] = createSignal<HTMLElement | null>(null);

  const handleMoreClick = (event: MouseEvent) => {
    setAnchorEl(event.currentTarget as HTMLElement);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDeleteClass = () => {
    props.onDeleteClass(props.id);
    handleClose();
  };

  return (
    <div
      class="w-72 border border-gray-300 rounded-lg overflow-hidden cursor-pointer"
      style={props.style}
    >
      <div class="bg-teal-700 h-24 text-white p-2 border-b border-gray-300 relative">
        <div
          class="font-semibold text-xl cursor-pointer hover:underline line-clamp-2 break-words mr-6"
          onClick={() => (window.location.href = `/class/${props.id}`)}
        >
          {props.name}
        </div>
        <div class="absolute bottom-2 left-2 right-12 text-sm ">
          {props.creatorName}
        </div>
        <div class="absolute top-2 right-2">
          <IconButton onClick={handleMoreClick} class="text-white">
            <MoreVert />
          </IconButton>
        </div>
      </div>

      <Menu
        anchorEl={anchorEl()}
        open={Boolean(anchorEl())}
        onClose={handleClose}
      >
        <MenuItem onClick={handleDeleteClass}>Delete Class</MenuItem>
      </Menu>

      <div class="p-2">
        <p class="text-gray-600 text-sm">{props.details}</p>
      </div>

      <div class="h-48 border-b border-gray-300"></div>

      <div class="flex flex-row-reverse p-2">
        <IconButton>
          <FolderOpenOutlined />
        </IconButton>
        <IconButton>
          <AssignmentIndOutlined />
        </IconButton>
      </div>
    </div>
  );
};

export default ClassCard;
