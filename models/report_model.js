module.exports = (sequelize, DataTypes) => {

    const Report = sequelize.define("report", {
        post_id: {
            type: DataTypes.INTEGER
        },
        reported_by: {
            type: DataTypes.INTEGER
        },
        detail: {
            type: DataTypes.STRING
        },
        sub_detail: {
            type: DataTypes.STRING
        },
        status: {
            type: DataTypes.ENUM('Delete Post', 'Discard Report', 'None'),
            defaultValue: 'None'
        }
    })

    return Report
}