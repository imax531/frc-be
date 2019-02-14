const express = require('express');
const uuidv4 = require('uuidv4');
const { tables, client, areParametersAreSafe } = require('../data/postgress');

const router = express.Router();
const UserTypes = {
	scouter: 0,
	manager: 1,
	coatch: 2,
	admin: 3,
};

const authenticateUser = token => {
	if (!areParametersAreSafe(token)) return;
	return new Promise((resolve, reject) => {
		const sql = `SELECT *
			FROM ${tables.loginSession} JOIN users ON ${tables.loginSession}.username = ${tables.users}.username
			WHERE '${token}' = token`;
		client.query(sql, (err, res) => {
			if (err) throw err;
			console.log(res.rows[0])
			resolve(res.rows[0]);
		});
	});
};

router.get('/', (req, res) => {
	authenticateUser(req.cookies.token)
		.then(data => data ? {
			username: data.username,
			type: data.type
		} : {
				error: 1,
				msg: "Invalid token"
			})
		.then(data => res.send(data));
});

router.post('/', function (req, res, next) {
	const { username, password } = req.body;
	const answer = { success: false };

	if (!areParametersAreSafe(username, password))
		res.send(answer);
	else client.query(`SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`, (err, result) => {
		if (err) throw err;
		const user = result.rows[0];
		if (user) {
			const token = uuidv4();
			client.query(`INSERT INTO ${tables.loginSession} VALUES('${username}', '${token}')`);
			answer.token = token;
			answer.success = true;
		}
		res.send(answer);
	});
});

module.exports = router;
