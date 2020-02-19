const postVoteUpBtn = document.getElementById('post-vote-up');
const postVoteDownBtn =document.getElementById('post-vote-down');
const postId = document.getElementById('post-id').innerHTML;

function vote(direction) {
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
  postVoteUpBtn.addEventListener('click', () => { vote('up') });
}

if (postVoteDownBtn) {
  postVoteDownBtn.addEventListener('click', () => { vote('down') });
}


