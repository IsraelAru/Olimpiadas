import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { HistoriaClinicaComponent } from '../list/historia-clinica.component';
import { HistoriaClinicaDetailComponent } from '../detail/historia-clinica-detail.component';
import { HistoriaClinicaUpdateComponent } from '../update/historia-clinica-update.component';
import { HistoriaClinicaRoutingResolveService } from './historia-clinica-routing-resolve.service';

const historiaClinicaRoute: Routes = [
  {
    path: '',
    component: HistoriaClinicaComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: HistoriaClinicaDetailComponent,
    resolve: {
      historiaClinica: HistoriaClinicaRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: HistoriaClinicaUpdateComponent,
    resolve: {
      historiaClinica: HistoriaClinicaRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: HistoriaClinicaUpdateComponent,
    resolve: {
      historiaClinica: HistoriaClinicaRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(historiaClinicaRoute)],
  exports: [RouterModule],
})
export class HistoriaClinicaRoutingModule {}
