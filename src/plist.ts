function ind(level: number): string {
  return "\t".repeat(level);
}

function escapeXml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/** Explicit wrapper for plist `<data>` values. */
export class PlistData {
  private constructor(private readonly base64Value: string) {}

  static fromBase64(base64: string): PlistData {
    const normalized = base64.replace(/\s+/g, "");
    const bytes = Buffer.from(normalized, "base64");

    if (bytes.length === 0 && normalized !== "") {
      throw new Error("Invalid base64 data");
    }

    if (bytes.toString("base64") !== normalized) {
      throw new Error("Invalid base64 data");
    }

    return new PlistData(normalized);
  }

  static fromBytes(bytes: ArrayBuffer | ArrayBufferView): PlistData {
    const view =
      bytes instanceof ArrayBuffer
        ? new Uint8Array(bytes)
        : new Uint8Array(bytes.buffer, bytes.byteOffset, bytes.byteLength);

    return new PlistData(Buffer.from(view).toString("base64"));
  }

  toBase64(): string {
    return this.base64Value;
  }

  toString(): string {
    return this.base64Value;
  }
}

/** Explicit wrapper for plist `<real>` values. */
export class PlistReal {
  private constructor(private readonly numericValue: number) {}

  static fromNumber(value: number): PlistReal {
    return new PlistReal(value);
  }

  toNumber(): number {
    return this.numericValue;
  }

  toString(): string {
    if (Number.isNaN(this.numericValue)) return "nan";
    if (this.numericValue === Number.POSITIVE_INFINITY) return "inf";
    if (this.numericValue === Number.NEGATIVE_INFINITY) return "-inf";
    return `${this.numericValue}`;
  }
}

export class PlistWriter {
  private lines: string[] = [];
  private lastKey: string | null = null;

  constructor(
    private level = 0,
    private path = "<root>",
    private arrayIndex: number | null = null,
  ) {}

  private w(line: string): void {
    this.lines.push(`${ind(this.level)}${line}`);
  }

  private appendPathSegment(segment: string): string {
    return this.path === "<root>" ? segment : `${this.path}.${segment}`;
  }

  private appendArrayIndex(index: number): string {
    return `${this.path}[${index}]`;
  }

  private currentValuePath(): string {
    if (this.arrayIndex !== null) return this.appendArrayIndex(this.arrayIndex);
    if (this.lastKey !== null) return this.appendPathSegment(this.lastKey);
    return this.path;
  }

  private advanceValueCursor(): void {
    if (this.arrayIndex !== null) {
      this.arrayIndex += 1;
      return;
    }

    if (this.lastKey !== null) {
      this.lastKey = null;
    }
  }

  private invalidValue(plistType: string, value: unknown, detail: string): never {
    throw new Error(
      `Invalid plist <${plistType}> at ${this.currentValuePath()}. Received: ${value}. ${detail}`,
    );
  }

  dict(fn: (w: PlistWriter) => void): this {
    const inner = new PlistWriter(this.level + 1, this.currentValuePath());
    this.advanceValueCursor();
    fn(inner);
    if (inner.lines.length === 0) {
      this.w("<dict/>");
    } else {
      this.w("<dict>");
      this.lines.push(...inner.lines);
      this.w("</dict>");
    }
    return this;
  }

  array(fn: (w: PlistWriter) => void): this {
    const inner = new PlistWriter(this.level + 1, this.currentValuePath(), 0);
    this.advanceValueCursor();
    fn(inner);
    if (inner.lines.length === 0) {
      this.w("<array/>");
    } else {
      this.w("<array>");
      this.lines.push(...inner.lines);
      this.w("</array>");
    }
    return this;
  }

  key(k: string): this {
    this.lastKey = k;
    this.w(`<key>${escapeXml(k)}</key>`);
    return this;
  }

  string(value: string): this {
    this.advanceValueCursor();
    this.w(`<string>${escapeXml(value)}</string>`);
    return this;
  }

  integer(value: number): this {
    if (!Number.isFinite(value)) {
      this.invalidValue("integer", value, "Only integers are supported.");
    }

    if (!Number.isInteger(value)) {
      this.invalidValue(
        "integer",
        value,
        "Only integers are supported. Use PlistReal for floating-point values instead.",
      );
    }

    this.advanceValueCursor();
    this.w(`<integer>${value}</integer>`);
    return this;
  }

  real(value: number): this {
    this.advanceValueCursor();
    if (Number.isNaN(value)) {
      this.w("<real>nan</real>");
      return this;
    }

    if (value === Number.POSITIVE_INFINITY) {
      this.w("<real>inf</real>");
      return this;
    }

    if (value === Number.NEGATIVE_INFINITY) {
      this.w("<real>-inf</real>");
      return this;
    }

    this.w(`<real>${value}</real>`);
    return this;
  }

  date(value: Date): this {
    if (Number.isNaN(value.getTime())) {
      this.invalidValue("date", value, "Only valid Date instances are supported.");
    }

    this.advanceValueCursor();
    // ISO 8601 formatted string
    this.w(`<date>${value.toISOString().replace(/\.\d{3}Z$/, "Z")}</date>`);
    return this;
  }

  bool(value: boolean): this {
    this.advanceValueCursor();
    this.w(value ? "<true/>" : "<false/>");
    return this;
  }

  data(value: string): this {
    this.advanceValueCursor();
    this.w(`<data>${value}</data>`);
    return this;
  }

  toString(): string {
    return this.lines.join("\n");
  }
}

export function plistDocument(fn: (root: PlistWriter) => void): string {
  const w = new PlistWriter(0);
  w.dict(fn);
  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
${w.toString()}
</plist>
`;
}
