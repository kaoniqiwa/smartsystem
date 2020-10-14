/**
 *   取位数 
 * @param 值 
 * @param 第几位 
 */
export function getBitNo(param: any, no: any) {
    let bs = new BitSet(param);
    return bs.get(no - 1) == 1;
  }
  
export class BitSet {
    /** https://github.com/infusion/bitset.js */
    WORD_LENGTH = 32;
    WORD_LOG = 5;
    P = {
      'data': [], // Holds the actual bits in form of a 32bit integer array.
      '_': 0 // Holds the MSB flag information to make indefinitely large bitsets inversion-proof
    };
    data = new Array();
    _ = 0;
    constructor(param) {
      if (!(this instanceof BitSet)) {
        return new BitSet(param);
      }
      this.parse(this, param);
      this['data'] = this['data'].slice();
    }
  
    popCount(v) {
  
      // Warren, H. (2009). Hacker`s Delight. New York, NY: Addison-Wesley
  
      v -= ((v >>> 1) & 0x55555555);
      v = (v & 0x33333333) + ((v >>> 2) & 0x33333333);
      return (((v + (v >>> 4) & 0xF0F0F0F) * 0x1010101) >>> 24);
    }
  
    divide(arr, B) {
  
      var r = 0;
  
      for (var i = 0; i < arr.length; i++) {
        r *= 2;
        var d = (arr[i] + r) / B | 0;
        r = (arr[i] + r) % B;
        arr[i] = d;
      }
      return r;
    }
  
    set(ndx, value) {
  
      ndx |= 0;
  
      this.scale(this, ndx);
  
      if (value === undefined || value) {
        this['data'][ndx >>> this.WORD_LOG] |= (1 << ndx);
      } else {
        this['data'][ndx >>> this.WORD_LOG] &= ~(1 << ndx);
      }
      return this;
    }
  
    not() {
      var t = this['clone']();
      var d = t['data'];
      for (var i = 0; i < d.length; i++) {
        d[i] = ~d[i];
      }
  
      t['_'] = ~t['_'];
  
      return t;
    }
  
    and(value) {// intersection
  
      this.parse(this.P, value);
  
      var T = this['clone']();
      var t = T['data'];
      var p = this.P['data'];
  
      var pl = p.length;
      var p_ = this.P['_'];
      var t_ = T['_'];
  
      // If this is infinite, we need all bits from P
      if (t_ !== 0) {
        this.scale(T, pl * this.WORD_LENGTH - 1);
      }
  
      var tl = t.length;
      var l = Math.min(pl, tl);
      var i = 0;
  
      for (; i < l; i++) {
        t[i] &= p[i];
      }
  
      for (; i < tl; i++) {
        t[i] &= p_;
      }
  
      T['_'] &= p_;
  
      return T;
    }
  
    or(val) { // union
  
      this.parse(this.P, val);
  
      var t = this['clone']();
      var d = t['data'];
      var p = this.P['data'];
  
      var pl = p.length - 1;
      var tl = d.length - 1;
  
      var minLength = Math.min(tl, pl);
  
      // Append backwards, extend array only once
      for (var i = pl; i > minLength; i--) {
        d[i] = p[i];
      }
  
      for (; i >= 0; i--) {
        d[i] |= p[i];
      }
  
      t['_'] |= this.P['_'];
  
      return t;
    }
    get(ndx) {
  
      ndx |= 0;
  
      var d = this['data'];
      var n = ndx >>> this.WORD_LOG;
  
      if (n >= d.length) {
        return this['_'] & 1;
      }
      return (d[n] >>> ndx) & 1;
    }
  
    parse(P, val) {
  
      if (val == null) {
        P['data'] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        P['_'] = 0;
        return;
      }
  
      if (val instanceof BitSet) {
        P['data'] = val['data'];
        P['_'] = val['_'];
        return;
      }
  
      switch (typeof val) {
  
        case 'number':
          P['data'] = [val | 0];
          P['_'] = 0;
          break;
  
        case 'string':
  
          var base = 2;
          var len = this.WORD_LENGTH;
  
          if (val.indexOf('0b') === 0) {
            val = val.substr(2);
          } else if (val.indexOf('0x') === 0) {
            val = val.substr(2);
            base = 16;
            len = 8;
          }
  
          P['data'] = [];
          P['_'] = 0;
  
          var a = val.length - len;
          var b = val.length;
  
          do {
  
            var num = parseInt(val.slice(a > 0 ? a : 0, b), base);
  
            if (isNaN(num)) {
              throw SyntaxError('Invalid param');
            }
  
            P['data'].push(num | 0);
  
            if (a <= 0)
              break;
  
            a -= len;
            b -= len;
          } while (1);
  
          break;
  
        default:
  
          P['data'] = [0];
          var data = P['data'];
  
          if (val instanceof Array) {
  
            for (var i = val.length - 1; i >= 0; i--) {
  
              var ndx = val[i];
  
              if (ndx === Infinity) {
                P['_'] = -1;
              } else {
                this.scale(P, ndx);
                data[ndx >>> this.WORD_LOG] |= 1 << ndx;
              }
            }
            break;
          }
  
          if (Uint8Array && val instanceof Uint8Array) {
  
            var bits = 8;
  
            this.scale(P, val.length * bits);
  
            for (var i = 0; i < val.length; i++) {
  
              var n = val[i];
  
              for (var j = 0; j < bits; j++) {
  
                var k = i * bits + j;
  
                data[k >>> this.WORD_LOG] |= (n >> j & 1) << k;
              }
            }
            break;
          }
          throw SyntaxError('Invalid param');
      }
    }
  
    scale(dst, ndx) {
  
      var l = ndx >>> this.WORD_LOG;
      var d = dst['data'];
      var v = dst['_'];
  
      for (var i = d.length; l >= i; l--) {
        d.push(v);
      }
    }
  
  }
  