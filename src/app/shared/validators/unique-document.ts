import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export const UniqueDoc = (fn: (value: string) => Observable<any>): AsyncValidatorFn =>
  (control: AbstractControl): Observable<ValidationErrors | null> => fn(control.value)
    .pipe(
      map(res => {
        // if code is already taken
        if (res?.code && res.code === true) {
          // return error
          return { codeExist: true };
        }
        return null;
      }),
    );

