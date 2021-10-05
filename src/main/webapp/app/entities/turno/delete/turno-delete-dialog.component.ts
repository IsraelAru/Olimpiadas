import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ITurno } from '../turno.model';
import { TurnoService } from '../service/turno.service';

@Component({
  templateUrl: './turno-delete-dialog.component.html',
})
export class TurnoDeleteDialogComponent {
  turno?: ITurno;

  constructor(protected turnoService: TurnoService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: string): void {
    this.turnoService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
