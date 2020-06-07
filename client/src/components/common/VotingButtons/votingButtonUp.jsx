import React from "react";
import VotingButton from "./votingButton";

const VotingButtonUp = ({ isActive, onClick }) => {
  return (
    <VotingButton isActive={isActive} description="Vote Up" onClick={onClick} />
  );
};

export default VotingButtonUp;
