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
    <div>
      <Navbar />
      <AxiosProvider axiosInstance={axiosInstance}>
        <Router>
          <Route path="/" component={GoogleLogin} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/class/:id" component={Class} />
          <Route path="/assignment/:id" component={Assignment} />
        </Router>
      </AxiosProvider>
    </div>
  );
};

export default App;
