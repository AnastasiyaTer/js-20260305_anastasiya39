/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
  if (!string || size <= 0) {
    return '';
  }
  if (size === undefined) {
    return string;
  }
  let count = 0;
  return string.split('').reduce((acc, char) => {
    if (char === acc[acc.length - 1]) {
      count++;
    } else {
      count = 1;
    }

    if (count <= size) {
      acc.push(char);
    }
    
    return acc;
  }, []).join('');
}