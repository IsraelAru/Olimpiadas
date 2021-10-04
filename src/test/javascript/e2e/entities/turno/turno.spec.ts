import { browser, ExpectedConditions as ec, protractor, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { TurnoComponentsPage, TurnoDeleteDialog, TurnoUpdatePage } from './turno.page-object';

const expect = chai.expect;

describe('Turno e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let turnoComponentsPage: TurnoComponentsPage;
  let turnoUpdatePage: TurnoUpdatePage;
  let turnoDeleteDialog: TurnoDeleteDialog;
  const username = process.env.E2E_USERNAME ?? 'admin';
  const password = process.env.E2E_PASSWORD ?? 'admin';

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing(username, password);
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load Turnos', async () => {
    await navBarPage.goToEntity('turno');
    turnoComponentsPage = new TurnoComponentsPage();
    await browser.wait(ec.visibilityOf(turnoComponentsPage.title), 5000);
    expect(await turnoComponentsPage.getTitle()).to.eq('diafragmaApp.turno.home.title');
    await browser.wait(ec.or(ec.visibilityOf(turnoComponentsPage.entities), ec.visibilityOf(turnoComponentsPage.noResult)), 1000);
  });

  it('should load create Turno page', async () => {
    await turnoComponentsPage.clickOnCreateButton();
    turnoUpdatePage = new TurnoUpdatePage();
    expect(await turnoUpdatePage.getPageTitle()).to.eq('diafragmaApp.turno.home.createOrEditLabel');
    await turnoUpdatePage.cancel();
  });

  it('should create and save Turnos', async () => {
    const nbButtonsBeforeCreate = await turnoComponentsPage.countDeleteButtons();

    await turnoComponentsPage.clickOnCreateButton();

    await promise.all([
      turnoUpdatePage.estadoSelectLastOption(),
      turnoUpdatePage.setFechaHoraInput('01/01/2001' + protractor.Key.TAB + '02:30AM'),
      turnoUpdatePage.setMotivoInput('motivo'),
      turnoUpdatePage.setDescripcionInput('descripcion'),
    ]);

    expect(await turnoUpdatePage.getFechaHoraInput()).to.contain('2001-01-01T02:30', 'Expected fechaHora value to be equals to 2000-12-31');
    expect(await turnoUpdatePage.getMotivoInput()).to.eq('motivo', 'Expected Motivo value to be equals to motivo');
    expect(await turnoUpdatePage.getDescripcionInput()).to.eq('descripcion', 'Expected Descripcion value to be equals to descripcion');

    await turnoUpdatePage.save();
    expect(await turnoUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await turnoComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last Turno', async () => {
    const nbButtonsBeforeDelete = await turnoComponentsPage.countDeleteButtons();
    await turnoComponentsPage.clickOnLastDeleteButton();

    turnoDeleteDialog = new TurnoDeleteDialog();
    expect(await turnoDeleteDialog.getDialogTitle()).to.eq('diafragmaApp.turno.delete.question');
    await turnoDeleteDialog.clickOnConfirmButton();
    await browser.wait(ec.visibilityOf(turnoComponentsPage.title), 5000);

    expect(await turnoComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
