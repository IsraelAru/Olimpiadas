import { element, by, ElementFinder } from 'protractor';

export class PacienteComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-paciente div table .btn-danger'));
  title = element.all(by.css('jhi-paciente div h2#page-heading span')).first();
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

export class PacienteUpdatePage {
  pageTitle = element(by.id('jhi-paciente-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));

  idInput = element(by.id('field_id'));
  dniInput = element(by.id('field_dni'));
  nombreInput = element(by.id('field_nombre'));
  apellidoInput = element(by.id('field_apellido'));
  telefonoInput = element(by.id('field_telefono'));
  historiaClinicaInput = element(by.id('field_historiaClinica'));
  mailInput = element(by.id('field_mail'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getAttribute('jhiTranslate');
  }

  async setIdInput(id: string): Promise<void> {
    await this.idInput.sendKeys(id);
  }

  async getIdInput(): Promise<string> {
    return await this.idInput.getAttribute('value');
  }

  async setDniInput(dni: string): Promise<void> {
    await this.dniInput.sendKeys(dni);
  }

  async getDniInput(): Promise<string> {
    return await this.dniInput.getAttribute('value');
  }

  async setNombreInput(nombre: string): Promise<void> {
    await this.nombreInput.sendKeys(nombre);
  }

  async getNombreInput(): Promise<string> {
    return await this.nombreInput.getAttribute('value');
  }

  async setApellidoInput(apellido: string): Promise<void> {
    await this.apellidoInput.sendKeys(apellido);
  }

  async getApellidoInput(): Promise<string> {
    return await this.apellidoInput.getAttribute('value');
  }

  async setTelefonoInput(telefono: string): Promise<void> {
    await this.telefonoInput.sendKeys(telefono);
  }

  async getTelefonoInput(): Promise<string> {
    return await this.telefonoInput.getAttribute('value');
  }

  async setHistoriaClinicaInput(historiaClinica: string): Promise<void> {
    await this.historiaClinicaInput.sendKeys(historiaClinica);
  }

  async getHistoriaClinicaInput(): Promise<string> {
    return await this.historiaClinicaInput.getAttribute('value');
  }

  async setMailInput(mail: string): Promise<void> {
    await this.mailInput.sendKeys(mail);
  }

  async getMailInput(): Promise<string> {
    return await this.mailInput.getAttribute('value');
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

export class PacienteDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-paciente-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-paciente'));

  async getDialogTitle(): Promise<string> {
    return this.dialogTitle.getAttribute('jhiTranslate');
  }

  async clickOnConfirmButton(): Promise<void> {
    await this.confirmButton.click();
  }
}
