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
