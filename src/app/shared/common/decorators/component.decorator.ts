import { Type } from '@angular/core';

export function AppDocument(config: { fullPath: string }) {
  return (target: Type<any>): void => {
    target.prototype.fullPath = config.fullPath;
  };
}
