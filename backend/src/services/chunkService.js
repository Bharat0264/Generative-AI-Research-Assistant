export function splitIntoChunks(text, maxWords = 220, overlapWords = 45) {
  const words = text.split(/\s+/).filter(Boolean);
  const chunks = [];
  let index = 0;

  for (let start = 0; start < words.length; start += maxWords - overlapWords) {
    const segment = words.slice(start, start + maxWords).join(' ');
    if (segment.length > 40) {
      chunks.push({ index, text: segment });
      index += 1;
    }

    if (start + maxWords >= words.length) break;
  }

  return chunks;
}
