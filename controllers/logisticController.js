const axios = require('axios');
const cheerio = require('cheerio');
const Logistic = require('./../models/logisticModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/AppError');

exports.getShippingRateJNT = catchAsync(async (req, res, next) => {
  const {
    shipping_rates_type,
    sender_postcode,
    receiver_postcode,
    destination_country,
    shipping_type,
    weight,
    length,
    width,
    height
  } = req.body;

  // Create the payload
  const payload = new URLSearchParams({
    _token: req.csrfToken,
    shipping_rates_type,
    sender_postcode,
    receiver_postcode,
    destination_country,
    shipping_type,
    weight,
    length,
    width,
    height,
    item_value: ''
  });

  // Make the POST request to the logistic API
  const response = await axios.post(
    'https://www.jtexpress.my/shipping-rates',
    payload,

    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        Accept: '*/*',
        'X-Requested-With': 'XMLHttpRequest',
        Origin: 'https://www.jtexpress.my',
        Referer: 'https://www.jtexpress.my/shipping-rates',
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.6478.57 Safari/537.36',
        Cookie: req.sessionInfo
      }
    }
  );

  if (response) {
    const $ = cheerio.load(response.data);
    let shippingRate;

    $('tr').each((i, element) => {
      const thText = $(element)
        .find('th')
        .text()
        .trim();
      if (thText === 'Shipping Rates') {
        shippingRate = $(element)
          .find('td')
          .first()
          .text()
          .trim();
      }
    });
    res.json({ shippingRate: Number(shippingRate) });
  } else {
    return next(new AppError('API J&T Not Found', 404));
  }
});

exports.getShippingRateCityLink = catchAsync(async (req, res, next) => {
  const {
    origin_country,
    origin_state,
    origin_postcode,
    destination_country,
    destination_state,
    destination_postcode,
    length,
    width,
    height,
    selected_type,
    parcel_weight
  } = req.body;

  // Create the payload
  const payload = new URLSearchParams({
    origin_country,
    origin_state,
    origin_postcode,
    destination_country,
    destination_state,
    destination_postcode,
    length,
    width,
    height,
    selected_type,
    parcel_weight,
    document_weight: ''
  });

  // Define request headers
  const headers = {
    Cookie:
      '_fbp=fb.1.1720620565811.556558775830206708; _gid=GA1.2.1278399636.1720825588; _ga_TTP9L9NWGJ=GS1.1.1720831806.5.1.1720831808.0.0.0; _ga=GA1.1.1697117904.1720620565; cf_clearance=26lIjLZPOkwsWifej4F7ex2UvEsxZ1.NRQBV8ZQcNaU-1720831808-1.0.1.1-ndFSxP1peYogZlRQalLl8KLR1JgsFlRSNERa__u8xuqSUuD2iQuGEdWbAtTej8GK8cfmNaEetV0_0fKvy6SF3w; _ga_49CDPVF9D9=GS1.2.1720831808.5.0.1720831808.0.0.0; _ga_NVG102JXL4=GS1.1.1720831802.5.1.1720831810.0.0.0',
    'Sec-Ch-Ua': '"Not/A)Brand";v="8", "Chromium";v="126"',
    'Accept-Language': 'en-US',
    'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.6478.127 Safari/537.36',
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    Accept: 'application/json, text/javascript, */*; q=0.01',
    'X-Requested-With': 'XMLHttpRequest',
    'Sec-Ch-Ua-Platform': '"Windows"',
    Origin: 'https://www.citylinkexpress.com',
    'Sec-Fetch-Site': 'same-origin',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Dest': 'empty',
    Referer: 'https://www.citylinkexpress.com/calculator/',
    'Accept-Encoding': 'gzip, deflate, br',
    Priority: 'u=1, i'
  };

  // Make POST request
  const response = await axios.post(
    'https://www.citylinkexpress.com/wp-json/wp/v2/getShippingRate',
    new URLSearchParams(payload).toString(),
    {
      headers: headers
    }
  );

  if (response) {
    res.json({
      shippingRate: response.data.req.data.rate
    });
  } else {
    return next(new AppError('API CityLink Not Found', 404));
  }
});

exports.getShippingRateCityLinkAndJNT = catchAsync(async (req, res, next) => {
  //caching req into database
  req.body.jnt = res.jntRate;
  req.body.city_link = res.cityLinkRate;

  const doc = await Logistic.create(req.body);

  if (doc) {
    res.send({
      data: [
        {
          courier: 'cityLink',
          rate: res.cityLinkRate
        },
        {
          courier: 'jnt',
          rate: res.jntRate
        }
      ]
    });
  } else {
    return next(new AppError('Failed to create logistic data', 500));
  }
});

//Middleware to get session (JNT)
exports.fetchSessionMiddlewareJNT = catchAsync(async (req, res, next) => {
  const response = await axios.get('https://www.jtexpress.my/shipping-rates');

  if (response) {
    req.sessionInfo = response.headers['set-cookie'];

    // Parse the HTML to extract the CSRF token
    const $ = cheerio.load(response.data);
    const csrfToken = $('input[name="_token"]').val();

    // Attach CSRF token to request object
    req.csrfToken = csrfToken;

    next();
  } else {
    return next(new AppError('Fetch Session Failed', 404));
  }
});

//Middleware POST Request JNT
exports.middlewareShippingRateJNT = catchAsync(async (req, res, next) => {
  const {
    shipping_rates_type,
    sender_postcode,
    receiver_postcode,
    destination_country,
    shipping_type,
    weight,
    length,
    width,
    height
  } = req.body;

  // Create the payload
  const payload = new URLSearchParams({
    _token: req.csrfToken,
    shipping_rates_type,
    sender_postcode,
    receiver_postcode,
    destination_country,
    shipping_type,
    weight,
    length,
    width,
    height,
    item_value: ''
  });

  // Make the POST request to the logistic API
  const response = await axios.post(
    'https://www.jtexpress.my/shipping-rates',
    payload,
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        Accept: '*/*',
        'X-Requested-With': 'XMLHttpRequest',
        Origin: 'https://www.jtexpress.my',
        Referer: 'https://www.jtexpress.my/shipping-rates',
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.6478.57 Safari/537.36',
        Cookie: req.sessionInfo
      }
    }
  );

  if (response) {
    const $ = cheerio.load(response.data);
    let shippingRate;

    $('tr').each((i, element) => {
      const thText = $(element)
        .find('th')
        .text()
        .trim();
      if (thText === 'Shipping Rates') {
        shippingRate = $(element)
          .find('td')
          .first()
          .text()
          .trim();
      }
    });

    res.jntRate = Number(shippingRate);
    next();
  } else {
    return next(new AppError('API JNT Not Found', 404));
  }
});

//Middleware POST Request City-Link
exports.middlewareShippingRateCityLink = catchAsync(async (req, res, next) => {
  const {
    origin_country,
    origin_state,
    origin_postcode,
    destination_country,
    destination_state,
    destination_postcode,
    length,
    width,
    height,
    selected_type,
    parcel_weight
  } = req.body;

  // Create the payload
  const payload = new URLSearchParams({
    origin_country,
    origin_state,
    origin_postcode,
    destination_country,
    destination_state,
    destination_postcode,
    length,
    width,
    height,
    selected_type,
    parcel_weight,
    document_weight: ''
  });

  // Define request headers
  const headers = {
    Cookie:
      '_fbp=fb.1.1720620565811.556558775830206708; _gid=GA1.2.1278399636.1720825588; _ga_TTP9L9NWGJ=GS1.1.1720831806.5.1.1720831808.0.0.0; _ga=GA1.1.1697117904.1720620565; cf_clearance=26lIjLZPOkwsWifej4F7ex2UvEsxZ1.NRQBV8ZQcNaU-1720831808-1.0.1.1-ndFSxP1peYogZlRQalLl8KLR1JgsFlRSNERa__u8xuqSUuD2iQuGEdWbAtTej8GK8cfmNaEetV0_0fKvy6SF3w; _ga_49CDPVF9D9=GS1.2.1720831808.5.0.1720831808.0.0.0; _ga_NVG102JXL4=GS1.1.1720831802.5.1.1720831810.0.0.0',
    'Sec-Ch-Ua': '"Not/A)Brand";v="8", "Chromium";v="126"',
    'Accept-Language': 'en-US',
    'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.6478.127 Safari/537.36',
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    Accept: 'application/json, text/javascript, */*; q=0.01',
    'X-Requested-With': 'XMLHttpRequest',
    'Sec-Ch-Ua-Platform': '"Windows"',
    Origin: 'https://www.citylinkexpress.com',
    'Sec-Fetch-Site': 'same-origin',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Dest': 'empty',
    Referer: 'https://www.citylinkexpress.com/calculator/',
    'Accept-Encoding': 'gzip, deflate, br',
    Priority: 'u=1, i'
  };

  // Make POST request
  const response = await axios.post(
    'https://www.citylinkexpress.com/wp-json/wp/v2/getShippingRate',
    new URLSearchParams(payload).toString(),
    {
      headers: headers
    }
  );

  if (response) {
    res.cityLinkRate = response.data.req.data.rate;
    next();
  } else {
    return next(new AppError('API City-Link Not Found', 404));
  }
});

// Middleware to check if the previous request was made
exports.chechCachePreviousRequest = catchAsync(async (req, res, next) => {
  const doc = await Logistic.findOne(req.body);

  if (doc) {
    // If the document exists, send a response with the cached data
    return res.status(200).json({
      data: [
        {
          courier: 'cityLink',
          rate: doc.city_link
        },
        {
          courier: 'jnt',
          rate: doc.jnt
        }
      ]
    });
  }

  // If no document is found, proceed to the next middleware
  next();
});
