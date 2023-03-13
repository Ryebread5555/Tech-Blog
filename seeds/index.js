const seedPosts = require('./post-seeds');

const sequelize = require('../config/connection');

const seedAll = async () => {
    await sequelize.sync({ force: true });
    console.log('----DATABASE SYNCED----');
    await seedPosts();
    console.log('----POSTS SEEDED----');

    process.exit(0);
};

seedAll();