const postVoteUpBtn = document.getElementById('post-vote-up');
const postVoteDownBtn =document.getElementById('post-vote-down');
const postId = document.getElementById('post-id').innerHTML;

function vote(direction) {
  const postScore = document.getElementById('post-score');

  const req = new XMLHttpRequest();
  req.open('POST', `/posts/${postId}/vote-${direction}`, true);
  req.onreadystatechange = function() {
    if (req.readyState == XMLHttpRequest.DONE) {
      postScore.innerHTML = req.responseText;
    }
  }
  req.send();
}

postVoteUpBtn.addEventListener('click', () => {
  vote('up');
});

postVoteDownBtn.addEventListener('click', () => {
  vote('down');
});

