import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { MedicoComponentsPage, MedicoDeleteDialog, MedicoUpdatePage } from './medico.page-object';

const expect = chai.expect;

describe('Medico e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let medicoComponentsPage: MedicoComponentsPage;
  let medicoUpdatePage: MedicoUpdatePage;
  let medicoDeleteDialog: MedicoDeleteDialog;
  const username = process.env.E2E_USERNAME ?? 'admin';
  const password = process.env.E2E_PASSWORD ?? 'admin';

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing(username, password);
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load Medicos', async () => {
    await navBarPage.goToEntity('medico');
    medicoComponentsPage = new MedicoComponentsPage();
    await browser.wait(ec.visibilityOf(medicoComponentsPage.title), 5000);
    expect(await medicoComponentsPage.getTitle()).to.eq('diafragmaApp.medico.home.title');
    await browser.wait(ec.or(ec.visibilityOf(medicoComponentsPage.entities), ec.visibilityOf(medicoComponentsPage.noResult)), 1000);
  });

  it('should load create Medico page', async () => {
    await medicoComponentsPage.clickOnCreateButton();
    medicoUpdatePage = new MedicoUpdatePage();
    expect(await medicoUpdatePage.getPageTitle()).to.eq('diafragmaApp.medico.home.createOrEditLabel');
    await medicoUpdatePage.cancel();
  });

  it('should create and save Medicos', async () => {
    const nbButtonsBeforeCreate = await medicoComponentsPage.countDeleteButtons();

    await medicoComponentsPage.clickOnCreateButton();

    await promise.all([
      medicoUpdatePage.setDniInput('5'),
      medicoUpdatePage.setMatriculaInput('matricula'),
      medicoUpdatePage.setNombreInput('nombre'),
      medicoUpdatePage.setApellidoInput('apellido'),
      medicoUpdatePage.setTelefonoInput('5'),
      medicoUpdatePage.setHistoriaTurnosInput('historiaTurnos'),
      medicoUpdatePage.especialidadSelectLastOption(),
    ]);

    expect(await medicoUpdatePage.getDniInput()).to.eq('5', 'Expected dni value to be equals to 5');
    expect(await medicoUpdatePage.getMatriculaInput()).to.eq('matricula', 'Expected Matricula value to be equals to matricula');
    expect(await medicoUpdatePage.getNombreInput()).to.eq('nombre', 'Expected Nombre value to be equals to nombre');
    expect(await medicoUpdatePage.getApellidoInput()).to.eq('apellido', 'Expected Apellido value to be equals to apellido');
    expect(await medicoUpdatePage.getTelefonoInput()).to.eq('5', 'Expected telefono value to be equals to 5');
    const selectedAtiendeDiscapacitados = medicoUpdatePage.getAtiendeDiscapacitadosInput();
    if (await selectedAtiendeDiscapacitados.isSelected()) {
      await medicoUpdatePage.getAtiendeDiscapacitadosInput().click();
      expect(await medicoUpdatePage.getAtiendeDiscapacitadosInput().isSelected(), 'Expected atiendeDiscapacitados not to be selected').to.be
        .false;
    } else {
      await medicoUpdatePage.getAtiendeDiscapacitadosInput().click();
      expect(await medicoUpdatePage.getAtiendeDiscapacitadosInput().isSelected(), 'Expected atiendeDiscapacitados to be selected').to.be
        .true;
    }
    expect(await medicoUpdatePage.getHistoriaTurnosInput()).to.eq(
      'historiaTurnos',
      'Expected HistoriaTurnos value to be equals to historiaTurnos'
    );

    await medicoUpdatePage.save();
    expect(await medicoUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await medicoComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last Medico', async () => {
    const nbButtonsBeforeDelete = await medicoComponentsPage.countDeleteButtons();
    await medicoComponentsPage.clickOnLastDeleteButton();

    medicoDeleteDialog = new MedicoDeleteDialog();
    expect(await medicoDeleteDialog.getDialogTitle()).to.eq('diafragmaApp.medico.delete.question');
    await medicoDeleteDialog.clickOnConfirmButton();
    await browser.wait(ec.visibilityOf(medicoComponentsPage.title), 5000);

    expect(await medicoComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
