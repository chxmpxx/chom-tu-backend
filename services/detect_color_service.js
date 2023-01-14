const { detectColorKey } = require('../key_detect_api');
const { toPascalCase } = require('../utils/to_pascal_case_func');

async function detectColor (buffer) {
    const axios = require('axios');
    const FormData = require('form-data');

    const data = new FormData();
    data.append('image', buffer);

    const config = {
        method: 'post',
        url: 'https://api.imagga.com/v2/colors?deterministic=1',
        headers: { 
            'Authorization': detectColorKey, 
            ...data.getHeaders()
        },
        data : data
    };

    try {
        const response = await axios(config)
        let result = findColor(await response.data.result.colors.foreground_colors)
        return result
    } catch(err) {
        console.log(err);
    }
}

function findColor(data) {
    // group colors
    data.forEach(element => {
        if (element.closest_palette_color_parent == 'brown' || element.closest_palette_color_parent == 'light brown') {
            element.closest_palette_color_parent = 'Brown'
        } else if (element.closest_palette_color_parent == 'yellow' || element.closest_palette_color_parent == 'gold') {
            element.closest_palette_color_parent = 'Yellow'
        } else if (element.closest_palette_color_parent == 'purple' || element.closest_palette_color_parent == 'plum' || element.closest_palette_color_parent == 'violet' || element.closest_palette_color_parent == 'lavender') {
            element.closest_palette_color_parent = 'Purple'
        } else if (element.closest_palette_color_parent == 'green' || element.closest_palette_color_parent == 'greige' || element.closest_palette_color_parent == 'olive green' || element.closest_palette_color_parent == 'light green' || element.closest_palette_color_parent == 'dark green' || element.closest_palette_color_parent == 'turquoise' || element.closest_palette_color_parent == 'teal') {
            element.closest_palette_color_parent = 'Green'
        } else if (element.closest_palette_color_parent == 'pink' || element.closest_palette_color_parent == 'light pink' || element.closest_palette_color_parent == 'mauve' || element.closest_palette_color_parent == 'magenta' || element.closest_palette_color_parent == 'hot pink') {
            element.closest_palette_color_parent = 'Pink'
        } else if (element.closest_palette_color_parent == 'blue' || element.closest_palette_color_parent == 'light blue' || element.closest_palette_color_parent == 'navy blue') {
            element.closest_palette_color_parent = 'Blue'
        } else if (element.closest_palette_color_parent == 'red' || element.closest_palette_color_parent == 'maroon') {
            element.closest_palette_color_parent = 'Red'
        } else if (element.closest_palette_color_parent == 'grey' || element.closest_palette_color_parent == 'light grey') {
            element.closest_palette_color_parent = 'Grey'
        } else {
            element.closest_palette_color_parent = toPascalCase(element.closest_palette_color_parent)
        }
    })
  
    // create color list
    const colorList = [{color: data[0].closest_palette_color_parent, percent: data[0].percent}]
    
    for (let i = 1; i<data.length; i++) {
        let bool = false
        colorList.forEach(element => {
            // increase percent
            if(data[i].closest_palette_color_parent == element.color) {
                bool = true
                element.percent += data[i].percent
            }
        })
    
        if(!bool) {
            // add new color
            colorList.push({color: data[i].closest_palette_color_parent, percent: data[i].percent})
        }
    }
    
    // find color
    let result = 'Multi'
    colorList.forEach(element => {
        if(element.percent > 51) {
            result = element.color
        }
    })

    return result
}

module.exports = {
    detectColor
}