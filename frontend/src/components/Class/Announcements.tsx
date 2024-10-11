import { IconButton } from "@suid/material";
import MoreVertIcon from "@suid/icons-material/MoreVert";
import { Component } from "solid-js";

interface AnnouncementProps {
  image: string;
  name: string;
  date: string;
  content: string;
  authorId: string;
}

const Announcement: Component<AnnouncementProps> = ({
  image,
  name,
  date,
  content,
  authorId,
}) => {
  return (
    <div class="w-full p-6 border border-gray-300 rounded-lg mb-5">
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <div class="rounded-full h-12 w-12 overflow-hidden">
            <img
              src={image}
              alt={`${name}'s profile`}
              class="h-full w-full object-cover"
            />
          </div>
          <div class="ml-3">
            <div class="font-semibold">{name}</div>
            <div class="text-sm text-gray-600 mt-1">{date}</div>
          </div>
        </div>
        <div>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </div>
      </div>
      <div class="mt-4">{content}</div>
    </div>
  );
};

export default Announcement;
