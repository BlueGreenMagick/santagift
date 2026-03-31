function ind(level: number): string {
  return "\t".repeat(level);
}

function escapeXml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export class PlistWriter {
  private lines: string[] = [];

  constructor(private level = 0) {}

  private w(line: string): void {
    this.lines.push(`${ind(this.level)}${line}`);
  }

  dict(fn: (w: PlistWriter) => void): this {
    const inner = new PlistWriter(this.level + 1);
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
    const inner = new PlistWriter(this.level + 1);
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
    this.w(`<key>${escapeXml(k)}</key>`);
    return this;
  }

  string(value: string): this {
    this.w(`<string>${escapeXml(value)}</string>`);
    return this;
  }

  integer(value: number): this {
    if (!Number.isFinite(value)) {
      throw new Error("Invalid plist integer");
    }

    let integerValue = value;
    if (!Number.isInteger(value)) {
      integerValue = Math.round(value);
      console.warn(`Non-integer plist value ${value} rounded to ${integerValue}`);
    }

    this.w(`<integer>${integerValue}</integer>`);
    return this;
  }

  real(value: number): this {
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
      throw new Error("Invalid plist date");
    }

    // ISO 8601 formatted string
    this.w(`<date>${value.toISOString().replace(/\.\d{3}Z$/, "Z")}</date>`);
    return this;
  }

  bool(value: boolean): this {
    this.w(value ? "<true/>" : "<false/>");
    return this;
  }

  keyString(key: string, value: string): this {
    return this.key(key).string(value);
  }

  keyInteger(key: string, value: number): this {
    return this.key(key).integer(value);
  }

  keyReal(key: string, value: number): this {
    return this.key(key).real(value);
  }

  keyBool(key: string, value: boolean): this {
    return this.key(key).bool(value);
  }

  keyDate(key: string, value: Date): this {
    return this.key(key).date(value);
  }

  keyDict(key: string, fn: (w: PlistWriter) => void): this {
    return this.key(key).dict(fn);
  }

  keyArray(key: string, fn: (w: PlistWriter) => void): this {
    return this.key(key).array(fn);
  }

  optKeyString(key: string, value: string | undefined): this {
    if (value !== undefined) this.keyString(key, value);
    return this;
  }

  optKeyBool(key: string, value: boolean | undefined): this {
    if (value !== undefined) this.keyBool(key, value);
    return this;
  }

  optKeyInteger(key: string, value: number | undefined): this {
    if (value !== undefined) this.keyInteger(key, value);
    return this;
  }

  optKeyReal(key: string, value: number | undefined): this {
    if (value !== undefined) this.keyReal(key, value);
    return this;
  }

  optKeyDate(key: string, value: Date | undefined): this {
    if (value !== undefined) this.keyDate(key, value);
    return this;
  }

  data(value: string): this {
    this.w(`<data>${value}</data>`);
    return this;
  }

  keyData(key: string, value: string): this {
    return this.key(key).data(value);
  }

  optKeyData(key: string, value: string | undefined): this {
    if (value !== undefined) this.keyData(key, value);
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
