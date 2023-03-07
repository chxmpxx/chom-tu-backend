module.exports = (sequelize, DataTypes) => {

    const Post = sequelize.define("post", {
        user_id: {
            type: DataTypes.INTEGER
        },
        post_img: {
            type: DataTypes.STRING
        },
        img_detail: {
            type: DataTypes.STRING
        },
        caption: {
            type: DataTypes.STRING
        }
    })

    return Post
}