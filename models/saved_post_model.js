module.exports = (sequelize, DataTypes) => {

    const SavedPost = sequelize.define("saved_post", {
        user_id: {
            type: DataTypes.INTEGER
        },
        post_id: {
            type: DataTypes.INTEGER
        }
    })

    return SavedPost
}