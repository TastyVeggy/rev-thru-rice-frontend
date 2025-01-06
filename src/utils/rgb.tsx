// stolen from chatgpt
export function darkenColorRGB(color: string, factor: number = 0.9): string {
  // Ensure the color starts with "#" (hex) or "rgb()" format
  if (color.startsWith('#')) {
    // Hex to RGB
    let hex = color.replace('#', '');
    if (hex.length === 3) {
      hex = hex
        .split('')
        .map((x) => x + x)
        .join('');
    }
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    return `rgb(${Math.round(r * factor)}, ${Math.round(
      g * factor
    )}, ${Math.round(b * factor)})`;
  }

  if (color.startsWith('rgb')) {
    // RGB to RGB
    const rgb = color.match(/\d+/g);
    if (rgb) {
      const r = Math.round(parseInt(rgb[0]) * factor);
      const g = Math.round(parseInt(rgb[1]) * factor);
      const b = Math.round(parseInt(rgb[2]) * factor);
      return `rgb(${r}, ${g}, ${b})`;
    }
  }

  // Return the color if it doesn't match recognized format
  return color;
}
