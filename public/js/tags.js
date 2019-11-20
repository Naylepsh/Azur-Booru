/* scripts for handling tag-related events */

let searchBar = document.getElementById('search');
toggleQueryTagsOnSearchBar();

function toggleQueryTagsOnSearchBar() {
  let tags = getQueryVariable('tags');
  if (tags) {
    tags = tags.replace(/[%20, +]/g, ' ').split(' ').filter( tag => tag.length > 0);
    for (const tag of tags) {
      toggleSearchTag(tag);
    }
  }
}

function getQueryVariable(variable)
{
  const query = window.location.search.substring(1);
  const vars = query.split('&');
  for (const queryVar of vars) {
    const pair = queryVar.split('=');
    if (pair[0] == variable) {
      return pair[1];
    }
  }
  return;
}

function toggleSearchTag(tagName) {
  let toggledTags = searchBar.value.split(' ').filter( tag => tag.length > 0);
  const i = toggledTags.indexOf(tagName);
  if (i > -1) {
    toggledTags.splice(i, 1);
  } else {
    toggledTags.push(tagName);
  }
  searchBar.value = toggledTags.join(' ');
}

let tags = document.getElementsByClassName('tag');
for (let tag of tags) {
  tag.addEventListener('click', () => toggleSearchTag(tag.childNodes[0].innerHTML));
  // add .active class to clicked tags
}