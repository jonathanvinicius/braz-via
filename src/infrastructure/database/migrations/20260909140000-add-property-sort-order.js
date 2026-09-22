'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('properties', 'sort_order', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    });

    await queryInterface.sequelize.query(`
      UPDATE properties AS p
      SET sort_order = ranked.position
      FROM (
        SELECT id, ROW_NUMBER() OVER (
          ORDER BY featured DESC, created_at ASC
        ) AS position
        FROM properties
      ) AS ranked
      WHERE p.id = ranked.id
    `);

    await queryInterface.addIndex('properties', ['sort_order']);
  },

  async down(queryInterface) {
    await queryInterface.removeIndex('properties', ['sort_order']);
    await queryInterface.removeColumn('properties', 'sort_order');
  },
};
