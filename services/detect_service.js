const { detectTypeAndCategory } = require("./detect_category_service");
const { detectColor } = require("./detect_color_service");

const detect = async (req, res) => {
    if (req.files) {
        let file = await req.files.file
        // let result = await detectTypeAndCategory(file.data)
        // result.color = await detectColor(file.data)

        let result = { category: 'Top', type: 'Vest', color: 'Green' }
        console.log(result);
    }
    res.send('File uploaded!')
}

module.exports = {
    detect
}