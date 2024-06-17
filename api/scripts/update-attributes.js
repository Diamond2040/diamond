const templateMigrate = require('../migrations/1633507972980-db-seed-default-custom-attributes');

module.exports = async () => {
  await new Promise((resolve) => templateMigrate.up(resolve));
};
