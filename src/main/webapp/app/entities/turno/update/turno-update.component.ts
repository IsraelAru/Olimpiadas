import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import * as dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { ITurno, Turno } from '../turno.model';
import { TurnoService } from '../service/turno.service';

@Component({
  selector: 'jhi-turno-update',
  templateUrl: './turno-update.component.html',
})
export class TurnoUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    estado: [null, [Validators.required]],
    fechaHora: [null, [Validators.required]],
    motivo: [null, [Validators.required]],
    descripcion: [],
  });

  constructor(protected turnoService: TurnoService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ turno }) => {
      if (turno.id === undefined) {
        const today = dayjs().startOf('day');
        turno.fechaHora = today;
      }

      this.updateForm(turno);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const turno = this.createFromForm();
    if (turno.id !== undefined) {
      this.subscribeToSaveResponse(this.turnoService.update(turno));
    } else {
      this.subscribeToSaveResponse(this.turnoService.create(turno));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITurno>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(turno: ITurno): void {
    this.editForm.patchValue({
      id: turno.id,
      estado: turno.estado,
      fechaHora: turno.fechaHora ? turno.fechaHora.format(DATE_TIME_FORMAT) : null,
      motivo: turno.motivo,
      descripcion: turno.descripcion,
    });
  }

  protected createFromForm(): ITurno {
    return {
      ...new Turno(),
      id: this.editForm.get(['id'])!.value,
      estado: this.editForm.get(['estado'])!.value,
      fechaHora: this.editForm.get(['fechaHora'])!.value ? dayjs(this.editForm.get(['fechaHora'])!.value, DATE_TIME_FORMAT) : undefined,
      motivo: this.editForm.get(['motivo'])!.value,
      descripcion: this.editForm.get(['descripcion'])!.value,
    };
  }
}
