import { element, by, ElementFinder } from 'protractor';

export class TurnoComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-turno div table .btn-danger'));
  title = element.all(by.css('jhi-turno div h2#page-heading span')).first();
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

export class TurnoUpdatePage {
  pageTitle = element(by.id('jhi-turno-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));

  idInput = element(by.id('field_id'));
  estadoSelect = element(by.id('field_estado'));
  fechaHoraInput = element(by.id('field_fechaHora'));
  motivoInput = element(by.id('field_motivo'));
  descripcionInput = element(by.id('field_descripcion'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getAttribute('jhiTranslate');
  }

  async setIdInput(id: string): Promise<void> {
    await this.idInput.sendKeys(id);
  }

  async getIdInput(): Promise<string> {
    return await this.idInput.getAttribute('value');
  }

  async setEstadoSelect(estado: string): Promise<void> {
    await this.estadoSelect.sendKeys(estado);
  }

  async getEstadoSelect(): Promise<string> {
    return await this.estadoSelect.element(by.css('option:checked')).getText();
  }

  async estadoSelectLastOption(): Promise<void> {
    await this.estadoSelect.all(by.tagName('option')).last().click();
  }

  async setFechaHoraInput(fechaHora: string): Promise<void> {
    await this.fechaHoraInput.sendKeys(fechaHora);
  }

  async getFechaHoraInput(): Promise<string> {
    return await this.fechaHoraInput.getAttribute('value');
  }

  async setMotivoInput(motivo: string): Promise<void> {
    await this.motivoInput.sendKeys(motivo);
  }

  async getMotivoInput(): Promise<string> {
    return await this.motivoInput.getAttribute('value');
  }

  async setDescripcionInput(descripcion: string): Promise<void> {
    await this.descripcionInput.sendKeys(descripcion);
  }

  async getDescripcionInput(): Promise<string> {
    return await this.descripcionInput.getAttribute('value');
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

export class TurnoDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-turno-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-turno'));

  async getDialogTitle(): Promise<string> {
    return this.dialogTitle.getAttribute('jhiTranslate');
  }

  async clickOnConfirmButton(): Promise<void> {
    await this.confirmButton.click();
  }
}
