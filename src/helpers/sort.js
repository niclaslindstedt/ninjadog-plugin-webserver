export const sortString = (a, b) => {
  a = a.toLowerCase();
  b = b.toLowerCase();
  if (a < b) {
    return -1;
  } else if (a > b) {
    return 1;
  }
  return 0;
};

export const sortByName = (a, b) => {
  a = a.name ? a.name.toLowerCase() : '';
  b = b.name ? b.name.toLowerCase() : '';
  if (a < b) {
    return -1;
  } else if (a > b) {
    return 1;
  }
  return 0;
};
