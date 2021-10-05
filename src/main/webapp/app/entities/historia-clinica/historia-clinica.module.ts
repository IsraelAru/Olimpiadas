import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { HistoriaClinicaComponent } from './list/historia-clinica.component';
import { HistoriaClinicaDetailComponent } from './detail/historia-clinica-detail.component';
import { HistoriaClinicaUpdateComponent } from './update/historia-clinica-update.component';
import { HistoriaClinicaDeleteDialogComponent } from './delete/historia-clinica-delete-dialog.component';
import { HistoriaClinicaRoutingModule } from './route/historia-clinica-routing.module';

@NgModule({
  imports: [SharedModule, HistoriaClinicaRoutingModule],
  declarations: [
    HistoriaClinicaComponent,
    HistoriaClinicaDetailComponent,
    HistoriaClinicaUpdateComponent,
    HistoriaClinicaDeleteDialogComponent,
  ],
  entryComponents: [HistoriaClinicaDeleteDialogComponent],
})
export class HistoriaClinicaModule {}
