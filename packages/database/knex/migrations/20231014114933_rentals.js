const { standardDates } = require('./utils/standardDates');
const { createUpdateTrigger, dropUpdateTrigger } = require('./utils/standardUpdateTriggers');

const TABLE_NAME = 'rentals';

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
	return knex.schema
		.createTable(`dddvc.${TABLE_NAME}`, function (table) {
			table
				.uuid('id')
				.defaultTo(knex.raw('public.uuid_generate_v4()'))
				.primary({ constraintName: `${TABLE_NAME}_pkey` });
			standardDates(knex, table);

			table.uuid('customer_id').notNullable();
			table.uuid('movie_id').notNullable();

			table.text('movie_category_name').notNullable();
			table.text('movie_title').notNullable();

			table.timestamp('rental_start', { useTz: true }).notNullable();
			table.integer('rental_days').notNullable();
		})
		.raw(createUpdateTrigger(TABLE_NAME));
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
	return knex.schema.raw(dropUpdateTrigger(TABLE_NAME)).dropTable(`dddvc.${TABLE_NAME}`);
};
