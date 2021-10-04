jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { HistoriaClinicaService } from '../service/historia-clinica.service';
import { IHistoriaClinica, HistoriaClinica } from '../historia-clinica.model';

import { HistoriaClinicaUpdateComponent } from './historia-clinica-update.component';

describe('Component Tests', () => {
  describe('HistoriaClinica Management Update Component', () => {
    let comp: HistoriaClinicaUpdateComponent;
    let fixture: ComponentFixture<HistoriaClinicaUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let historiaClinicaService: HistoriaClinicaService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [HistoriaClinicaUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(HistoriaClinicaUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(HistoriaClinicaUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      historiaClinicaService = TestBed.inject(HistoriaClinicaService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update editForm', () => {
        const historiaClinica: IHistoriaClinica = { id: 'CBA' };

        activatedRoute.data = of({ historiaClinica });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(historiaClinica));
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const historiaClinica = { id: 'ABC' };
        spyOn(historiaClinicaService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ historiaClinica });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: historiaClinica }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(historiaClinicaService.update).toHaveBeenCalledWith(historiaClinica);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const historiaClinica = new HistoriaClinica();
        spyOn(historiaClinicaService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ historiaClinica });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: historiaClinica }));
        saveSubject.complete();

        // THEN
        expect(historiaClinicaService.create).toHaveBeenCalledWith(historiaClinica);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const historiaClinica = { id: 'ABC' };
        spyOn(historiaClinicaService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ historiaClinica });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(historiaClinicaService.update).toHaveBeenCalledWith(historiaClinica);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });
  });
});
