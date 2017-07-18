module.exports = {

    'secret': process.env.APP_SECRET,
	'databaseName': ( process.env.DATABASE_NAME || 'nhc_analytics_test' ),
	'databaseUsername': ( process.env.DATABASE_USERNAME || 'postgres' ),
	'databasePassword': ( process.env.DATABASE_PASSWORD ),
	'databaseHost': ( process.env.DATABASE_HOST || 'localhost' ),
	'databasePort': ( process.env.DATABASE_PORT || '5432' ),
	'passwordSaltRounds': 10

};
