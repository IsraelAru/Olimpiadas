import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IDiario } from '../diario.model';
import { DiarioService } from '../service/diario.service';

@Component({
  templateUrl: './diario-delete-dialog.component.html',
})
export class DiarioDeleteDialogComponent {
  diario?: IDiario;

  constructor(protected diarioService: DiarioService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: string): void {
    this.diarioService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
