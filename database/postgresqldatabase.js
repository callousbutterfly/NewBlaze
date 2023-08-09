const {Sequelize} = require('sequelize');


const database = "test";
const host = "localhost";
const user = "postgres";
const port = 5432;
const password = "raspberry2";


const sequelize = new Sequelize(database, user, password, {
    host,
    port,
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    }
})

try {
    sequelize.authenticate().then(m => {
        console.log("Successfully connected to the database.");
    });

} catch (error) {
    console.error("Unable to connect to the database: ", error);
}

