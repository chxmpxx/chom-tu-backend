const asyncHandler = require('express-async-handler');
const db = require('../models')
const { Op } = require('sequelize')
const sequelize = require('sequelize')

const Report = db.reports
const User = db.users
const Post = db.posts

// @desc    Create Report
// @route   POST /api/report/add_report
// @access  Private
const addReport = asyncHandler(async (req, res) => {
    const info = {
        post_id: req.body.post_id,
        reported_by: req.user.id,
        detail: req.body.detail,
        sub_detail: req.body.sub_detail
    }
    await Report.create(info);
    res.status(200).send('Add report')
})

// @desc    Get All Reports
// @route   POST /api/report/all_report
// @access  Private
const getAllReports = asyncHandler(async (req, res) => {
    let order = req.body.order
    let detail = req.body.detail
    let status = req.body.status
    let where = {}
    let paranoid = true

    if (status == 'None') {
        where.status = status
    } else {
        where.status = { [Op.ne]: 'None' }
        paranoid = false
    }
    
    if (detail.length != 0) {
        where.detail =  { [Op.in]: detail }
    }

    let reports = await Report.findAll({ where: where, order: order })

    for (let i = 0; i < reports.length; i++) {
        let postOwnerName = await Post.findOne({
            where: { id: reports[i].post_id },
            paranoid: paranoid,
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['username'],
                    paranoid: paranoid
                }
            ]
        })
        if (postOwnerName && postOwnerName.user) {
            reports[i].dataValues.post_owner_name = postOwnerName.user.username
        }
    }

    if (status != 'None') {
        for (let i = 0; i < reports.length; i++) {
            let reportedByName = await User.findOne({
                where: { id: reports[i].reported_by },
                attributes: ['username']
            })
            if (reportedByName) {
                reports[i].dataValues.reported_by_name = reportedByName.username
            }
        }
    }

    res.status(200).send(reports)
})

// @desc    Get One Report
// @route   GET /api/report/:id
// @access  Private
const getOneReport = asyncHandler(async (req, res) => {
    let id = req.params.id
    let report = await Report.findOne({
        where: { id: id },
        include: [
            {
                model: Post,
                as: 'post',
                attributes: ['post_img', 'caption'],
                include: [
                    {
                        model: User,
                        as: 'user',
                        attributes: ['username']
                    }
                ]
            }
        ]
    })

    // get username
    let reportedByName = await User.findOne({
        where: { id: report.reported_by },
        attributes: ['username']
    })

    report.dataValues.reported_by_name = reportedByName.username
    report.dataValues.post_owner_name = report.post.user.username
    report.dataValues.post_img = report.post.post_img
    report.dataValues.caption = report.post.caption

    res.status(200).send(report)
})

// @desc    Update Report
// @route   PUT /api/report/:id
// @access  Private
const updateReport = asyncHandler(async (req, res) => {
    let id = req.params.id
    let charges = req.body.charges

    const report = await Report.update(req.body, {where: { id: id }})

    if (req.body.status == 'Delete Post') {
        let id = req.body.post_id
        // todo: add soft delete
        await Post.destroy({ where: { id: id } })

        // automatic ban
        let post = await Post.findOne({ where: { id: id }, attributes: ['user_id'], paranoid: false })
        let user = await User.findOne({ where: { id: post.user_id }})
        await User.update(
            { total_charges: sequelize.literal('total_charges + 1') },
            { where: { id: user.id } }
        )
        user = await User.findOne({ where: { id: post.user_id }})

        if (user.total_charges >= charges) {
            let info = { is_ban: 1 }
            await User.update(info, {where: { id: user.id }})
        }
    }
    res.status(200).send(report)
})

// @desc    Delete One Report
// @route   DELETE /api/report/:id
// @access  Private
const deleteReport = asyncHandler(async (req, res) => {
    let id = req.params.id
    await Report.destroy({ where: { id: id } })
    res.status(200).send('Report is delete!')
})

module.exports = {
    addReport,
    
    getAllReports,
    getOneReport,

    updateReport,
    deleteReport
}