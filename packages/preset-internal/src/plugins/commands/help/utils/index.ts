export function getPadLength(obj: Object): number {
  let longest = 10;
  for (const key in obj) {
    if (key.length + 1 > longest) {
      longest = key.length + 1
    }
  }
  return longest;
}
