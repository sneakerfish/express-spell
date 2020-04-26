'use strict';
var get_ngrams = require("../get_ngrams");

module.exports = (sequelize, DataTypes) => {
    var NGram = sequelize.define('ngram', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        ngram: {
            type: DataTypes.STRING,
            allowNull: false
        },
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
       return sequelize.query("select distinct words.spelling, levenshtein(:word, words.spelling) lev " +
                        "from ngrams, words where ngrams.word_id = words.id and " +
                        "ngrams.ngram in (:list) order by lev limit 10",
                        { replacements: { word: word, list: get_ngrams.data(word) },
                          type: sequelize.QueryTypes.SELECT }
                       ).then(function(ngram) {
                           var data = [];
                           for (const n in ngram) {
                               data.push(ngram[n]);
                           }
                           return data;
                       }).catch(function (reason) {
                           return reason;
                       });
    };


    NGram.findLev = function(worda, wordb) {
        return sequelize.query("select levenshtein(:worda, :wordb) lev ",
                               { replacements: { worda: worda, wordb: wordb },
                                 type: sequelize.QueryTypes.SELECT }
                              ).then(function(lev_value) {
                                  for (const n in lev_value) {
                                      return lev_value[n]["lev"];
                                  }
                       }).catch(function (reason) {
                           return reason;
                       });
    };


    return NGram;
};
