'use strict';

function get_ngrams(word) {
    var data = [];
    const newword = '*' + word + '*';
    for (var i=0;i<newword.length-2;i++) {
        data.push(newword.substring(i,i+3));
    }
    return data;
}



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

    NGram.findWord = function(models, word) {
        this.findAll({
            where: {
                ngram: get_ngrams(word)
            },
        }).then(function(ngram) {
            var data = [];
            for (const n in ngram) {
                console.log(ngram[n]);
                data.push(ngram[n]);
            }
            return data;
        });
    };

    return NGram;
};
