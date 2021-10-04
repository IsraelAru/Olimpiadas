import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IMedico, Medico } from '../medico.model';
import { MedicoService } from '../service/medico.service';

@Component({
  selector: 'jhi-medico-update',
  templateUrl: './medico-update.component.html',
})
export class MedicoUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    dni: [null, [Validators.required]],
    matricula: [null, [Validators.required]],
    nombre: [],
    apellido: [null, [Validators.required]],
    telefono: [],
    atiendeDiscapacitados: [null, [Validators.required]],
    historiaTurnos: [],
    especialidad: [null, [Validators.required]],
  });

  constructor(protected medicoService: MedicoService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ medico }) => {
      this.updateForm(medico);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const medico = this.createFromForm();
    if (medico.id !== undefined) {
      this.subscribeToSaveResponse(this.medicoService.update(medico));
    } else {
      this.subscribeToSaveResponse(this.medicoService.create(medico));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IMedico>>): void {
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

  protected updateForm(medico: IMedico): void {
    this.editForm.patchValue({
      id: medico.id,
      dni: medico.dni,
      matricula: medico.matricula,
      nombre: medico.nombre,
      apellido: medico.apellido,
      telefono: medico.telefono,
      atiendeDiscapacitados: medico.atiendeDiscapacitados,
      historiaTurnos: medico.historiaTurnos,
      especialidad: medico.especialidad,
    });
  }

  protected createFromForm(): IMedico {
    return {
      ...new Medico(),
      id: this.editForm.get(['id'])!.value,
      dni: this.editForm.get(['dni'])!.value,
      matricula: this.editForm.get(['matricula'])!.value,
      nombre: this.editForm.get(['nombre'])!.value,
      apellido: this.editForm.get(['apellido'])!.value,
      telefono: this.editForm.get(['telefono'])!.value,
      atiendeDiscapacitados: this.editForm.get(['atiendeDiscapacitados'])!.value,
      historiaTurnos: this.editForm.get(['historiaTurnos'])!.value,
      especialidad: this.editForm.get(['especialidad'])!.value,
    };
  }
}
