const { standardDates } = require("./utils/standardDates");
const {
	createUpdateTrigger,
	dropUpdateTrigger,
} = require("./utils/standardUpdateTriggers");

const TABLE_NAME = "movies";

const demoData = [
	`INSERT INTO dddvc.${TABLE_NAME} (category_name, title, description, poster_url, video_url) VALUES ('Science Fiction', 'Matrix', 'The hacker Neo is contacted via the Internet by a mysterious underground organization. The head of the group - the wanted terrorist Morpheus - inaugurates him into a horrible secret: The reality, as we experience it, is only an illusory world. In truth, humans have long been ruled by a sinister virtual power - the "Matrix" whose agents are already targeting Neo ...', '/images/matrix.jpeg', 'https://www.youtube.com/embed/gDadfh0ZdBM');`,
	`INSERT INTO dddvc.${TABLE_NAME} (category_name, title, description, poster_url, video_url) VALUES ('Romance', 'Notting Hill', 'William Thacker is the owner of a bookstore in the heart of London''s trendy Notting Hill district. One day, by chance, the world''s most famous actress walks into his shop. Speechless, he stares after her and is convinced that he will never see her again. But fate has other plans - because only minutes later, William and Anna collide on the Portobello Road, the fairy tale begins ...', '/images/notting-hill.jpeg', 'https://www.youtube.com/embed/hZ8PfLIc8MI');`,
	`INSERT INTO dddvc.${TABLE_NAME} (category_name, title, description, poster_url, video_url) VALUES ('Action', 'The Bourne Identity', 'When CIA agent Jason Bourne is fished half-dead out of the sea with two bullets in his back and a laser implant under his skin, he realizes that he has completely lost his memory. After several attacks on his life, he soon realizes that he must come to terms with his true origins in order to survive. For yet he does not suspect that he is in the middle of the crosshairs of his own organization ...', '/images/bourne-identity.jpeg', 'https://www.youtube.com/embed/HSckms_rfwY');`,
];

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
	return knex.schema
		.createTable(`dddvc.${TABLE_NAME}`, function (table) {
			table
				.uuid("id")
				.defaultTo(knex.raw("public.uuid_generate_v4()"))
				.primary({ constraintName: `${TABLE_NAME}_pkey` });
			standardDates(knex, table);

			table.text("category_name").notNullable();
			table.text("title").notNullable();
			table.text("description").notNullable();
			table.text("poster_url").notNullable();
			table.text("video_url").notNullable();
		})
		.raw(createUpdateTrigger(TABLE_NAME))
		.raw(demoData.join("\n"));
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
	return knex.schema
		.raw(dropUpdateTrigger(TABLE_NAME))
		.dropTable(`dddvc.${TABLE_NAME}`);
};
