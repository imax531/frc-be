const express = require('express');
const uuidv4 = require('uuidv4');
const { tables, client, areParametersSafe } = require('../data/postgress');
const { verifyRequest } = require('../utility/userUtility');
const UserTypes = require('../utility/userTypes');

const router = express.Router();

router.get('/', (req, res) => {
	verifyRequest(req, 0).then(data => {
		if (!data) {
			res.send({ success: false });
			return;
		}

		client.query(`SELECT * FROM ${tables.matches}`, (err, result) => {
			if (err) throw err;
			res.send(result.rows);
		});
	});
});

router.post('/', (req, res, next) => {
	verifyRequest(req, UserTypes.manager).then(data => {
		if (!data) {
			res.send({ success: false });
			return;
		}

		const { gameNumber, red1, red2, red3, blue1, blue2, blue3 } = req.body;
		const answer = { success: false };

		client.query(`INSERT INTO ${tables.matches} VALUES('${gameNumber}', '${red1}', '${red2}', '${red3}', '${blue1}', '${blue2}', '${blue3}')`, (err, result) => {
			if (err) throw err;
			res.send(result);
		});
	});
});

module.exports = router;
