const { tables, client, areParametersSafe } = require('../data/postgress');
const UserTypes = require('../utility/userTypes');

const authenticateUser = token => {
	if (!areParametersSafe(token)) return;
	return new Promise((resolve, reject) => {
		const sql = `SELECT *
			FROM ${tables.loginSession} JOIN users ON ${tables.loginSession}.username = ${tables.users}.username
			WHERE '${token}' = token`;
		client.query(sql, (err, res) => {
			if (err) throw err;
			resolve(res.rows[0]);
		});
	});
};

module.exports = {
	authenticateUser
}