/* scripts for handling tags related operations */

// Get HTML elements
let searchBar = document.getElementById('search');
let tagElements = document.getElementsByClassName('tag');
const tagNames = getTagNames(tagElements);

// Add event listeners to tag elements
for (let tagElement of tagElements) {
  tagElement.addEventListener('click', () => toggleSearchTag(tagElement));
}
showQueryTagsOnSearchBar();

function showQueryTagsOnSearchBar() {
  let tagQueries = getQueryVariable('tags');
  if (tagQueries) {
    tagQueries = tagQueries.replace(/[%20, +]/g, ' ').split(' ').filter( tag => tag.length > 0);
    for (const tag of tagQueries) {
      const i = tagNames.indexOf(tag);
      if (i > -1) {
        toggleSearchTag(tagElements[i]);
      } else {
        toggleTagOnSearchBar(tag);
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

function getQueryVariable(variableName)
{
  const query = window.location.search.substring(1);
  const vars = query.split('&');
  for (const queryVar of vars) {
    const pair = queryVar.split('=');
    if (pair[0] == variableName) {
      return pair[1];
    }
  }
  return;
}

function toggleSearchTag(tagElement) {
  let tagName = tagElement.childNodes[0].innerHTML;
  toggleTagOnSearchBar(tagName)
  tagElement.classList.toggle('active-tag');
}

function toggleTagOnSearchBar(tagName) {
  let toggledTags = searchBar.value.split(' ').filter( tag => tag.length > 0);
  const i = toggledTags.indexOf(tagName);
  if (i > -1) {
    toggledTags.splice(i, 1);
  } else {
    toggledTags.push(tagName);
  }
  searchBar.value = toggledTags.join(' ');
}