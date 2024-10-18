// This file is required by karma.conf.js and loads recursively all the .spec and framework files

// This `zone.js` import statement *must* be first, before any other imports.
// It actually patches (modifies) the async APIs in the browser to make them
// "test friendly". If we import it after other modules, those modules won't
// "see" the patched APIs and will continue to use the native browser async APIs,
// which will cause tests to fail.
//
// This makes the blank link after this `import` important; without it
// running "Organize Imports" in VS Code will move the `zone.js` import
// to the end of the imports, which will cause tests to fail.
import 'zone.js/testing';

import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting(),
  {
    teardown: { destroyAfterEach: false }
  }
);
