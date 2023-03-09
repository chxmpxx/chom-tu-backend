module.exports = (sequelize, DataTypes) => {

    const Like = sequelize.define("like", {
        user_id: {
            type: DataTypes.INTEGER
        },
        post_id: {
            type: DataTypes.INTEGER
        }
    })

    return Like
}