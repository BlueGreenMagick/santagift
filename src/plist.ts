function ind(level: number): string {
  return "\t".repeat(level);
}

function escapeXml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function plistKey(key: string): string {
  return `<key>${escapeXml(key)}</key>`;
}

export function plistString(value: string): string {
  return `<string>${escapeXml(value)}</string>`;
}

export function plistInteger(value: number): string {
  return `<integer>${value}</integer>`;
}

export function plistBool(value: boolean): string {
  return value ? "<true/>" : "<false/>";
}

/**
 * Builds a <dict> node. The returned string starts with <dict> (no leading indent).
 * @param entries - [key, value] pairs where value is already-rendered XML (no leading indent)
 * @param level - the indentation level of the <dict> tag itself
 */
export function plistDict(entries: [string, string][], level: number): string {
  if (entries.length === 0) return "<dict/>";
  const rows = entries
    .map(([k, v]) => `${ind(level + 1)}${plistKey(k)}\n${ind(level + 1)}${v}`)
    .join("\n");
  return `<dict>\n${rows}\n${ind(level)}</dict>`;
}

/**
 * Builds an <array> node. The returned string starts with <array> (no leading indent).
 * @param items - already-rendered XML strings (no leading indent)
 * @param level - the indentation level of the <array> tag itself
 */
export function plistArray(items: string[], level: number): string {
  if (items.length === 0) return "<array/>";
  const rows = items.map((item) => `${ind(level + 1)}${item}`).join("\n");
  return `<array>\n${rows}\n${ind(level)}</array>`;
}

export function plistDocument(rootDict: string): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
${rootDict}
</plist>
`;
}
