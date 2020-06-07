import React from "react";

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
