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
import { AuthProvider, UserDetails } from "./lib/useAuthContext";
import Classwork from "./components/Classwork";

const App: Component = () => {
  const [auth, setAuth] = createSignal<UserDetails>({
    _id: "",
    email: "",
    display_name: "",
  });

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

  axiosInstance.get("/profile").then((res) => {
   
    const { _id, email, display_name } = res.data.data;
    setAuth({ _id, email, display_name });
    console.log(auth());
    
  });

  return (
    <div class="flex h-screen">
      {/* Sidebar with width and background color */}
      <div class="flex flex-col flex-grow">
        <AxiosProvider axiosInstance={axiosInstance}>
          <Toaster />
          <Navbar />
          <Router>
            <Route path="/" component={GoogleLogin} />
            <Route path="/dashboard" component={Dashboard} />
            <Route path="/class/:classId" component={Class} />
            <Route path="/classwork/:classId" component={Classwork} />
            <Route path="/assignment/:id" component={Assignment} />
            <Route path={"/people/class/:id"} component={People} />
          </Router>
        </AxiosProvider>
      </div>
    </div>
  );
};

export default App;
