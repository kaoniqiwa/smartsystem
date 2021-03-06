declare interface String {
  content(string: String): boolean;
  gb2812_length(): number;
  gblen(): number;
  Equals(a: String, b: String): boolean;
  trim(): string;
  isValidIP(): boolean;
  format(...args: any[]): string;
}
declare interface StringConstructor {
  naturalCompare<T>(a: T, b: T): number;
}
declare interface Date {
  toLocalJSON(): string;
  format(fmt: string): string;
  addMinutes(m: number): void;
  addMonths(m: number): void;
  addDays(d: number): void;
  toISOString(): string;
}

declare interface Array<T> {
  orderBy(a: T, b: T): Array<T>;
}
