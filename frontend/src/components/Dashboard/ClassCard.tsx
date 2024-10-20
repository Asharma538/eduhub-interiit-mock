import { IconButton, Menu, MenuItem } from "@suid/material";
import {
  FolderOpenOutlined,
  AssignmentIndOutlined,
  MoreVert,
} from "@suid/icons-material";
import { Component, JSX, createSignal } from "solid-js";
import { useAxiosContext } from "../../lib/useAxiosContext";
import toast from "solid-toast";
import { useClassContext } from "../../lib/useClassContext";
import { useNavigate } from "@solidjs/router";

export interface ClassCardProps {
  name: string;
  creatorName: string;
  id: string;
  details: string;
  isTeacher: boolean;
  style?: JSX.CSSProperties;
}

const ClassCard: Component<ClassCardProps> = (props) => {
  const [anchorEl, setAnchorEl] = createSignal<HTMLElement | null>(null);
  const axios = useAxiosContext();
  const { classDetails, setClassDetails } = useClassContext();
  const navigate = useNavigate();

  const handleMoreClick = (event: MouseEvent) => {
    setAnchorEl(event.currentTarget as HTMLElement);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDeleteClass = () => {
    axios
      ?.delete(`/classes/${props.id}`)
      .then((data) => {
        toast.success("Class deleted successfully");
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || "Error deleting class");
      });

    handleClose();
  };

  return (
    <div
      class="w-72 border border-gray-300 rounded-lg overflow-hidden cursor-pointer"
      style={props.style}
    >
      <div class="bg-teal-700 h-24 text-white p-2 border-b border-gray-300 relative" 
      onClick={() => {
            console.log(props.id, props.name, props.isTeacher);

            setClassDetails({
              classId: props.id,
              className: props.name,
              isTeacher: props.isTeacher,
            });
            localStorage.setItem(
              "classDetails",
              JSON.stringify(classDetails())
            );

            navigate("/class");
          }}>
        <div
          class="font-semibold text-xl cursor-pointer hover:underline line-clamp-2 break-words mr-6"
          
        >
          {props.name}
        </div>
        <div class="absolute bottom-2 left-2 right-12 text-sm ">
          {props.creatorName}
        </div>

        {props.isTeacher && (
          <div class="absolute top-2 right-2">
            <IconButton onClick={handleMoreClick} class="text-white">
              <MoreVert />
            </IconButton>
          </div>
        )}
      </div>

      {props.isTeacher && (
        <Menu
          anchorEl={anchorEl()}
          open={Boolean(anchorEl())}
          onClose={handleClose}
        >
          <MenuItem onClick={handleDeleteClass}>Delete Class</MenuItem>
        </Menu>
      )}

      <div class="p-2">
        <p class="text-gray-600 text-sm">{props.details}</p>
      </div>

      <div class="h-48 border-b border-gray-300"></div>

      <div class="flex flex-row-reverse p-2">
        <a href='/classwork'><IconButton>
          <FolderOpenOutlined/>
        </IconButton></a>
        <a href='/people'><IconButton>
          <AssignmentIndOutlined />
        </IconButton></a>
      </div>
    </div>
  );
};

export default ClassCard;
