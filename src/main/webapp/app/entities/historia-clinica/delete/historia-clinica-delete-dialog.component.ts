import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IHistoriaClinica } from '../historia-clinica.model';
import { HistoriaClinicaService } from '../service/historia-clinica.service';

@Component({
  templateUrl: './historia-clinica-delete-dialog.component.html',
})
export class HistoriaClinicaDeleteDialogComponent {
  historiaClinica?: IHistoriaClinica;

  constructor(protected historiaClinicaService: HistoriaClinicaService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: string): void {
    this.historiaClinicaService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
