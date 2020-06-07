import React from "react";
import VotingButton from "./votingButton";

const VotingButtonDown = ({ isActive, onClick }) => {
  return (
    <VotingButton
      isActive={isActive}
      description="Vote Down"
      onClick={onClick}
    />
  );
};

export default VotingButtonDown;
