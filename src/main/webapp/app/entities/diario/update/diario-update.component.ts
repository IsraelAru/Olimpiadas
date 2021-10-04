import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import * as dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IDiario, Diario } from '../diario.model';
import { DiarioService } from '../service/diario.service';

@Component({
  selector: 'jhi-diario-update',
  templateUrl: './diario-update.component.html',
})
export class DiarioUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    entrada: [null, [Validators.required]],
    fecha: [null, [Validators.required]],
  });

  constructor(protected diarioService: DiarioService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ diario }) => {
      if (diario.id === undefined) {
        const today = dayjs().startOf('day');
        diario.fecha = today;
      }

      this.updateForm(diario);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const diario = this.createFromForm();
    if (diario.id !== undefined) {
      this.subscribeToSaveResponse(this.diarioService.update(diario));
    } else {
      this.subscribeToSaveResponse(this.diarioService.create(diario));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IDiario>>): void {
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

  protected updateForm(diario: IDiario): void {
    this.editForm.patchValue({
      id: diario.id,
      entrada: diario.entrada,
      fecha: diario.fecha ? diario.fecha.format(DATE_TIME_FORMAT) : null,
    });
  }

  protected createFromForm(): IDiario {
    return {
      ...new Diario(),
      id: this.editForm.get(['id'])!.value,
      entrada: this.editForm.get(['entrada'])!.value,
      fecha: this.editForm.get(['fecha'])!.value ? dayjs(this.editForm.get(['fecha'])!.value, DATE_TIME_FORMAT) : undefined,
    };
  }
}
