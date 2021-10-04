jest.mock('@ng-bootstrap/ng-bootstrap');

import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { HistoriaClinicaService } from '../service/historia-clinica.service';

import { HistoriaClinicaDeleteDialogComponent } from './historia-clinica-delete-dialog.component';

describe('Component Tests', () => {
  describe('HistoriaClinica Management Delete Component', () => {
    let comp: HistoriaClinicaDeleteDialogComponent;
    let fixture: ComponentFixture<HistoriaClinicaDeleteDialogComponent>;
    let service: HistoriaClinicaService;
    let mockActiveModal: NgbActiveModal;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [HistoriaClinicaDeleteDialogComponent],
        providers: [NgbActiveModal],
      })
        .overrideTemplate(HistoriaClinicaDeleteDialogComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(HistoriaClinicaDeleteDialogComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(HistoriaClinicaService);
      mockActiveModal = TestBed.inject(NgbActiveModal);
    });

    describe('confirmDelete', () => {
      it('Should call delete service on confirmDelete', inject(
        [],
        fakeAsync(() => {
          // GIVEN
          spyOn(service, 'delete').and.returnValue(of({}));

          // WHEN
          comp.confirmDelete('ABC');
          tick();

          // THEN
          expect(service.delete).toHaveBeenCalledWith('ABC');
          expect(mockActiveModal.close).toHaveBeenCalledWith('deleted');
        })
      ));

      it('Should not call delete service on clear', () => {
        // GIVEN
        spyOn(service, 'delete');

        // WHEN
        comp.cancel();

        // THEN
        expect(service.delete).not.toHaveBeenCalled();
        expect(mockActiveModal.close).not.toHaveBeenCalled();
        expect(mockActiveModal.dismiss).toHaveBeenCalled();
      });
    });
  });
});
