module.exports = (sequelize, DataTypes) => {

    const Outfit = sequelize.define("outfit", {
        user_id: {
            type: DataTypes.INTEGER
        },
        style: {
            type: DataTypes.STRING
        },
        detail: {
            type: DataTypes.STRING,
            defaultValue: 'None'
        },
        is_favorite: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        bg_color: {
            type: DataTypes.STRING
        },
        outfit_img: {
            type: DataTypes.STRING
        },
    })

    return Outfit
}