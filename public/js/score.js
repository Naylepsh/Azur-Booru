const postVoteUpBtn = document.getElementById('post-vote-up');
const postVoteDownBtn = document.getElementById('post-vote-down');
const postId = document.getElementById('post-id').innerHTML;

function postVote(direction) {
  const postScore = document.getElementById('post-score');

  const req = new XMLHttpRequest();
  req.open('POST', `/posts/${postId}/toggle-vote`, true);
  req.onreadystatechange = function() {
    if (req.readyState == XMLHttpRequest.DONE) {
      postScore.innerHTML = req.responseText;
    }
  }
  let form = new FormData();
  form.append('voteType', direction);
  req.send(form);
}

if (postVoteUpBtn) {
  postVoteUpBtn.addEventListener('click', () => { postVote('up') });
}

if (postVoteDownBtn) {
  postVoteDownBtn.addEventListener('click', () => { postVote('down') });
}

const comments = document.getElementsByClassName('comment');

function commentVote(comment, direction) {
  const commentId = comment.getElementsByClassName('comment-id')[0].innerHTML;
  const commentScore = comment.getElementsByClassName('comment-score')[0];

  const req = new XMLHttpRequest();
  req.open('POST', `/comments/${commentId}/toggle-vote`, true);
  req.onreadystatechange = function() {
    if (req.readyState == XMLHttpRequest.DONE) {
      commentScore.innerHTML = req.responseText;
    }
  }
  let form = new FormData();
  form.append('voteType', direction);
  req.send(form);
}

for (const comment of comments) {
  const voteUpBtn = comment.getElementsByClassName('comment-vote-up')[0];
  if (voteUpBtn) {
    voteUpBtn.addEventListener('click', () => { commentVote(comment, 'up') });
  }
  const voteDownBtn = comment.getElementsByClassName('comment-vote-down')[0];
  if (voteDownBtn) {
    voteDownBtn.addEventListener('click', () => { commentVote(comment, 'down') });
  }
}
