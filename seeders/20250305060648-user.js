const bcrypt = require('bcryptjs')

'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await queryInterface.bulkInsert('Users', [
      {
        email: 'admin@qlfb.cn',
        username: 'admin',
        password: bcrypt.hashSync('123123', 10),
        nickname: '超厉害的管理员',
        sex: 2,
        role: 100,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        email: 'user1@qlfb.cn',
        username: 'user1',
        password: bcrypt.hashSync('123123', 10),
        nickname: '普通用户1',
        sex: 0,
        role: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        email: 'user2@qlfb.cn',
        username: 'user2',
        password: bcrypt.hashSync('123123', 10),
        nickname: '普通用户2',
        sex: 0,
        role: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        email: 'user3@qlfb.cn',
        username: 'user3',
        password: bcrypt.hashSync('123123', 10),
        nickname: '普通用户3',
        sex: 1,
        role: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Users', null, {});
  }
};
