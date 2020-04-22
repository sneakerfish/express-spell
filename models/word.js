'use stricts';

module.exports = (sequelize, DataTypes) => {
    var Word = sequelize.define('word', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        spelling: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        timestamps: false
    });

    return Word;
};
