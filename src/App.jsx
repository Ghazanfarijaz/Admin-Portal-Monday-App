import React from "react";
import { useState, useEffect } from "react";
import "./App.css";
import mondaySdk from "monday-sdk-js";
import "@vibe/core/tokens";
//Explore more Monday React Components here: https://vibe.monday.com/
import { AttentionBox } from "@vibe/core";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import AddUser from "./Components/AddUser";
import AppLayout from "./Components/AppLayout";

// Usage of mondaySDK example, for more information visit here: https://developer.monday.com/apps/docs/introduction-to-the-sdk/
const monday = mondaySdk();

const App = () => {
  const [context, setContext] = useState();

  useEffect(() => {
    // Notice this method notifies the monday platform that user gains a first value in an app.
    // Read more about it here: https://developer.monday.com/apps/docs/mondayexecute#value-created-for-user/
    monday.execute("valueCreatedForUser");

    // TODO: set up event listeners, Here`s an example, read more here: https://developer.monday.com/apps/docs/mondaylisten/
    monday.listen("context", (res) => {
      setContext(res.data);
    });
  }, []);

  //Some example what you can do with context, read more here: https://developer.monday.com/apps/docs/mondayget#requesting-context-and-settings-data
  const attentionBoxText = `Hello, your user_id is: ${
    context ? context.user.id : "still loading"
  }.
  Let's start building your amazing app, which will change the world!`;

  return (
    <Router>
      <div className="App">
        {/* <AttentionBox
        title="Hello Monday Apps!"
        text={attentionBoxText}
        type="success"
      /> */}
        <Routes>
          <Route path="/" element={<AppLayout context={context} />} />
          {/* <Route path="/another-page" element={<AnotherPage context={context} />} />
          <Route path="/settings" element={<SettingsPage context={context} />} /> */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
