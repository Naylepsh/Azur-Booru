export function toggleInArray(object, array) {
  const index = array.indexOf(object);
  if (index > -1) {
    array.splice(index, 1);
  } else {
    array.push(object);
  }
  return array;
}
