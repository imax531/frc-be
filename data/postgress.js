const { Client } = require('pg');

const tables = {
	users: 'users',
	loginSession: 'loginSession'
};

const client = new Client({
	connectionString: process.env.DATABASE_URL,
	ssl: true,
});
client.connect();

resetDataset = () => {
	// Delete all existing tables
	client.query(`DROP TABLE ${loginSession} IF EXISTS`);
	client.query(`DROP TABLE ${users} IF EXISTS`);

	// Recreate the tables
	client.query(
		`CREATE TABLE ${loginSession} (
			username varchar(45) NOT NULL,  
			token varchar(36) NOT NULL,  
			created_at TIMESTAMP NOT NULL DEFAULT now()
		)`);
	
	client.query(
		`CREATE TABLE ${users} (
			username varchar(45) NOT NULL,  
			password varchar(45) NOT NULL,  
			type integer NOT NULL DEFAULT '0'
		)`);
	
	// Fill tables with data
	const password = 'moyal';
	client.query(`INSERT INTO ${users} VALUES('red1', '${password}')`);
	client.query(`INSERT INTO ${users} VALUES('red2', '${password}')`);
	client.query(`INSERT INTO ${users} VALUES('red3', '${password}')`);
	client.query(`INSERT INTO ${users} VALUES('blue1', '${password}')`);
	client.query(`INSERT INTO ${users} VALUES('blue2', '${password}')`);
	client.query(`INSERT INTO ${users} VALUES('blue3', '${password}')`);
	client.query(`INSERT INTO ${users} VALUES('coatch', '${password}')`);
	client.query(`INSERT INTO ${users} VALUES('manager', '${password}')`);
	client.query(`INSERT INTO ${users} VALUES('admin', '${password}')`);
}

// resetDataset();


module.exports = {
	client,
	tables
};