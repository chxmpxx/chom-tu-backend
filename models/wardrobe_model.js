module.exports = (sequelize, DataTypes) => {

    const Wardrobe = sequelize.define("wardrobe", {
        user_id: {
            type: DataTypes.INTEGER
        },
        category: {
            type: DataTypes.ENUM('Top', 'Bottom', 'Set', 'Shoes', 'Accessory'),
        },
        color: {
            type: DataTypes.ENUM('Brown', 'Yellow', 'Purple', 'Orange', 'Green', 'Pink', 'Blue', 'Red', 'White', 'Beige', 'Black', 'Grey', 'Skin', 'Multi'),
        },
        type: {
            type: DataTypes.ENUM('A', 'B', 'C'),
        },
        is_favorite: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        wardrobe_img: {
            type: DataTypes.STRING
        }
    })

    return Wardrobe
}