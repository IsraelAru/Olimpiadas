import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { DiarioComponent } from './list/diario.component';
import { DiarioDetailComponent } from './detail/diario-detail.component';
import { DiarioUpdateComponent } from './update/diario-update.component';
import { DiarioDeleteDialogComponent } from './delete/diario-delete-dialog.component';
import { DiarioRoutingModule } from './route/diario-routing.module';

@NgModule({
  imports: [SharedModule, DiarioRoutingModule],
  declarations: [DiarioComponent, DiarioDetailComponent, DiarioUpdateComponent, DiarioDeleteDialogComponent],
  entryComponents: [DiarioDeleteDialogComponent],
})
export class DiarioModule {}
