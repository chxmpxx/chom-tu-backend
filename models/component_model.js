module.exports = (sequelize, DataTypes) => {

    const Component = sequelize.define("component", {
        wardrobe_id: {
            type: DataTypes.INTEGER
        },
        outfit_id: {
            type: DataTypes.INTEGER
        },
        position: {
            type: DataTypes.STRING
        }
    },
    {
        paranoid: true
    })

    return Component
}