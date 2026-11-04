// Word-wrapping used by the OG card generator (scripts/generate-og-cards.mjs).
// Extracted so the edge case the generator depends on has a real test.
//
// Wrap text into at most maxLines lines, each capped at maxChars. Lines fill
// greedily at word boundaries up to the cap, and overflow that truly cannot
// fit folds into the final line with an ellipsis, so a subtitle that fits
// never shows a truncation ellipsis.

export function wrapLines(text, maxChars, maxLines) {
  const words = text.split(/\s+/);
  if (text.length <= maxChars) return [text];

  const lines = [];
  let current = "";
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const candidate = current ? `${current} ${word}` : word;
    if (current && candidate.length > maxChars) {
      if (lines.length === maxLines - 1) {
        // Last allowed line: fold the rest onto the line that was just built
        // at word boundaries instead of replacing it, so no text is dropped
        // (review fix: the old code assigned lines[maxLines - 1] = rest,
        // losing `current` entirely).
        let last = current;
        let overflow = false;
        for (let j = i; j < words.length; j++) {
          const folded = `${last} ${words[j]}`;
          if (folded.length > maxChars - 1) {
            overflow = true;
            break;
          }
          last = folded;
        }
        // Keep the ellipsis inside the budget even when the folded line is
        // already at the cap (e.g. "three four" at maxChars=10).
        lines.push(overflow ? `${last.slice(0, maxChars - 1)}…` : last);
        return lines;
      }
      lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
  }
  if (current && lines.length < maxLines) lines.push(current);
  // Hard safety cap: no line may exceed the box width.
  return lines.map((l) => (l.length > maxChars ? `${l.slice(0, maxChars - 1)}…` : l));
}
