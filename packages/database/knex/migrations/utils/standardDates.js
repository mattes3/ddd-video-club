exports.standardDates = function (knex, table) {
	table.timestamp("created_at", { useTz: true }).defaultTo(knex.fn.now());
	table.timestamp("updated_at", { useTz: true });
};
