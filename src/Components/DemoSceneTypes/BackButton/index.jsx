import React from "react";
import { DATA } from "../data";
import "./styles.scss";

const BackButton = ({ setCurrentScene }) => {
  const handleBack = () => {
    setCurrentScene(DATA[2]);
  };

  return (
    <div className="back_button">
      <button onClick={handleBack}>Back</button>
    </div>
  );
};

export default BackButton;
