/* scripts for handling tags related operations */

let searchBar = document.getElementById('search');
let tagElements = document.getElementsByClassName('tag');
const tagNames = getTagNames(tagElements);
for (let tagElement of tagElements) {
  tagElement.addEventListener('click', () => toggleSearchTag(tagElement));
}
toggleQueryTagsOnSearchBar();

function toggleQueryTagsOnSearchBar() {
  let tagQueries = getQueryVariable('tags');
  if (tagQueries) {
    tagQueries = tagQueries.replace(/[%20, +]/g, ' ').split(' ').filter( tag => tag.length > 0);
    for (const tag of tagQueries) {
      const i = tagNames.indexOf(tag);
      if (i > -1) {
        toggleSearchTag(tagElements[i]);
      }
    }
  }
}

function getTagNames(tagElems) {
  names = [];
  for (const tag of tagElems) {
    names.push(tag.childNodes[0].innerHTML);
  }
  return names;
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

function toggleSearchTag(tagElement) {
  let tagName = tagElement.childNodes[0].innerHTML;
  let toggledTags = searchBar.value.split(' ').filter( tag => tag.length > 0);
  const i = toggledTags.indexOf(tagName);
  if (i > -1) {
    toggledTags.splice(i, 1);
  } else {
    toggledTags.push(tagName);
  }
  tagElement.classList.toggle('active-tag');
  searchBar.value = toggledTags.join(' ');
}
