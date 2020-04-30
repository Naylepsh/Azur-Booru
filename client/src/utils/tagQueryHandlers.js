import { toggleInArray } from "./iterable";

export function handleTagToggle(tag, selectedTags) {
  selectedTags = toggleInArray(tag, selectedTags);
  const query = selectedTags.join(" ");
  return { selectedTags, query };
}

export function handleQueryChange(query, availableTags) {
  const typedTags = query.split(" ");
  let selectedTags = [];
  for (const tag of typedTags) {
    if (availableTags.includes(tag)) {
      selectedTags.push(tag);
    }
  }
  return selectedTags;
}
