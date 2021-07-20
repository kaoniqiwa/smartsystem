export interface IFlags extends NumberConstructor {
  Value: number[];
}

export class Flags<T extends number> {
  value: number;
  constructor(val: number) {
    this.value = val;
  }
  getValues(): T[] {
    let result = new Array<T>();
    let str = this.value.toString(2);

    for (let i = str.length - 1, x = 0; i >= 0; i--, x++) {
      let value = parseInt(str[i]);
      if (value) {
        let v = Math.pow(2, x);
        result.push(v as T);
      }
    }

    return result;
  }
  contains(t: T) {
    return this.getValues().indexOf(t) >= 0;
    // return this.getValues().includes(t)
  }
  valueOf(): number {
    return this.value;
  }
}
