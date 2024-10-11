import { Button } from "@suid/material";
import { createSignal, type Component } from "solid-js";
import ClassCard from "./components/Dashboard/ClassCard";
import Dashboard from "./routes/Dashboard";
import Navbar from "./components/common/Navbar";
import { Route, Router } from "@solidjs/router";
import LoginPage from "./routes/Login";

const App: Component = () => {
  return (
    <div>
      <Router>

        <Route path="/dashboard" component={Dashboard} />
        <Route path="/login" component={LoginPage}/>
      </Router>
    </div>
  );
};

export default App;
