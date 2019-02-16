const { Pool } = require('pg');
const UserTypes = require('../utility/userTypes');

const tables = {
	users: 'users',
	loginSession: 'loginSession'
};

const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: true });
const client = pool;

pool.on('error', (err, client) => {
	console.error('Unexpected error on idle client', err)
	process.exit(-1)
});

resetDataset = () => {
	// Delete all existing tables
	client.query(`DROP TABLE IF EXISTS ${tables.loginSession}`);
	client.query(`DROP TABLE IF EXISTS ${tables.users}`);

	// Recreate the tables
	client.query(
		`CREATE TABLE ${tables.loginSession} (
			username varchar(45) NOT NULL,  
			token varchar(36) NOT NULL,  
			created_at TIMESTAMP NOT NULL DEFAULT now()
		)`);

	client.query(
		`CREATE TABLE ${tables.users} (
			username varchar(45) NOT NULL,  
			password varchar(45) NOT NULL,  
			type integer NOT NULL DEFAULT '0'
		)`);

	// Fill tables with data
	const password = 'moyal';
	client.query(`INSERT INTO ${tables.users} VALUES('red1', '${password}', ${UserTypes.scouter})`);
	client.query(`INSERT INTO ${tables.users} VALUES('red2', '${password}', ${UserTypes.scouter})`);
	client.query(`INSERT INTO ${tables.users} VALUES('red3', '${password}', ${UserTypes.scouter})`);
	client.query(`INSERT INTO ${tables.users} VALUES('blue1', '${password}', ${UserTypes.scouter})`);
	client.query(`INSERT INTO ${tables.users} VALUES('blue2', '${password}', ${UserTypes.scouter})`);
	client.query(`INSERT INTO ${tables.users} VALUES('blue3', '${password}', ${UserTypes.scouter})`);
	client.query(`INSERT INTO ${tables.users} VALUES('coatch', '${password}', ${UserTypes.coatch})`);
	client.query(`INSERT INTO ${tables.users} VALUES('manager', '${password}', ${UserTypes.manager})`);
	client.query(`INSERT INTO ${tables.users} VALUES('admin', '${password}', ${UserTypes.admin})`);
}

// resetDataset();

const areParametersSafe = (...args) => {
	const regex = /^[a-zA-Z0-9_-]*$/;
	for (let x of args)
		if (!regex.test(x))
			return false;
	return true;
}

module.exports = {
	client,
	tables,
	areParametersSafe
};