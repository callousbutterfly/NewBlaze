const { DataTypes } = require('sequelize');
const sequelize = require('../index.js');

const Vote = sequelize.define("Sequelize", {
    userId: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    pollId: DataTypes.BIGINT,
    vote: DataTypes.SMALLINT
})


