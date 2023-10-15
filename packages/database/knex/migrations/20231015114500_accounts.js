const { standardDates } = require('./utils/standardDates');
const { createUpdateTrigger, dropUpdateTrigger } = require('./utils/standardUpdateTriggers');

const ACCOUNTS_TABLE_NAME = 'accounts';
const ENTRIES_TABLE_NAME = 'account_entries';

const demoAccountData =
	`INSERT INTO dddvc.${ACCOUNTS_TABLE_NAME} (id, customer_id, balance)` +
	`VALUES ('7489141D-8F58-4AEC-A4E6-96EAE9DFF4A0', '11111111-1111-1111-1111-111111111111', 0);`;

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
	return knex.schema
		.createTable(`dddvc.${ACCOUNTS_TABLE_NAME}`, function (table) {
			table
				.uuid('id')
				.defaultTo(knex.raw('public.uuid_generate_v4()'))
				.primary({ constraintName: `${ACCOUNTS_TABLE_NAME}_pkey` });
			standardDates(knex, table);

			table.uuid('customer_id').notNullable();
			table.integer('balance').notNullable();
		})
		.raw(createUpdateTrigger(ACCOUNTS_TABLE_NAME))
		.raw(demoAccountData)

		.createTable(`dddvc.${ENTRIES_TABLE_NAME}`, function (table) {
			standardDates(knex, table);

			table
				.uuid('account_id')
				.notNullable()
				.references('id')
				.inTable(`dddvc.${ACCOUNTS_TABLE_NAME}`)
				.onDelete('CASCADE');

			table.text('title').notNullable();
			table.integer('amount').notNullable();
		})
		.raw(createUpdateTrigger(ENTRIES_TABLE_NAME));
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
	return knex.schema
		.raw(dropUpdateTrigger(ENTRIES_TABLE_NAME))
		.dropTable(`dddvc.${ENTRIES_TABLE_NAME}`)
		.raw(dropUpdateTrigger(ACCOUNTS_TABLE_NAME))
		.dropTable(`dddvc.${ACCOUNTS_TABLE_NAME}`);
};
