import { useEffect } from "react";
import "./App.css";
import mondaySdk from "monday-sdk-js";
import "@vibe/core/tokens";

import { Outlet } from "react-router-dom";

const monday = mondaySdk();

const App = () => {
  useEffect(() => {
    monday.execute("valueCreatedForUser");
  }, []);

  return <Outlet />;
};

export default App;
