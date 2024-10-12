import { IconButton } from "@suid/material";

import {
  FolderOpenOutlined,
  AssignmentIndOutlined,
} from "@suid/icons-material";

import { Component, JSX } from "solid-js";

export interface ClassCardProps {
  name: string;
  creatorName: string;
  creatorPhoto: string;
  id: string;
  style?: JSX.CSSProperties;
}
import { A } from "@solidjs/router";



const ClassCard: Component<ClassCardProps> = (props) => {
  return (
    <div
      class="w-72 border border-gray-300 rounded-lg overflow-hidden cursor-pointer"
      style={props.style}
    >

      <div
        class="bg-teal-700 h-24 text-white p-2 border-b border-gray-300 relative"
        onClick={() => (window.location.href = `/class/${props.id}`)}
      >
        <div class="font-semibold text-2xl">{props.name}</div>
        <div class="absolute bottom-3 text-sm">{props.creatorName}</div>
        <img
          src={props.creatorPhoto}
          class="absolute right-2 top-2 h-10 w-10 rounded-full"
        />
      </div>
      <div>
         <h2>Class Name</h2>
         <A href="/assignment/assignment">View Assignment</A> {/* Link to assignment page */}
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
