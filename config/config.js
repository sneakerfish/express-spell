'use strict';

// Database settings shared by the app (models/index.js) and sequelize-cli.
// Point DATABASE_URL at your Postgres instance, e.g.
//   export DATABASE_URL=postgres://user:password@localhost:5432/express_spell
const settings = {
  url: process.env.DATABASE_URL || 'postgres://localhost:5432/express_spell',
  dialect: 'postgres',
  logging: false,
};

module.exports = {
  development: settings,
  test: settings,
  production: settings,
};
