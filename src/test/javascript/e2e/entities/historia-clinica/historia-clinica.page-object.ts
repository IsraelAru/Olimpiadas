import { element, by, ElementFinder } from 'protractor';

export class HistoriaClinicaComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-historia-clinica div table .btn-danger'));
  title = element.all(by.css('jhi-historia-clinica div h2#page-heading span')).first();
  noResult = element(by.id('no-result'));
  entities = element(by.id('entities'));

  async clickOnCreateButton(): Promise<void> {
    await this.createButton.click();
  }

  async clickOnLastDeleteButton(): Promise<void> {
    await this.deleteButtons.last().click();
  }

  async countDeleteButtons(): Promise<number> {
    return this.deleteButtons.count();
  }

  async getTitle(): Promise<string> {
    return this.title.getAttribute('jhiTranslate');
  }
}

export class HistoriaClinicaUpdatePage {
  pageTitle = element(by.id('jhi-historia-clinica-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));

  idInput = element(by.id('field_id'));
  diagnosticoInput = element(by.id('field_diagnostico'));
  tratamientoInput = element(by.id('field_tratamiento'));
  categoriaSelect = element(by.id('field_categoria'));
  fechaInput = element(by.id('field_fecha'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getAttribute('jhiTranslate');
  }

  async setIdInput(id: string): Promise<void> {
    await this.idInput.sendKeys(id);
  }

  async getIdInput(): Promise<string> {
    return await this.idInput.getAttribute('value');
  }

  async setDiagnosticoInput(diagnostico: string): Promise<void> {
    await this.diagnosticoInput.sendKeys(diagnostico);
  }

  async getDiagnosticoInput(): Promise<string> {
    return await this.diagnosticoInput.getAttribute('value');
  }

  async setTratamientoInput(tratamiento: string): Promise<void> {
    await this.tratamientoInput.sendKeys(tratamiento);
  }

  async getTratamientoInput(): Promise<string> {
    return await this.tratamientoInput.getAttribute('value');
  }

  async setCategoriaSelect(categoria: string): Promise<void> {
    await this.categoriaSelect.sendKeys(categoria);
  }

  async getCategoriaSelect(): Promise<string> {
    return await this.categoriaSelect.element(by.css('option:checked')).getText();
  }

  async categoriaSelectLastOption(): Promise<void> {
    await this.categoriaSelect.all(by.tagName('option')).last().click();
  }

  async setFechaInput(fecha: string): Promise<void> {
    await this.fechaInput.sendKeys(fecha);
  }

  async getFechaInput(): Promise<string> {
    return await this.fechaInput.getAttribute('value');
  }

  async save(): Promise<void> {
    await this.saveButton.click();
  }

  async cancel(): Promise<void> {
    await this.cancelButton.click();
  }

  getSaveButton(): ElementFinder {
    return this.saveButton;
  }
}

export class HistoriaClinicaDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-historiaClinica-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-historiaClinica'));

  async getDialogTitle(): Promise<string> {
    return this.dialogTitle.getAttribute('jhiTranslate');
  }

  async clickOnConfirmButton(): Promise<void> {
    await this.confirmButton.click();
  }
}
