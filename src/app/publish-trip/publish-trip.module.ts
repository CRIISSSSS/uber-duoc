import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PublishTripPageRoutingModule } from './publish-trip-routing.module';

import { PublishTripPage } from './publish-trip.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PublishTripPageRoutingModule
  ],
  declarations: [PublishTripPage]
})
export class PublishTripPageModule {}
