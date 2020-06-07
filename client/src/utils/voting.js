export const VOTE_NONE = "none";
export const VOTE_DOWN = "down";
export const VOTE_UP = "up";

export function castVote(previousVote, newVote, score) {
  switch (newVote) {
    case VOTE_UP:
      return voteUp(previousVote, score);
    case VOTE_DOWN:
      return voteDown(previousVote, score);
    default:
      throwInvalidEnumException([VOTE_UP, VOTE_DOWN]);
  }
}

function voteUp(previousVote, score) {
  let vote;

  switch (previousVote) {
    case VOTE_NONE:
      score++;
      vote = VOTE_UP;
      break;
    case VOTE_UP:
      score--;
      vote = VOTE_NONE;
      break;
    case VOTE_DOWN:
      score += 2;
      vote = VOTE_UP;
      break;
    default:
      throwInvalidEnumException([VOTE_UP, VOTE_NONE, VOTE_DOWN]);
  }

  return { vote, score };
}

function voteDown(previousVote, score) {
  let vote;

  switch (previousVote) {
    case VOTE_NONE:
      score--;
      vote = VOTE_DOWN;
      break;
    case VOTE_UP:
      score -= 2;
      vote = VOTE_DOWN;
      break;
    case VOTE_DOWN:
      score++;
      vote = VOTE_NONE;
      break;
    default:
      throwInvalidEnumException([VOTE_UP, VOTE_NONE, VOTE_DOWN]);
  }

  return { vote, score };
}

function throwInvalidEnumException(allowedValues) {
  throw new TypeError(
    `Invalid value passed. Only ${allowedValues.join(",")} allowed`
  );
}
