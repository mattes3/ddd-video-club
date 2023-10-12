/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
	return knex.schema
		.raw('CREATE extension IF NOT EXISTS "uuid-ossp" SCHEMA public')
		.raw('CREATE extension IF NOT EXISTS "pgcrypto"  SCHEMA public')
		.createSchema("dddvc");
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
	return knex.schema
		.dropSchema("dddvc")
		.raw('DROP extension "uuid-ossp"')
		.raw('DROP extension "pgcrypto"');
};
