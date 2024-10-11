import { Button } from "@suid/material";
import { createSignal, type Component } from "solid-js";
import ClassCard from "./components/Dashboard/ClassCard";
import Dashboard from "./routes/Dashboard";
import Navbar from "./components/common/Navbar";
import { Route, Router } from "@solidjs/router";

import Class from "./routes/Class";

const App: Component = () => {
  return (
    <div>
      <Navbar />
      <Router>
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/class/:id" component={Class} />
      </Router>
    </div>
  );
};

export default App;
