import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import * as dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IHistoriaClinica, HistoriaClinica } from '../historia-clinica.model';
import { HistoriaClinicaService } from '../service/historia-clinica.service';

@Component({
  selector: 'jhi-historia-clinica-update',
  templateUrl: './historia-clinica-update.component.html',
})
export class HistoriaClinicaUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    diagnostico: [null, [Validators.required]],
    tratamiento: [null, [Validators.required]],
    categoria: [null, [Validators.required]],
    fecha: [null, [Validators.required]],
  });

  constructor(
    protected historiaClinicaService: HistoriaClinicaService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ historiaClinica }) => {
      if (historiaClinica.id === undefined) {
        const today = dayjs().startOf('day');
        historiaClinica.fecha = today;
      }

      this.updateForm(historiaClinica);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const historiaClinica = this.createFromForm();
    if (historiaClinica.id !== undefined) {
      this.subscribeToSaveResponse(this.historiaClinicaService.update(historiaClinica));
    } else {
      this.subscribeToSaveResponse(this.historiaClinicaService.create(historiaClinica));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IHistoriaClinica>>): void {
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

  protected updateForm(historiaClinica: IHistoriaClinica): void {
    this.editForm.patchValue({
      id: historiaClinica.id,
      diagnostico: historiaClinica.diagnostico,
      tratamiento: historiaClinica.tratamiento,
      categoria: historiaClinica.categoria,
      fecha: historiaClinica.fecha ? historiaClinica.fecha.format(DATE_TIME_FORMAT) : null,
    });
  }

  protected createFromForm(): IHistoriaClinica {
    return {
      ...new HistoriaClinica(),
      id: this.editForm.get(['id'])!.value,
      diagnostico: this.editForm.get(['diagnostico'])!.value,
      tratamiento: this.editForm.get(['tratamiento'])!.value,
      categoria: this.editForm.get(['categoria'])!.value,
      fecha: this.editForm.get(['fecha'])!.value ? dayjs(this.editForm.get(['fecha'])!.value, DATE_TIME_FORMAT) : undefined,
    };
  }
}
