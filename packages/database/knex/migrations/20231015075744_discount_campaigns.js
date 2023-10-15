const { standardDates } = require('./utils/standardDates');
const { createUpdateTrigger, dropUpdateTrigger } = require('./utils/standardUpdateTriggers');

const TABLE_NAME = 'discount_campaigns';

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

			table.text('campaign_title').notNullable();

			table.timestamp('starting_from', { useTz: true }).notNullable();
			table.timestamp('valid_thru', { useTz: true }).notNullable();

			table.text('movie_category_name').notNullable();
			table.integer('percentage').notNullable();
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
