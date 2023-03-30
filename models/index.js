const dbConfig = require('../config/db_config')
require('dotenv').config()

const {Sequelize, DataTypes} = require('sequelize')

const sequelize = new Sequelize(
    dbConfig.DB,
    dbConfig.USER,
    dbConfig.PASSWORD, {
        host: dbConfig.HOST,
        dialect: dbConfig.dialect,
        operatorsAliases: false,

        pool: {
            max: dbConfig.pool.max,
            min: dbConfig.pool.min,
            acquire: dbConfig.pool.acquire,
            idle: dbConfig.pool.idle
        }
    }
)

sequelize.authenticate()
.then(() => {
    console.log('connected...');
})
.catch(err => {
    console.log('Error ', err);
})

const db = {}

db.Sequelize = Sequelize
db.sequelize = sequelize

db.wardrobes = require('./wardrobe_model.js')(sequelize, DataTypes)
db.outfits = require('./outfit_model.js')(sequelize, DataTypes)
db.components = require('./component_model.js')(sequelize, DataTypes)
db.posts = require('./post_model.js')(sequelize, DataTypes)
db.users = require('./user_model.js')(sequelize, DataTypes)
db.likes = require('./like_model.js')(sequelize, DataTypes)
db.saved_posts = require('./saved_post_model.js')(sequelize, DataTypes)
db.reports = require('./report_model.js')(sequelize, DataTypes)
db.followers = require('./follower_model.js')(sequelize, DataTypes)

db.sequelize.sync({ force: false })
.then(() => {
    console.log('yes re-sync done!');
})

// Create Relationships

// wardrobe -> component
db.wardrobes.hasMany(db.components, {
    foreignKey: 'wardrobe_id',
    as: 'component'
})

db.components.belongsTo(db.wardrobes, {
    foreignKey: 'wardrobe_id',
    as: 'wardrobe'
})

// outfit -> component
db.outfits.hasMany(db.components, {
    foreignKey: 'outfit_id',
    as: 'component'
})

db.components.belongsTo(db.outfits, {
    foreignKey: 'outfit_id',
    as: 'outfit'
})

// post -> like
db.posts.hasMany(db.likes, {
    foreignKey: 'post_id',
    as: 'like'
})

db.likes.belongsTo(db.posts, {
    foreignKey: 'post_id',
    as: 'post'
})

// post -> saved_post
db.posts.hasMany(db.saved_posts, {
    foreignKey: 'post_id',
    as: 'saved_post'
})

db.saved_posts.belongsTo(db.posts, {
    foreignKey: 'post_id',
    as: 'post'
})

// post -> report
db.posts.hasMany(db.reports, {
    foreignKey: 'post_id',
    as: 'report'
})

db.reports.belongsTo(db.posts, {
    foreignKey: 'post_id',
    as: 'post'
})

// user -> wardrobe
db.users.hasMany(db.wardrobes, {
    foreignKey: 'user_id',
    as: 'wardrobe'
})

db.wardrobes.belongsTo(db.users, {
    foreignKey: 'user_id',
    as: 'user'
})

// user -> outfit
db.users.hasMany(db.outfits, {
    foreignKey: 'user_id',
    as: 'outfit'
})

db.outfits.belongsTo(db.users, {
    foreignKey: 'user_id',
    as: 'user'
})

// user -> saved_post
db.users.hasMany(db.saved_posts, {
    foreignKey: 'user_id',
    as: 'saved_post'
})

db.saved_posts.belongsTo(db.users, {
    foreignKey: 'user_id',
    as: 'user'
})

// user -> post
db.users.hasMany(db.posts, {
    foreignKey: 'user_id',
    as: 'post'
})

db.posts.belongsTo(db.users, {
    foreignKey: 'user_id',
    as: 'user'
})

// user -> report
db.users.hasMany(db.reports, {
    foreignKey: 'reported_by',
    as: 'report'
})

db.reports.belongsTo(db.users, {
    foreignKey: 'reported_by',
    as: 'user'
})

// user -> follower
db.users.hasMany(db.followers, {
    foreignKey: 'user_id',
    as: 'follow'
})

db.followers.belongsTo(db.users, {
    foreignKey: 'user_id',
    as: 'following'
})

db.followers.belongsTo(db.users, {
    foreignKey: 'follower_id',
    as: 'follower'
})

module.exports = db