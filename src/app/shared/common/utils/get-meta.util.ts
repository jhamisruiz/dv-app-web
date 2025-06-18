import { NsDocumentOptions } from '../decorators/document.decorator';
import { METADATA_PREFIX } from '../decorators';

export const GetMeta = (target: any, prefix: string, isConstructor = false): any => {
  const meta = target || { constructor: {} };
  const properties = !isConstructor ? { ...meta.constructor } : meta;
  return Object.keys(properties).reduce((a, b) => {
    if (b.startsWith(prefix)) {
      a[b.replace(prefix, '')] = properties[b];
    }
    return a;
  }, {} as any);
};


export const GetMetaOptions = (target: any, isConstructor = false): NsDocumentOptions => GetMeta(target, METADATA_PREFIX, isConstructor);
