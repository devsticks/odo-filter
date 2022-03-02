const cheerio = require('cheerio');
const axios = require('axios');

console.log('Loading function');

// 	const links = $('.new_product_block'

exports.handler = async (event, context) => {
    //console.log('Received event:', JSON.stringify(event, null, 2));
    
    const axiosResponse = await axios.get('https://www.onedayonly.co.za/');
	const $ = cheerio.load(axiosResponse.data);
	
    let output = [];
    const payload = JSON.parse(event.body);
    let searchStr = new RegExp(payload.searchStr, "gi");
    
    $('.new_product_block').each((ind, item) => {	
		if ($(item).find('.shortname').text().search(searchStr) >= 0 || $(item).find('.brand').text().search(searchStr) >= 0) {
			output.push( 
				{
					name: $(item).find('.shortname').text(),
					url: $(item).prop('href'),
					price: $(item).find('.selling').text(),
				}
			);
		}
	});
	
	return {
        "statusCode": 200,
        "body": JSON.stringify(output),
        "headers": {
            'Content-Type': 'application/json',
        },
    };
   // return event.key1;  // Echo back the first key value
    // throw new Error('Something went wrong'); blah
};
