import { Location } from '@angular/common';
import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appNavigateBack]'
})
export class NavigateBackDirective {

  constructor(
    private location: Location,
  ) { }

  @HostListener('click')
  navigateBack() {
    this.location.back();
  }

}
