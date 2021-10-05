import { browser, ExpectedConditions as ec, protractor, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { DiarioComponentsPage, DiarioDeleteDialog, DiarioUpdatePage } from './diario.page-object';

const expect = chai.expect;

describe('Diario e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let diarioComponentsPage: DiarioComponentsPage;
  let diarioUpdatePage: DiarioUpdatePage;
  let diarioDeleteDialog: DiarioDeleteDialog;
  const username = process.env.E2E_USERNAME ?? 'admin';
  const password = process.env.E2E_PASSWORD ?? 'admin';

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing(username, password);
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load Diarios', async () => {
    await navBarPage.goToEntity('diario');
    diarioComponentsPage = new DiarioComponentsPage();
    await browser.wait(ec.visibilityOf(diarioComponentsPage.title), 5000);
    expect(await diarioComponentsPage.getTitle()).to.eq('diafragmaApp.diario.home.title');
    await browser.wait(ec.or(ec.visibilityOf(diarioComponentsPage.entities), ec.visibilityOf(diarioComponentsPage.noResult)), 1000);
  });

  it('should load create Diario page', async () => {
    await diarioComponentsPage.clickOnCreateButton();
    diarioUpdatePage = new DiarioUpdatePage();
    expect(await diarioUpdatePage.getPageTitle()).to.eq('diafragmaApp.diario.home.createOrEditLabel');
    await diarioUpdatePage.cancel();
  });

  it('should create and save Diarios', async () => {
    const nbButtonsBeforeCreate = await diarioComponentsPage.countDeleteButtons();

    await diarioComponentsPage.clickOnCreateButton();

    await promise.all([
      diarioUpdatePage.setEntradaInput('entrada'),
      diarioUpdatePage.setFechaInput('01/01/2001' + protractor.Key.TAB + '02:30AM'),
    ]);

    expect(await diarioUpdatePage.getEntradaInput()).to.eq('entrada', 'Expected Entrada value to be equals to entrada');
    expect(await diarioUpdatePage.getFechaInput()).to.contain('2001-01-01T02:30', 'Expected fecha value to be equals to 2000-12-31');

    await diarioUpdatePage.save();
    expect(await diarioUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await diarioComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last Diario', async () => {
    const nbButtonsBeforeDelete = await diarioComponentsPage.countDeleteButtons();
    await diarioComponentsPage.clickOnLastDeleteButton();

    diarioDeleteDialog = new DiarioDeleteDialog();
    expect(await diarioDeleteDialog.getDialogTitle()).to.eq('diafragmaApp.diario.delete.question');
    await diarioDeleteDialog.clickOnConfirmButton();
    await browser.wait(ec.visibilityOf(diarioComponentsPage.title), 5000);

    expect(await diarioComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
