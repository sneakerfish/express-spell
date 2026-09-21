'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // levenshtein() comes from the fuzzystrmatch extension that ships with Postgres.
    await queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS fuzzystrmatch');

    await queryInterface.createTable('words', {
      id: { type: Sequelize.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },
      spelling: { type: Sequelize.STRING, allowNull: false },
    });

    await queryInterface.createTable('ngrams', {
      id: { type: Sequelize.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },
      ngram: { type: Sequelize.STRING, allowNull: false },
      word_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'words', key: 'id' },
        onDelete: 'CASCADE',
      },
    });

    // The spell check looks words up by n-gram, so index that column.
    await queryInterface.addIndex('ngrams', ['ngram']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('ngrams');
    await queryInterface.dropTable('words');
  },
};
