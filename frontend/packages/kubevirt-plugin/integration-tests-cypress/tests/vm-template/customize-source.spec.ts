import { ProvisionSource } from '../../enums/provisionSource';
import { testName } from '../../support';
import { addSource } from '../../view/add-source';
import { customizeSource, PROVIDER } from '../../view/customize-source';
import { virtualization } from '../../view/virtualization';
import {
  IMPORTING,
  TEMPLATE_NAME,
  TEMPLATE_BASE_IMAGE,
  OS_IMAGES_NS,
  PREPARING_FOR_CUSTOMIZATION,
  READY_FOR_CUSTOMIZATION,
  TEST_PROVIDER,
} from '../../const/index';

describe('test vm template source image', () => {
  before(() => {
    cy.Login();
    cy.visit('');
    cy.createProject(testName);
    cy.deleteResource({
      kind: 'DataVolume',
      metadata: {
        name: TEMPLATE_BASE_IMAGE,
        namespace: OS_IMAGES_NS,
      },
    });
    cy.cdiCloner(testName);
  });

  after(() => {
    cy.deleteResource({
      kind: 'DataVolume',
      metadata: {
        name: TEMPLATE_BASE_IMAGE,
        namespace: OS_IMAGES_NS,
      },
    });
  });

  xit('customize common template source', () => {
    const vmtName = 'tmp-customized';
    virtualization.templates.visit();
    virtualization.templates.addSource(TEMPLATE_NAME);
    addSource.addBootSource(ProvisionSource.REGISTRY);
    virtualization.templates.testSource(TEMPLATE_NAME, IMPORTING);
    virtualization.templates.testSource(TEMPLATE_NAME, TEST_PROVIDER);

    virtualization.templates.customizeSource(TEMPLATE_NAME);
    customizeSource.fillForm({ vmtName });

    virtualization.templates.visit();
    virtualization.templates.testSource(vmtName, PREPARING_FOR_CUSTOMIZATION);
    virtualization.templates.testSource(vmtName, READY_FOR_CUSTOMIZATION);
    virtualization.templates.launchConsole(vmtName);
    customizeSource.finishCustomization();
    virtualization.templates.filter(vmtName);
    virtualization.templates.testSource(vmtName, PROVIDER);
  });

  xit('customize user template source', () => {
    const vmtName = 'tmp-user-customized';
    cy.createUserTemplate(testName);
    virtualization.templates.visit();

    virtualization.templates.customizeSource(TEMPLATE_NAME);
    customizeSource.fillForm({ vmtName });

    virtualization.templates.visit();
    virtualization.templates.testSource(vmtName, PREPARING_FOR_CUSTOMIZATION);
    virtualization.templates.testSource(vmtName, READY_FOR_CUSTOMIZATION);
    virtualization.templates.launchConsole(vmtName);
    customizeSource.finishCustomization();
    virtualization.templates.filter(vmtName);
    virtualization.templates.testSource(vmtName, PROVIDER);
  });
});
