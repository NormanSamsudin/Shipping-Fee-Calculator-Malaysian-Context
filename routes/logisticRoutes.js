const express = require('express');

const logisticController = require('./../controllers/logisticController');

// nak bind
const logisticRouter = express.Router();

logisticRouter
  .route('/logistic-jnt')
  .post(
    logisticController.fetchSessionMiddlewareJNT,
    logisticController.getShippingRateJNT
  );

logisticRouter
  .route('/logistic-city')
  .post(logisticController.getShippingRateCityLink);

logisticRouter
  .route('/logistic-jnt-city')
  .post(
    logisticController.chechCachePreviousRequest,
    logisticController.fetchSessionMiddlewareJNT,
    logisticController.middlewareShippingRateJNT,
    logisticController.middlewareShippingRateCityLink,
    logisticController.getShippingRateCityLinkAndJNT
  );

module.exports = logisticRouter;

/**
 * @swagger
 * /logistic-jnt:
 *   post:
 *     summary: Calculate shipping rate with Jnt Express
 *     tags:
 *       - Single Courier Calculator
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               shipping_rates_type:
 *                 type: string
 *                 example: "domestic"
 *               sender_postcode:
 *                 type: integer
 *                 example: 56100
 *               receiver_postcode:
 *                 type: integer
 *                 example: 56000
 *               destination_country:
 *                 type: string
 *                 example: "BWN"
 *               shipping_type:
 *                 type: string
 *                 example: "EZ"
 *               weight:
 *                 type: number
 *                 example: 20
 *               length:
 *                 type: number
 *                 example: 70
 *               width:
 *                 type: number
 *                 example: 20
 *               height:
 *                 type: number
 *                 example: 50
 *               item_value:
 *                 type: string
 *                 example: ""
 *     responses:
 *       200:
 *         description: Successful calculation of shipping rate.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 shippingRate:
 *                   type: number
 *                   description: Calculated shipping rate.
 *       500:
 *         description: Internal server error occurred.
 */

/**
 * @swagger
 * /logistic-city:
 *   post:
 *     summary: Calculate shipping rate
 *     tags:
 *       - Single Courier Calculator
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               origin_country:
 *                 type: string
 *                 example: "MY"
 *               origin_state:
 *                 type: string
 *                 example: "Kuala Lumpur"
 *               origin_postcode:
 *                 type: integer
 *                 example: 56100
 *               destination_country:
 *                 type: string
 *                 example: "MY"
 *               destination_state:
 *                 type: string
 *                 example: "Kuala Lumpur"
 *               destination_postcode:
 *                 type: integer
 *                 example: 56000
 *               length:
 *                 type: number
 *                 example: 50
 *               width:
 *                 type: number
 *                 example: 70
 *               height:
 *                 type: number
 *                 example: 20
 *               selected_type:
 *                 type: integer
 *                 example: 1
 *               parcel_weight:
 *                 type: number
 *                 example: 14
 *               document_weight:
 *                 type: string
 *                 example: ""
 *     responses:
 *       200:
 *         description: Successful calculation of shipping rate.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 shippingRate:
 *                   type: number
 *                   description: Calculated shipping rate.
 *       500:
 *         description: Internal server error occurred.
 */

/**
 * @swagger
 * /logistic-jnt-city:
 *   post:
 *     summary: Calculate shipping rates for both jnt and city-link
 *     tags:
 *       - Multiple Shipping Rate
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               origin_country:
 *                 type: string
 *                 example: "MY"
 *               origin_state:
 *                 type: string
 *                 example: "Kuala Lumpur"
 *               origin_postcode:
 *                 type: integer
 *                 example: 56100
 *               destination_country:
 *                 type: string
 *                 example: "MY"
 *               destination_state:
 *                 type: string
 *                 example: "Kuala Lumpur"
 *               destination_postcode:
 *                 type: integer
 *                 example: 56000
 *               length:
 *                 type: number
 *                 example: 50
 *               width:
 *                 type: number
 *                 example: 70
 *               height:
 *                 type: number
 *                 example: 20
 *               selected_type:
 *                 type: integer
 *                 example: 1
 *               parcel_weight:
 *                 type: number
 *                 example: 14
 *               document_weight:
 *                 type: string
 *                 example: ""
 *               shipping_rates_type:
 *                 type: string
 *                 example: "domestic"
 *               sender_postcode:
 *                 type: integer
 *                 example: 56100
 *               receiver_postcode:
 *                 type: integer
 *                 example: 56000
 *               shipping_type:
 *                 type: string
 *                 example: "EZ"
 *               weight:
 *                 type: number
 *                 example: 20
 *               item_value:
 *                 type: string
 *                 example: ""
 *     responses:
 *       200:
 *         description: Successful calculation of shipping rates.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 shippingrate:
 *                   type: number
 *                   description: Calculated shipping rate.
 *       500:
 *         description: Internal server error occurred.
 */
