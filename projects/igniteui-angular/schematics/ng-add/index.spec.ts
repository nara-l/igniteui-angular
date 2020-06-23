import { EmptyTree } from '@angular-devkit/schematics';
import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import * as path from 'path';
import { getWorkspace } from '@schematics/angular/utility/config';
import { scssImport, cssImport } from './add-normalize';
import { ProjectType } from '@schematics/angular/utility/workspace-models';
import { DEPENDENCIES_MAP, PackageTarget, PackageEntry } from '../utils/dependency-handler';

describe('ng-add schematics', () => {
  const collectionPath = path.join(__dirname, '../collection.json');
  const runner: SchematicTestRunner = new SchematicTestRunner('cli-schematics', collectionPath);
  let tree: UnitTestTree;
  const sourceRoot = 'testSrc';
  const ngJsonConfig = {
    defaultProject: 'testProj',
    projects: {
      testProj: {
        sourceRoot: sourceRoot,
        projectType: ProjectType.Application,
        architect: {
          serve: {},
          build: {
            options: {
              main: `${sourceRoot}/main.ts`,
              polyfills: `${sourceRoot}/polyfills.ts`,
              scripts: []
            }
          },
          test: {
            options: {
              main: `${sourceRoot}/test.ts`,
              polyfills: `${sourceRoot}/polyfills.ts`,
              scripts: []
            }
          },
        }
      }
    }
  };

  const pkgJsonConfig = {
    dependencies: {},
    devDependencies: {}
  };

  function resetJsonConfigs(treeArg: UnitTestTree) {
    treeArg.overwrite('/angular.json', JSON.stringify(ngJsonConfig));
    treeArg.overwrite('/package.json', JSON.stringify(pkgJsonConfig));
  }

  beforeEach(() => {
    tree = new UnitTestTree(new EmptyTree());
    tree.create('/angular.json', JSON.stringify(ngJsonConfig));
    tree.create('/package.json', JSON.stringify(pkgJsonConfig));
    tree.create(`${sourceRoot}/main.ts`, '// test comment');
    tree.create(`${sourceRoot}/test.ts`, '// test comment');
  });

  it('should create the needed files correctly', () => {
    expect(tree).toBeTruthy();
    expect(tree.exists('/angular.json')).toBeTruthy();
    expect(tree.exists('/package.json')).toBeTruthy();
    expect(JSON.parse(tree.readContent('/angular.json')).projects['testProj'].architect).toBeTruthy();

    const pkgJsonData = JSON.parse(tree.readContent('/package.json'));
    expect(Object.keys(pkgJsonData).length).toBeGreaterThan(0);
  });

  it('should include ALL dependencies in map', () => {
    const pkgJson = require('../../package.json');
    const allDependencies = Object.assign({}, pkgJson.dependencies, pkgJson.peerDependencies, pkgJson.igxDevDependencies);
    for (const key of Object.keys(allDependencies)) {
      const expectedPackages: PackageEntry = {
        name: key,
        target: jasmine.anything() as any
      };
      expect(DEPENDENCIES_MAP).toContain(expectedPackages, `Dependency ${key} missing in dependencies map!`);
    }
  });

  it('should add packages to package.json dependencies', () => {
    const expectedDeps = DEPENDENCIES_MAP.filter(dep => dep.target === PackageTarget.REGULAR).map(dep => dep.name);
    const expectedDevDeps = DEPENDENCIES_MAP.filter(dep => dep.target === PackageTarget.DEV).map(dep => dep.name);
    runner.runSchematic('ng-add', { normalizeCss: false }, tree);
    const pkgJsonData = JSON.parse(tree.readContent('/package.json'));
    expect(pkgJsonData.dependencies).toBeTruthy();
    expect(pkgJsonData.devDependencies).toBeTruthy();
    // Check for explicit dependencies
    expect(Object.keys(pkgJsonData.dependencies).length).toEqual(expectedDeps.length, `Different number of added dependencies!`);
    expect(Object.keys(pkgJsonData.devDependencies).length).toEqual(expectedDevDeps.length, `Different number of added devDependencies!`);
    for (const dependency of expectedDeps) {
      expect(pkgJsonData.dependencies.hasOwnProperty(dependency)).toEqual(true, `Dependency ${dependency} is missing from output!`);
    }
    for (const dependency of expectedDevDeps) {
      expect(pkgJsonData.devDependencies.hasOwnProperty(dependency)).toEqual(true, `DevDependency ${dependency} is missing from output!`);
    }
  });

  it('should add the correct igniteui-angular packages to package.json dependencies', () => {
    runner.runSchematic('ng-add', { normalizeCss: false }, tree);
    const pkgJsonData = JSON.parse(tree.readContent('/package.json'));
    expect(pkgJsonData.dependencies['jszip']).toBeTruthy();
    expect(pkgJsonData.dependencies['hammerjs']).toBeTruthy();
  });

  it('should add hammer.js to the main.ts file', () => {
    runner.runSchematic('ng-add', { normalizeCss: false }, tree);
    const mainTs = tree.read(`${sourceRoot}/main.ts`).toString();
    expect(mainTs).toContain('import \'hammerjs\';');
  });

  it('should not add hammer.js if it exists in angular.json build options', () => {
    const workspace = getWorkspace(tree) as any;
    const currentProjectName = workspace.defaultProject;
    workspace.projects[currentProjectName].architect.build.options.scripts.push('./node_modules/hammerjs/hammer.min.js');
    tree.overwrite('angular.json', JSON.stringify(workspace));
    runner.runSchematic('ng-add', { normalizeCss: false }, tree);

    const newContent = tree.read(`${sourceRoot}/main.ts`).toString();
    expect(newContent.split('import \'hammerjs\';\n// test comment').length).toEqual(1);
  });

  it('should add hammer.js to the test.ts file', () => {
    runner.runSchematic('ng-add', { normalizeCss: false }, tree);
    const testTs = tree.read(`${sourceRoot}/test.ts`).toString();
    expect(testTs).toContain('import \'hammerjs\';');
  });

  it('should not add hammer.js if it exists in angular.json test options', () => {
    const workspace = getWorkspace(tree) as any;
    const currentProjectName = workspace.defaultProject;
    workspace.projects[currentProjectName].architect.test.options.scripts.push('./node_modules/hammerjs/hammer.min.js');
    tree.overwrite('angular.json', JSON.stringify(workspace));
    runner.runSchematic('ng-add', { normalizeCss: false }, tree);

    const testTs = tree.read(`${sourceRoot}/test.ts`).toString();
    expect(testTs).toMatch('// test comment');
  });

  it('should not add hammer.js if it exists in main.ts', () => {
    const mainTsPath = `${sourceRoot}/main.ts`;
    const content = tree.read(mainTsPath).toString();
    tree.overwrite(mainTsPath, 'import \'hammerjs\';\n' + content);
    runner.runSchematic('ng-add', { normalizeCss: false }, tree);

    const newContent = tree.read(mainTsPath).toString();
    expect(newContent.split('import \'hammerjs\';\n// test comment').length).toEqual(2);
  });

  it('should add hammer.js to package.json dependencies', () => {
    runner.runSchematic('ng-add', { normalizeCss: false }, tree);
    const pkgJsonData = JSON.parse(tree.readContent('/package.json'));
    expect(pkgJsonData.dependencies['hammerjs']).toBeTruthy();
  });

  it('should add the CLI only to devDependencies', () => {
    runner.runSchematic('ng-add', { normalizeCss: false }, tree);
    const pkgJsonData = JSON.parse(tree.readContent('/package.json'));

    const version = require('../../package.json')['igxDevDependencies']['@igniteui/angular-schematics'];
    expect(pkgJsonData.devDependencies['@igniteui/angular-schematics']).toBe(version);
    expect(pkgJsonData.dependencies['@igniteui/angular-schematics']).toBeFalsy();
  });

  it('should properly add polyfills', () => {
    const polyfills = `
// import 'core-js/es6/object';
// import 'core-js/es6/function';
/** a comment */
// import 'core-js/es6/reflect';
// import 'core-js/es6/set';

/** IE10 and IE11 requires the following for NgClass support on SVG elements */
// import 'classlist.js';  // Run \`npm install --save classlist.js\`.

/** comment */
// import 'web-animations-js';  // Run \`npm install --save web-animations-js\`.
`;
    const result = `
import 'core-js/es6/object';
import 'core-js/es6/function';
/** a comment */
import 'core-js/es6/reflect';
import 'core-js/es6/set';

/** IE10 and IE11 requires the following for NgClass support on SVG elements */
// import 'classlist.js';  // Run \`npm install --save classlist.js\`.

/** comment */
import 'web-animations-js';  // Run \`npm install --save web-animations-js\`.
`;

    tree.create(`${sourceRoot}/polyfills.ts`, polyfills);
    runner.runSchematic('ng-add', { polyfills: true, normalizeCss: false }, tree);
    expect(tree.readContent(`${sourceRoot}/polyfills.ts`).replace(/\r\n/g, '\n')).toEqual(result.replace(/\r\n/g, '\n'));
  });

  it('should properly add css reset', () => {
    tree.create(`${sourceRoot}/styles.scss`, '');
    runner.runSchematic('ng-add', { normalizeCss: true }, tree);
    let pkgJsonData = JSON.parse(tree.readContent('/package.json'));
    expect(tree.readContent(`${sourceRoot}/styles.scss`)).toEqual(scssImport);
    expect(pkgJsonData.dependencies['minireset.css']).toBeTruthy();
    resetJsonConfigs(tree);
    tree.delete(`${sourceRoot}/styles.scss`);

    tree.create(`${sourceRoot}/styles.sass`, '');
    runner.runSchematic('ng-add', { normalizeCss: true }, tree);
    pkgJsonData = JSON.parse(tree.readContent('/package.json'));
    expect(tree.readContent(`${sourceRoot}/styles.sass`)).toEqual(scssImport);
    expect(pkgJsonData.dependencies['minireset.css']).toBeTruthy();
    resetJsonConfigs(tree);
    tree.delete(`${sourceRoot}/styles.sass`);

    tree.create(`${sourceRoot}/styles.css`, '');
    runner.runSchematic('ng-add', { normalizeCss: true }, tree);
    pkgJsonData = JSON.parse(tree.readContent('/package.json'));
    expect(tree.readContent(`${sourceRoot}/styles.css`)).toBe('');
    expect(pkgJsonData.dependencies['minireset.css']).toBeTruthy();
    expect(JSON.parse(tree.readContent('/angular.json')).projects['testProj'].architect.build.options.styles).toContain(cssImport);
    resetJsonConfigs(tree);
    tree.delete(`${sourceRoot}/styles.css`);

    tree.create(`${sourceRoot}/styles.less`, '');
    runner.runSchematic('ng-add', { normalizeCss: true }, tree);
    pkgJsonData = JSON.parse(tree.readContent('/package.json'));
    expect(tree.readContent(`${sourceRoot}/styles.less`)).toBe('');
    expect(pkgJsonData.dependencies['minireset.css']).toBeTruthy();
    expect(JSON.parse(tree.readContent('/angular.json')).projects['testProj'].architect.build.options.styles).toContain(cssImport);
    resetJsonConfigs(tree);
    tree.delete(`${sourceRoot}/styles.less`);

    tree.create(`${sourceRoot}/styles.styl`, '');
    runner.runSchematic('ng-add', { normalizeCss: true }, tree);
    pkgJsonData = JSON.parse(tree.readContent('/package.json'));
    expect(tree.readContent(`${sourceRoot}/styles.styl`)).toBe('');
    expect(pkgJsonData.dependencies['minireset.css']).toBeTruthy();
    expect(JSON.parse(tree.readContent('/angular.json')).projects['testProj'].architect.build.options.styles).toContain(cssImport);
    resetJsonConfigs(tree);
    tree.delete(`${sourceRoot}/styles.styl`);
  });

  it('should properly add web animations', () => {
    runner.runSchematic('ng-add', { normalizeCss: false }, tree);
    const pkgJsonData = JSON.parse(tree.readContent('/package.json'));
    expect(pkgJsonData.dependencies['web-animations-js']).toBeTruthy();
  });

  /**
   * Projects that use AngularCLI v7.3 or above have an 'es5BrowserSupport' property in their angular.json file.
   * All commented imports that used to be in the polyfills file have been removed and this property handles all polyfills.
   *
   * The ng-add schematic will consider a project that contains the 'es5BrowserSupport', in its angular.json file, as a project
   * that is built with AngularCLI v7.3 or above. All else are considered below v7.3.
   */
  it('should enable es5BrowserSupport on projects with ng cli version >= 7.3', () => {
    tree.create(`${sourceRoot}/polyfills.ts`, '');
    const newJson: any = JSON.parse(tree.read('/angular.json').toString());
    newJson.projects['testProj'].architect.build.options['es5BrowserSupport'] = false;
    tree.overwrite('/angular.json', JSON.stringify(newJson));
    runner.runSchematic('ng-add', { polyfills: true }, tree);
    const ngJsonData = JSON.parse(tree.readContent('/angular.json').toString());
    expect(ngJsonData.projects['testProj'].architect.build.options['es5BrowserSupport']).toBeTruthy();
  });

  it('should enable web-anmations and object.entries properly on projects with ng cli version >= 7.3', () => {
    const polyfills = `
/** IE10 and IE11 requires the following for NgClass support on SVG elements */
// import 'classlist.js';  // Run \`npm install --save classlist.js\`.

// import 'web-animations-js';  // Run \`npm install --save web-animations-js\`.
    `;

    const result = `
/** IE10 and IE11 requires the following for NgClass support on SVG elements */
// import 'classlist.js';  // Run \`npm install --save classlist.js\`.

import 'web-animations-js';  // Run \`npm install --save web-animations-js\`.
    `;

    tree.create(`${sourceRoot}/polyfills.ts`, polyfills);
    const newJson: any = JSON.parse(tree.read('/angular.json').toString());
    newJson.projects['testProj'].architect.build.options['es5BrowserSupport'] = false;
    tree.overwrite('/angular.json', JSON.stringify(newJson));
    runner.runSchematic('ng-add', { polyfills: true }, tree);
    expect(tree.readContent(`${sourceRoot}/polyfills.ts`).replace(/\r\n/g, '\n')).toEqual(result.replace(/\r\n/g, '\n'));
  });
});
