export class ConversionService {
  VOID: string;
  SP: string;
  DOT: string;
  ZERO: string;
  NEG: string;

  constructor() {
    this.VOID = '';
    this.SP = ' ';
    this.DOT = '.';
    this.ZERO = '0';
    this.NEG = 'Menos';
  }

  valorEnLetras(x: number, moneda: string): string {
    const amountString = parseFloat(x.toFixed(2)).toString();
    const signo = x < 0 ? this.NEG + ' ' : '';

    const [ent, frc] = amountString.split(this.DOT);

    let amountInWords = '';
    if (ent === this.ZERO || ent === this.VOID) {
      amountInWords = 'CERO';
    } else if (ent.length > 7) {
      amountInWords =
        this.subValLetra(parseInt(ent.substring(0, ent.length - 6))) +
        'MILLONES ' +
        this.subValLetra(parseInt(ent.substring(ent.length - 6, 6)));
    } else {
      amountInWords = this.subValLetra(parseInt(ent));
    }

    if (amountInWords.slice(-9) === 'MILLONES ' || amountInWords.slice(-7) === 'MILLÓN ') {
      amountInWords = amountInWords + 'DE ';
    }

    if (frc !== this.VOID) {
      amountInWords = amountInWords + ' CON ' + (frc ?? 0) + '/100';
    }

    return signo + amountInWords + ' ' + moneda;
  }

  subValLetra(numero: number): string {
    let result = '';
    let tem = '';

    const x = `${numero}`.trim();
    const n = x.length;

    tem = this.VOID;

    for (let i = n; i > 0; i--) {
      tem = this.parte(parseInt(x.substring(n - i, n - i + 1) + this.ZERO.repeat(i - 1)));
      if (tem !== 'CERO') {
        result += tem + this.SP;
      }
    }

    result = result.replace(' MIL MIL', ' UN MIL');
    let ptr = -1;
    do {
      ptr = result.indexOf('CIEN ', ptr + 1);
      if (ptr !== -1) {
        tem = result.substring(ptr + 5, 1);
        if (tem === 'M' || tem === this.VOID) {
          // do nothing
        } else {
          result = this.replaceStringFrom(result, 'CIEN', 'CIENTO', ptr);
        }
      }
    } while (ptr !== -1);

    result = result.replace('DIEZ UNO', 'ONCE')
      .replace('DIEZ DOS', 'DOCE')
      .replace('DIEZ TRES', 'TRECE')
      .replace('DIEZ CUATRO', 'CATORCE')
      .replace('DIEZ CINCO', 'QUINCE')
      .replace('DIEZ SEIS', 'DIECISEIS')
      .replace('DIEZ SIETE', 'DIECISIETE')
      .replace('DIEZ OCHO', 'DIECIOCHO')
      .replace('DIEZ NUEVE', 'DIECINUEVE')
      .replace('VEINTE UN', 'VEINTIUN')
      .replace('VEINTE DOS', 'VEINTIDOS')
      .replace('VEINTE TRES', 'VEINTITRES')
      .replace('VEINTE CUATRO', 'VEINTICUATRO')
      .replace('VEINTE CINCO', 'VEINTICINCO')
      .replace('VEINTE SEIS', 'VEINTISEIS')
      .replace('VEINTE SIETE', 'VEINTISIETE')
      .replace('VEINTE OCHO', 'VEINTIOCHO')
      .replace('VEINTE NUEVE', 'VEINTINUEVE');

    if (result.charAt(0) === 'M') {
      result = ' ' + result;
    }

    for (let i = 65; i <= 88; i++) {
      if (i !== 77) {
        result = result.replace(`A ${String.fromCharCode(i)}`, `* Y ${String.fromCharCode(i)}`);
      }
    }

    result = result.replace('*', 'A');

    return result;
  }

  replaceStringFrom(x: string, oldWrd: string, newWrd: string, ptr: number): string {
    return x.substring(0, ptr) + newWrd + x.substring(oldWrd.length + ptr);
  }

  parte(x: number): string {
    let result = '';
    let t = '';
    let i = 0;

    do {
      switch (x) {
        case 0:
          t = 'CERO';
          break;
        case 1:
          t = 'UNO';
          break;
        case 2:
          t = 'DOS';
          break;
        case 3:
          t = 'TRES';
          break;
        case 4:
          t = 'CUATRO';
          break;
        case 5:
          t = 'CINCO';
          break;
        case 6:
          t = 'SEIS';
          break;
        case 7:
          t = 'SIETE';
          break;
        case 8:
          t = 'OCHO';
          break;
        case 9:
          t = 'NUEVE';
          break;
        case 10:
          t = 'DIEZ';
          break;
        case 11:
          t = 'ONCE';
          break;
        case 12:
          t = 'DOCE';
          break;
        case 13:
          t = 'TRECE';
          break;
        case 14:
          t = 'CATORCE';
          break;
        case 15:
          t = 'QUINCE';
          break;
        case 16:
          t = 'DIECISEIS';
          break;
        case 17:
          t = 'DIECISIETE';
          break;
        case 18:
          t = 'DIECIOCHO';
          break;
        case 19:
          t = 'DIECINUEVE';
          break;
        case 20:
          t = 'VEINTE';
          break;
        case 21:
          t = 'VEINTIUN';
          break;
        case 22:
          t = 'VEINTIDOS';
          break;
        case 23:
          t = 'VEINTITRES';
          break;
        case 24:
          t = 'VEINTICUATRO';
          break;
        case 25:
          t = 'VEINTICINCO';
          break;
        case 26:
          t = 'VEINTISEIS';
          break;
        case 27:
          t = 'VEINTISIETE';
          break;
        case 28:
          t = 'VEINTIOCHO';
          break;
        case 29:
          t = 'VEINTINUEVE';
          break;
        case 30:
          t = 'TREINTA';
          break;
        case 40:
          t = 'CUARENTA';
          break;
        case 50:
          t = 'CINCUENTA';
          break;
        case 60:
          t = 'SESENTA';
          break;
        case 70:
          t = 'SETENTA';
          break;
        case 80:
          t = 'OCHENTA';
          break;
        case 90:
          t = 'NOVENTA';
          break;
        case 100:
          t = 'CIEN';
          break;
        case 200:
          t = 'DOSCIENTOS';
          break;
        case 300:
          t = 'TRESCIENTOS';
          break;
        case 400:
          t = 'CUATROCIENTOS';
          break;
        case 500:
          t = 'QUINIENTOS';
          break;
        case 600:
          t = 'SEISCIENTOS';
          break;
        case 700:
          t = 'SETECIENTOS';
          break;
        case 800:
          t = 'OCHOCIENTOS';
          break;
        case 900:
          t = 'NOVECIENTOS';
          break;
        case 1000:
          t = 'MIL';
          break;
        case 1000000:
          t = 'MILLÓN';
          break;
      }

      if (t === this.VOID) {
        i++;
        x = x / 1000;
        if (x === 0) i = 0;
      } else {
        break;
      }
    } while (i !== 0);

    result = t;
    switch (i) {
      case 0:
        t = this.VOID;
        break;
      case 1:
        t = ' MIL';
        break;
      case 2:
        t = ' MILLONES';
        break;
      case 3:
        t = ' BILLONES';
        break;
    }

    return result + t;
  }
}

