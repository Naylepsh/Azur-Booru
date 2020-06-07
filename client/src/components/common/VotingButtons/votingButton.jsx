import React from "react";
import "./votingButton.css";

const getClassName = (isActive) => {
  return isActive ? "voting-button active" : "voting-button";
};

const VotingButton = ({ isActive, description, onClick }) => {
  return (
    <li>
      <button className={getClassName(isActive)} onClick={onClick}>
        {description}
      </button>
    </li>
  );
};

export default VotingButton;
