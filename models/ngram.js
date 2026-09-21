'use strict';

const { QueryTypes } = require('sequelize');
const { getNgrams } = require('../get_ngrams');

module.exports = (sequelize, DataTypes) => {
  const NGram = sequelize.define('ngram', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    ngram: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    timestamps: false,
  });

  NGram.associate = (models) => {
    NGram.belongsTo(models.word, {
      onDelete: 'CASCADE',
      foreignKey: {
        name: 'word_id',
        allowNull: false,
      },
    });
  };

  // Find the 10 dictionary words that share an n-gram with `word`,
  // closest first by Levenshtein distance.
  NGram.findWord = (word) => sequelize.query(
    'SELECT DISTINCT words.spelling, levenshtein(:word, words.spelling) AS lev ' +
    'FROM ngrams JOIN words ON ngrams.word_id = words.id ' +
    'WHERE ngrams.ngram IN (:list) ' +
    'ORDER BY lev LIMIT 10',
    {
      replacements: { word, list: getNgrams(word) },
      type: QueryTypes.SELECT,
    },
  );

  // Levenshtein (edit) distance between two strings, computed by Postgres.
  NGram.findLev = async (worda, wordb) => {
    const [row] = await sequelize.query('SELECT levenshtein(:worda, :wordb) AS lev', {
      replacements: { worda, wordb },
      type: QueryTypes.SELECT,
    });
    return row.lev;
  };

  return NGram;
};
