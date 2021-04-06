import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { reducer } from './io.reducer';

@NgModule({
  declarations: [],
  imports: [HttpClientModule, StoreModule.forFeature('io', reducer)],
})
export class IoModule {}
