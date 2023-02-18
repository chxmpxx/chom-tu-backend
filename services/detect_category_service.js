const { detectTypeAndCategoryKey } = require("../key_detect_api");
const { toPascalCase } = require("../utils/to_pascal_case_func");

async function detectTypeAndCategory (buffer) {
  const FormData = require("form-data");
  const axios = require("axios");

  const data = new FormData();
  data.append('image', buffer, 'image')

  const options = {
    method: 'POST',
    url: 'https://fashion4.p.rapidapi.com/v1/results',
    headers: {
      'X-RapidAPI-Key': detectTypeAndCategoryKey,
      'X-RapidAPI-Host': 'fashion4.p.rapidapi.com',
      ...data.getHeaders(),
      'Content-Length': data.getLengthSync()
    },
    data: data
  };

  try {
    const response = await axios(options)
    let result = findTypeAndCategory(await response.data.results[0].entities[0].classes)
    return result
  } catch(err) {
    console.log(err);
  }
}

function findTypeAndCategory(data) {
  // find type
  let type = {name: 'None', percent: 0}
  for (const [key, value] of Object.entries(data)) {
    if(type.percent < value) {
      type.name = key
      type.percent = value
    }
  }

  // find category
  let category = 'None'
  if (type.name == 'top, t-shirt, sweatshirt' || type.name == 'outwear' || type.name == 'vest') {
    category = 'Top'
    if (type.name == 'top, t-shirt, sweatshirt') {
      type.name = 't shirt'
    }
    else if (type.name == 'outwear') {
      type.name = 'Jacket'
    }
  } else if (type.name == 'shorts' || type.name == 'trousers' || type.name == 'skirt') {
    category = 'Bottom'
  } else if (type.name == 'dress') {
    category = 'Set'
    type.name = 'Mini Dress'
  } else if (type.name == 'footwear') {
    category = 'Shoes'
  } else {
    category = 'Accessory'
  }

  let result = {category: category, type: toPascalCase(type.name)}
  return result
}

module.exports = {
  detectTypeAndCategory
}