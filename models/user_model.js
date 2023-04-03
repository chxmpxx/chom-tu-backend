module.exports = (sequelize, DataTypes) => {

    const User = sequelize.define("user", {
        name: {
            type: DataTypes.STRING
        },
        email: {
            type: DataTypes.STRING
        },
        username: {
            type: DataTypes.STRING
        },
        password: {
            type: DataTypes.STRING
        },
        bio: {
            type: DataTypes.STRING
        },
        user_img: {
            type: DataTypes.STRING
        },
        total_charges: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        is_ban: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        role: {
            type: DataTypes.ENUM('User', 'Admin'),
            defaultValue: 'User'
        }
    },
    {
        paranoid: true
    })

    return User
}