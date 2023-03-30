module.exports = (sequelize, DataTypes) => {

    const Follower = sequelize.define("follower", {
        user_id: {
            type: DataTypes.INTEGER
        },
        follower_id: {
            type: DataTypes.INTEGER
        }
    })

    return Follower
}