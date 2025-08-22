import { useState } from "react";
import "./App.css";
import DemoSceneTypes from "./Components/DemoSceneTypes";
import IntroVideo from "./Components/IntroVideo";

function App() {
  const [IsDone, setIsDone] = useState(false);

  return (
    <>
      {/* <IntroVideo setIsDone={setIsDone} IsDone={IsDone} /> */}
      {!IsDone && <DemoSceneTypes />}
    </>
  );
}

export default App;
