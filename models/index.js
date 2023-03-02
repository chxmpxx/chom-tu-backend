const dbConfig = require('../config/db_config')

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

db.sequelize.sync({ force: false })
.then(() => {
    console.log('yes re-sync done!');
})

// create Relationships
db.wardrobes.hasMany(db.components, {
    foreignKey: 'wardrobe_id',
    as: 'component'
})

db.components.belongsTo(db.wardrobes, {
    foreignKey: 'wardrobe_id',
    as: 'wardrobe'
})

db.outfits.hasMany(db.components, {
    foreignKey: 'outfit_id',
    as: 'component'
})

db.components.belongsTo(db.outfits, {
    foreignKey: 'outfit_id',
    as: 'outfit'
})

module.exports = db