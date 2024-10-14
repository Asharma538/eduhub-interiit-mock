import { IconButton } from "@suid/material";

import {
  FolderOpenOutlined,
  AssignmentIndOutlined,
} from "@suid/icons-material";

import { Component, JSX, createSignal, onMount } from "solid-js";

import { A } from "@solidjs/router";

// Define the props for Classcard
export interface ClassCardProps {
  name: string;
  creatorName: string;
  id: string;
  details: string;
  style?: JSX.CSSProperties;
}
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
        <div class="font-semibold text-xl break-words">{props.name}</div>
        <div class="absolute bottom-2 text-sm">{props.creatorName}</div>
      </div>

      <div class="p-2">
        <p class="text-gray-600 text-sm">{props.details}</p>{" "}
        {/* Add details here */}
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

// main code that uses Axios to fetch the class data

export default ClassCard;
