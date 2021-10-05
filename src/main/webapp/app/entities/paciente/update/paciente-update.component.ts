import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IPaciente, Paciente } from '../paciente.model';
import { PacienteService } from '../service/paciente.service';

@Component({
  selector: 'jhi-paciente-update',
  templateUrl: './paciente-update.component.html',
})
export class PacienteUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    dni: [null, [Validators.required]],
    nombre: [],
    apellido: [null, [Validators.required]],
    telefono: [],
    historiaClinica: [null, [Validators.required]],
    mail: [],
  });

  constructor(protected pacienteService: PacienteService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ paciente }) => {
      this.updateForm(paciente);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const paciente = this.createFromForm();
    if (paciente.id !== undefined) {
      this.subscribeToSaveResponse(this.pacienteService.update(paciente));
    } else {
      this.subscribeToSaveResponse(this.pacienteService.create(paciente));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPaciente>>): void {
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

  protected updateForm(paciente: IPaciente): void {
    this.editForm.patchValue({
      id: paciente.id,
      dni: paciente.dni,
      nombre: paciente.nombre,
      apellido: paciente.apellido,
      telefono: paciente.telefono,
      historiaClinica: paciente.historiaClinica,
      mail: paciente.mail,
    });
  }

  protected createFromForm(): IPaciente {
    return {
      ...new Paciente(),
      id: this.editForm.get(['id'])!.value,
      dni: this.editForm.get(['dni'])!.value,
      nombre: this.editForm.get(['nombre'])!.value,
      apellido: this.editForm.get(['apellido'])!.value,
      telefono: this.editForm.get(['telefono'])!.value,
      historiaClinica: this.editForm.get(['historiaClinica'])!.value,
      mail: this.editForm.get(['mail'])!.value,
    };
  }
}
