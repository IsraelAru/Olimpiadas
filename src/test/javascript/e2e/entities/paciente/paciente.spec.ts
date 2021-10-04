import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { PacienteComponentsPage, PacienteDeleteDialog, PacienteUpdatePage } from './paciente.page-object';

const expect = chai.expect;

describe('Paciente e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let pacienteComponentsPage: PacienteComponentsPage;
  let pacienteUpdatePage: PacienteUpdatePage;
  let pacienteDeleteDialog: PacienteDeleteDialog;
  const username = process.env.E2E_USERNAME ?? 'admin';
  const password = process.env.E2E_PASSWORD ?? 'admin';

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing(username, password);
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load Pacientes', async () => {
    await navBarPage.goToEntity('paciente');
    pacienteComponentsPage = new PacienteComponentsPage();
    await browser.wait(ec.visibilityOf(pacienteComponentsPage.title), 5000);
    expect(await pacienteComponentsPage.getTitle()).to.eq('diafragmaApp.paciente.home.title');
    await browser.wait(ec.or(ec.visibilityOf(pacienteComponentsPage.entities), ec.visibilityOf(pacienteComponentsPage.noResult)), 1000);
  });

  it('should load create Paciente page', async () => {
    await pacienteComponentsPage.clickOnCreateButton();
    pacienteUpdatePage = new PacienteUpdatePage();
    expect(await pacienteUpdatePage.getPageTitle()).to.eq('diafragmaApp.paciente.home.createOrEditLabel');
    await pacienteUpdatePage.cancel();
  });

  it('should create and save Pacientes', async () => {
    const nbButtonsBeforeCreate = await pacienteComponentsPage.countDeleteButtons();

    await pacienteComponentsPage.clickOnCreateButton();

    await promise.all([
      pacienteUpdatePage.setDniInput('5'),
      pacienteUpdatePage.setNombreInput('nombre'),
      pacienteUpdatePage.setApellidoInput('apellido'),
      pacienteUpdatePage.setTelefonoInput('5'),
      pacienteUpdatePage.setHistoriaClinicaInput('historiaClinica'),
      pacienteUpdatePage.setMailInput('mail'),
    ]);

    expect(await pacienteUpdatePage.getDniInput()).to.eq('5', 'Expected dni value to be equals to 5');
    expect(await pacienteUpdatePage.getNombreInput()).to.eq('nombre', 'Expected Nombre value to be equals to nombre');
    expect(await pacienteUpdatePage.getApellidoInput()).to.eq('apellido', 'Expected Apellido value to be equals to apellido');
    expect(await pacienteUpdatePage.getTelefonoInput()).to.eq('5', 'Expected telefono value to be equals to 5');
    expect(await pacienteUpdatePage.getHistoriaClinicaInput()).to.eq(
      'historiaClinica',
      'Expected HistoriaClinica value to be equals to historiaClinica'
    );
    expect(await pacienteUpdatePage.getMailInput()).to.eq('mail', 'Expected Mail value to be equals to mail');

    await pacienteUpdatePage.save();
    expect(await pacienteUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await pacienteComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last Paciente', async () => {
    const nbButtonsBeforeDelete = await pacienteComponentsPage.countDeleteButtons();
    await pacienteComponentsPage.clickOnLastDeleteButton();

    pacienteDeleteDialog = new PacienteDeleteDialog();
    expect(await pacienteDeleteDialog.getDialogTitle()).to.eq('diafragmaApp.paciente.delete.question');
    await pacienteDeleteDialog.clickOnConfirmButton();
    await browser.wait(ec.visibilityOf(pacienteComponentsPage.title), 5000);

    expect(await pacienteComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
