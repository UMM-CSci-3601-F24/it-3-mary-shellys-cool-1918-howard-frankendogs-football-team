/* eslint-disable @typescript-eslint/naming-convention */
import {seedAll} from '@floogulinc/cypress-mongo-seeder';
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

const mongoHost = process.env.MONGO_ADDR || 'localhost';
const mongoDb = process.env.MONGO_DB || 'dev';

const mongoUri = `mongodb://${mongoHost}/${mongoDb}`;
const dbSeedDir = '../database/seed';

const pluginConfig: Cypress.PluginConfig = (on, _config) => {
  // `on` is used to hook into various events Cypress emits
  // `_config` is the resolved Cypress config
  on('task', {
    'seed:database': (drop = true) => seedAll(mongoUri, dbSeedDir, drop),
  });

};

export default pluginConfig;
