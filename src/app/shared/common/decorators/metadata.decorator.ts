export const METADATA_PREFIX = '__ns_meta__';
/**
 * Definir meta propiedades a una clase.
 *
 * @param meta Propiedades meta.
 */
export const NsMetadata = (meta?: any): (target: any) => void => (target: any): void => {
  SetMetadata(target, meta);
};


export const SetMetadata = (target: any, meta: any): void => {
  if ('object' === typeof meta) {
    for (const k in meta) {
      // eslint-disable-next-line no-prototype-builtins
      if (meta.hasOwnProperty(k)) {
        const prop = `${METADATA_PREFIX}${k}`;
        const accesor = `md${prop}$`;
        const secret = `_md${prop}$`;
        const value = meta[k];

        Object.defineProperty(target, accesor, {
          get(): string {
            if (this[secret]) {
              return this[secret];
            }
            this[secret] = value;
            return this[secret];
          },
        });

        Object.defineProperty(target, prop, {
          get(): string { return this[accesor]; },
          set(val): void {
            this[secret] = val;
          },
          enumerable: true,
        });
      }
    }
  }
};
