import { Button } from "@suid/material";
import { createSignal, type Component } from "solid-js";
import ClassCard from "./components/Dashboard/ClassCard";
import Dashboard from "./routes/Dashboard";
import Navbar from "./components/common/Navbar";
import Assignment from "./Assignment/Assignment";
import { Route, Router } from "@solidjs/router";
import GoogleLogin from "./components/GoogleLogin";
import People from "./components/People";
import Class from "./routes/Class";
import { AxiosProvider } from "./lib/useAxiosContext";
import axios, { InternalAxiosRequestConfig } from "axios";
import { Toaster } from "solid-toast";
import AnnouncementsList from "./components/Class/Announcements";

const App: Component = () => {
  const axiosInstance = axios.create({
    baseURL: "http://localhost:8000",
    withCredentials: true,
  });

  axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = localStorage.getItem("jwtToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    }
  );

  return (
    <div class="flex h-screen">
      {/* Sidebar with width and background color */}
      <div class="flex flex-col flex-grow">
        <AxiosProvider axiosInstance={axiosInstance}>
          <Toaster />
          <Navbar />
          <AnnouncementsList />
          <Router>
            <Route path="/" component={GoogleLogin} />
            <Route path="/dashboard" component={Dashboard} />
            <Route path="/class/:classId" component={Class} />
            <Route path="/assignment/:id" component={Assignment} />
            <Route path={"/people/class/:id"} component={People} />
          </Router>
        </AxiosProvider>
      </div>
    </div>
  );
};

export default App;
