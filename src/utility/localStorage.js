function setItem(key, value) {
  localStorage.setItem(key, value);
}
function removeItem(key) {
  localStorage.removeItem(key);
}
function getItem(key) {
  return localStorage.getItem(key);
}
function clear() {
  localStorage.clear();
}

export { setItem, removeItem, getItem, clear };
