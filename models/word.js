'use strict';

module.exports = (sequelize, DataTypes) => {
  const Word = sequelize.define('word', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    spelling: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    timestamps: false,
  });

  return Word;
};
