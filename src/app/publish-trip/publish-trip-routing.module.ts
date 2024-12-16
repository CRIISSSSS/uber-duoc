import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PublishTripPage } from './publish-trip.page';

const routes: Routes = [
  {
    path: '',
    component: PublishTripPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PublishTripPageRoutingModule {}
