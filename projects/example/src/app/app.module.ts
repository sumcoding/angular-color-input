import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ColorInputModule } from '../../../color-input/src/public_api';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    ColorInputModule,
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
