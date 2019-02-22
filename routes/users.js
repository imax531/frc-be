const express = require('express');
const uuidv4 = require('uuidv4');
const { tables, client, areParametersSafe } = require('../data/postgress');
const { verifyRequest } = require('../utility/userUtility');

const router = express.Router();

router.get('/', (req, res) => {
	verifyRequest(req, -1).then(data => data ? {
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

	if (!areParametersSafe(username, password))
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

router.post('/logout', function (req, res, next) {
	const { token } = req.cookies;

	if (areParametersSafe(token))
		client.query(`DELETE FROM ${tables.loginSession} WHERE token = '${token}'`);

	res.send('OK');
});


module.exports = router;
