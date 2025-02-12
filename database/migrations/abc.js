/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("t_excel", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      filename: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      file_url: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      upload_date: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      upload_by: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      a: Sequelize.TEXT,
      b: Sequelize.TEXT,
      c: Sequelize.TEXT,
      d: Sequelize.TEXT,
      e: Sequelize.TEXT,
      f: Sequelize.TEXT,
      g: Sequelize.TEXT,
      h: Sequelize.TEXT,
      i: Sequelize.TEXT,
      j: Sequelize.TEXT,
      k: Sequelize.TEXT,
      l: Sequelize.TEXT,
      m: Sequelize.TEXT,
      n: Sequelize.TEXT,
      o: Sequelize.TEXT,
      p: Sequelize.TEXT,
      q: Sequelize.TEXT,
      r: Sequelize.TEXT,
      s: Sequelize.TEXT,
      t: Sequelize.TEXT,
      u: Sequelize.TEXT,
      v: Sequelize.TEXT,
      w: Sequelize.TEXT,
      x: Sequelize.TEXT,
      y: Sequelize.TEXT,
      z: Sequelize.TEXT,
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable("t_excel");
  },
};
