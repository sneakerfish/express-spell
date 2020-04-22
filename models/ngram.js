'use strict';
var get_ngrams = require("../get_ngrams");

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

    NGram.findWord = function(word) {
        sequelize.query("select distinct words.spelling, levenshtein(:word, words.spelling) lev " +
                                    "from ngrams, words where ngrams.word_id = words.id and " +
                                    "ngrams.ngram in (:list) order by lev limit 10",
                                    { replacements: { word: word, list: get_ngrams.data(word) },
                                      type: sequelize.QueryTypes.SELECT }
                       ).then(function(ngram) {
                           var data = [];
                           for (const n in ngram) {
                               data.push(ngram[n]);
                           }
                           console.log("done");
                           return data;
                       }).catch(function (reason) {
                           return reason;
                       });
    };

    return NGram;
};
