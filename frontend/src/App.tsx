import { Button } from "@suid/material";
import { createSignal, type Component } from "solid-js";
import ClassCard from "./components/Dashboard/ClassCard";
import Dashboard from "./routes/Dashboard";
import Navbar from "./components/common/Navbar";
import Assignment from "./Assignment/Assignment";
import { Route, Router } from "@solidjs/router";
import GoogleLogin from "./components/GoogleLogin";

import Class from "./routes/Class";

const App: Component = () => {
  return (
    <div>
      <Navbar />
      <Router>
        <Route path="/" component={GoogleLogin} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/class/:id" component={Class} />
        <Route path="/assignment/:id" component={Assignment} />
      </Router>
    </div>
  );
};

export default App;
