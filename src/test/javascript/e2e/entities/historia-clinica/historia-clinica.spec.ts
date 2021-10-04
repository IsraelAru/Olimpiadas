import { browser, ExpectedConditions as ec, protractor, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { HistoriaClinicaComponentsPage, HistoriaClinicaDeleteDialog, HistoriaClinicaUpdatePage } from './historia-clinica.page-object';

const expect = chai.expect;

describe('HistoriaClinica e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let historiaClinicaComponentsPage: HistoriaClinicaComponentsPage;
  let historiaClinicaUpdatePage: HistoriaClinicaUpdatePage;
  let historiaClinicaDeleteDialog: HistoriaClinicaDeleteDialog;
  const username = process.env.E2E_USERNAME ?? 'admin';
  const password = process.env.E2E_PASSWORD ?? 'admin';

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing(username, password);
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load HistoriaClinicas', async () => {
    await navBarPage.goToEntity('historia-clinica');
    historiaClinicaComponentsPage = new HistoriaClinicaComponentsPage();
    await browser.wait(ec.visibilityOf(historiaClinicaComponentsPage.title), 5000);
    expect(await historiaClinicaComponentsPage.getTitle()).to.eq('diafragmaApp.historiaClinica.home.title');
    await browser.wait(
      ec.or(ec.visibilityOf(historiaClinicaComponentsPage.entities), ec.visibilityOf(historiaClinicaComponentsPage.noResult)),
      1000
    );
  });

  it('should load create HistoriaClinica page', async () => {
    await historiaClinicaComponentsPage.clickOnCreateButton();
    historiaClinicaUpdatePage = new HistoriaClinicaUpdatePage();
    expect(await historiaClinicaUpdatePage.getPageTitle()).to.eq('diafragmaApp.historiaClinica.home.createOrEditLabel');
    await historiaClinicaUpdatePage.cancel();
  });

  it('should create and save HistoriaClinicas', async () => {
    const nbButtonsBeforeCreate = await historiaClinicaComponentsPage.countDeleteButtons();

    await historiaClinicaComponentsPage.clickOnCreateButton();

    await promise.all([
      historiaClinicaUpdatePage.setDiagnosticoInput('diagnostico'),
      historiaClinicaUpdatePage.setTratamientoInput('tratamiento'),
      historiaClinicaUpdatePage.categoriaSelectLastOption(),
      historiaClinicaUpdatePage.setFechaInput('01/01/2001' + protractor.Key.TAB + '02:30AM'),
    ]);

    expect(await historiaClinicaUpdatePage.getDiagnosticoInput()).to.eq(
      'diagnostico',
      'Expected Diagnostico value to be equals to diagnostico'
    );
    expect(await historiaClinicaUpdatePage.getTratamientoInput()).to.eq(
      'tratamiento',
      'Expected Tratamiento value to be equals to tratamiento'
    );
    expect(await historiaClinicaUpdatePage.getFechaInput()).to.contain(
      '2001-01-01T02:30',
      'Expected fecha value to be equals to 2000-12-31'
    );

    await historiaClinicaUpdatePage.save();
    expect(await historiaClinicaUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await historiaClinicaComponentsPage.countDeleteButtons()).to.eq(
      nbButtonsBeforeCreate + 1,
      'Expected one more entry in the table'
    );
  });

  it('should delete last HistoriaClinica', async () => {
    const nbButtonsBeforeDelete = await historiaClinicaComponentsPage.countDeleteButtons();
    await historiaClinicaComponentsPage.clickOnLastDeleteButton();

    historiaClinicaDeleteDialog = new HistoriaClinicaDeleteDialog();
    expect(await historiaClinicaDeleteDialog.getDialogTitle()).to.eq('diafragmaApp.historiaClinica.delete.question');
    await historiaClinicaDeleteDialog.clickOnConfirmButton();
    await browser.wait(ec.visibilityOf(historiaClinicaComponentsPage.title), 5000);

    expect(await historiaClinicaComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
