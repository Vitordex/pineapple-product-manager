import { NgModule } from '@angular/core';

import { FeatherModule } from 'angular-feather';
import { Trash, FileText } from 'angular-feather/icons';

// Select some icons (use an object, not an array)
const icons = {
  Trash, FileText
};

@NgModule({
  imports: [
    FeatherModule.pick(icons)
  ],
  exports: [
    FeatherModule
  ]
})
export class IconsModule { }