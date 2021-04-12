import { Pipe, PipeTransform } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';

@Pipe({
  name: 'asFormGroup',
  pure: true,
})
export class AsFormGroupPipe implements PipeTransform {
  transform(value: AbstractControl): FormGroup {
    return value as FormGroup;
  }
}
