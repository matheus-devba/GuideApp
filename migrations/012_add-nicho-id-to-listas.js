/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
    pgm.addColumn("listas", {
    nicho_id: {
      type: "integer",
      notNull: true,
      references: "nicho",
      referencesConstraintName: "fk_nichos_listas",
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
})
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
    pgm.dropTable("listas");
};
