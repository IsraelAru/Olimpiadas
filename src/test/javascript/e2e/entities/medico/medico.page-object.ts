import { element, by, ElementFinder } from 'protractor';

export class MedicoComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-medico div table .btn-danger'));
  title = element.all(by.css('jhi-medico div h2#page-heading span')).first();
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

export class MedicoUpdatePage {
  pageTitle = element(by.id('jhi-medico-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));

  idInput = element(by.id('field_id'));
  dniInput = element(by.id('field_dni'));
  matriculaInput = element(by.id('field_matricula'));
  nombreInput = element(by.id('field_nombre'));
  apellidoInput = element(by.id('field_apellido'));
  telefonoInput = element(by.id('field_telefono'));
  atiendeDiscapacitadosInput = element(by.id('field_atiendeDiscapacitados'));
  historiaTurnosInput = element(by.id('field_historiaTurnos'));
  especialidadSelect = element(by.id('field_especialidad'));

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

  async setMatriculaInput(matricula: string): Promise<void> {
    await this.matriculaInput.sendKeys(matricula);
  }

  async getMatriculaInput(): Promise<string> {
    return await this.matriculaInput.getAttribute('value');
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

  getAtiendeDiscapacitadosInput(): ElementFinder {
    return this.atiendeDiscapacitadosInput;
  }

  async setHistoriaTurnosInput(historiaTurnos: string): Promise<void> {
    await this.historiaTurnosInput.sendKeys(historiaTurnos);
  }

  async getHistoriaTurnosInput(): Promise<string> {
    return await this.historiaTurnosInput.getAttribute('value');
  }

  async setEspecialidadSelect(especialidad: string): Promise<void> {
    await this.especialidadSelect.sendKeys(especialidad);
  }

  async getEspecialidadSelect(): Promise<string> {
    return await this.especialidadSelect.element(by.css('option:checked')).getText();
  }

  async especialidadSelectLastOption(): Promise<void> {
    await this.especialidadSelect.all(by.tagName('option')).last().click();
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

export class MedicoDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-medico-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-medico'));

  async getDialogTitle(): Promise<string> {
    return this.dialogTitle.getAttribute('jhiTranslate');
  }

  async clickOnConfirmButton(): Promise<void> {
    await this.confirmButton.click();
  }
}
