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
    await queryInterface.bulkInsert('Courses', [
      {
        categoryId: 1,
        userId: 1,
        name: 'CSS 入门',
        recommended: true,
        introductory: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        chaptersCount: 1,
      },
      {
        categoryId: 2,
        userId: 1,
        name: 'Node.js 项目实践（2024 版）',
        recommended: true,
        introductory: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        chaptersCount: 2,
      },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Courses', null, {});
  }
};
