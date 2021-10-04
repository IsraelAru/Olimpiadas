import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { DiarioComponent } from '../list/diario.component';
import { DiarioDetailComponent } from '../detail/diario-detail.component';
import { DiarioUpdateComponent } from '../update/diario-update.component';
import { DiarioRoutingResolveService } from './diario-routing-resolve.service';

const diarioRoute: Routes = [
  {
    path: '',
    component: DiarioComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: DiarioDetailComponent,
    resolve: {
      diario: DiarioRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: DiarioUpdateComponent,
    resolve: {
      diario: DiarioRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: DiarioUpdateComponent,
    resolve: {
      diario: DiarioRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(diarioRoute)],
  exports: [RouterModule],
})
export class DiarioRoutingModule {}
