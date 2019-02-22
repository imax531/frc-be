const { tables, client, areParametersSafe } = require('../data/postgress');

const authenticateUser = token => {
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

const verifyRequest = async (req, classification) => {
	if (!areParametersSafe(...Object.values(req.body))) return false;
	if (!areParametersSafe(...Object.values(req.cookies))) return false;

	const user = await authenticateUser(req.cookies.token);
	return user && user.type >= classification ? user : undefined;
}

module.exports = {
	authenticateUser,
	verifyRequest
}