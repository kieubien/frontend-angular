const sequelize = require('./database');
const { QueryInterface, DataTypes } = require('sequelize');

async function migrate() {
  const queryInterface = sequelize.getQueryInterface();
  try {
    const tableInfo = await queryInterface.describeTable('users');
    if (!tableInfo.status) {
      await queryInterface.addColumn('users', 'status', {
        type: DataTypes.ENUM('active', 'banned'),
        allowNull: true,
        defaultValue: 'active'
      });
      console.log('Column "status" added successfully.');
    } else {
      console.log('Column "status" already exists.');
    }
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await sequelize.close();
  }
}

migrate();
