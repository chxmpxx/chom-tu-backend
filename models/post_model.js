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
        },
        likes: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        is_like: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        is_saved: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    })

    return Post
}