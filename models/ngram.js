'use strict';

module.exports = (sequelize, DataTypes) => {
    var NGram = sequelize.define('ngram', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        ngram: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        timestamps: false
    });

    NGram.associate = function (models) {
        models.ngram.belongsTo(models.word, {
            onDelete: "CASCADE",
            foreignKey: {
                name: 'word_id',
                allowNull: false
            }
        });
    };

    return NGram;
};
