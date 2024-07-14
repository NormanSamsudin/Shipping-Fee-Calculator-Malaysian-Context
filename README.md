# Shipping Fee Calculator Malaysian Context

This project focuses on integrating multiple API endpoints provided by courier companies to optimize our ability to secure more competitive pricing. Currently, it involves two companies: J&T Express and City-Link Express. Various security measures have been implemented to prevent vulnerabilities such as Cross-Site Scripting (XSS), NoSQL injection, brute force attacks, and code injection. However, no system is entirely secure, and there may still be other ways to bypass these vulnerabilities.

## Installation

You can ignore this part, if you want to run the API through Docker.

Clone repository via HTTPs

```bash
git clone https://github.com/NormanSamsudin/Shipping-Fee-Calculator-Malaysian-Context.git
```

You need to install dependencies for the project. Dependencies is install by using a dependencies manager. I use npm as our dependencies manager. You can install npm by refering to our package manager installation section.

### Install Package manager

Node & npm

For installing Node.js and npm, utilize a Node version manager like nvm for managing multiple Node.js versions or use a Node installer if a version manager isn't feasible. To download the LTS version from the Node.js download page for macOS or Windows, and for Linux, consider using the NodeSource installer. For more instructions, refer to this Node and npm [installation guide](https://kinsta.com/blog/how-to-install-node-js/).

### Install MongoDB Database

MongoDB Community Edition on Windows

[installation guide](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-windows/).

## Environment Variables

To run this project, you will need to add the following environment variables to your config.env file

[`NGROK_API_KEY`](https://ngrok.com)

## Deployment

To deploy this project run on your local machine

```bash
  npm run start
```

## Docker Deployment

Install [Docker](https://www.docker.com/products/docker-desktop/) on your machine.

To deploy this project by Docker run

#### Go to project folder

```bash
  cd Shipping-Fee-Calculator-Malaysian-Context
```

#### Build Container

Production

```bash
  docker-compose -f docker-compose.yml build
```

or Testing

```bash
  docker-compose -f docker-compose-test.yml build
```

#### Run Docker

Production

```bash
  docker-compose -f docker-compose.yml up
```

or Testing

```bash
  docker-compose -f docker-compose-test.yml up
```

## API Reference

#### API Integration

- J&T Express
- City-Link Express

#### Software for API reconnaissance

- Burpsuite

### Endpoint

#### Get shipping fee quotation from J&T

```http
  POST /api/v1/logistic/logistic-jnt
```

| Body                  | Type     | Description  |
| :-------------------- | :------- | :----------- |
| `shipping_rates_type` | `string` | **Required** |
| `sender_postcode`     | `Number` | **Required** |
| `receiver_postcode`   | `Number` | **Required** |
| `destination_country` | `string` | **Required** |
| `shipping_type`       | `string` | **Required** |
| `weight`              | `Number` | **Required** |
| `length`              | `Number` | **Required** |
| `width`               | `Number` | **Required** |
| `height`              | `Number` | **Required** |

#### Get shipping fee quotation from City-Link

```http
  POST logistic/logistic-city
```

| Body                   | Type     | Description  |
| :--------------------- | :------- | :----------- |
| `origin_country`       | `string` | **Required** |
| `origin_state`         | `string` | **Required** |
| `origin_postcode`      | `Number` | **Required** |
| `destination_country`  | `string` | **Required** |
| `destination_state`    | `string` | **Required** |
| `destination_postcode` | `Number` | **Required** |
| `length`               | `Number` | **Required** |
| `width`                | `Number` | **Required** |
| `height`               | `Number` | **Required** |
| `selected_type`        | `Number` | **Required** |
| `parcel_weight`        | `Number` | **Required** |

#### Get shipping fee quotation from J&T and City-Link

```http
  POST logistic/logistic-city
```

| Body                   | Type     | Description  |
| :--------------------- | :------- | :----------- |
| `origin_country`       | `string` | **Required** |
| `origin_state`         | `string` | **Required** |
| `origin_postcode`      | `Number` | **Required** |
| `destination_country`  | `string` | **Required** |
| `destination_state`    | `string` | **Required** |
| `destination_postcode` | `Number` | **Required** |
| `length`               | `Number` | **Required** |
| `width`                | `Number` | **Required** |
| `height`               | `Number` | **Required** |
| `selected_type`        | `Number` | **Required** |
| `parcel_weight`        | `Number` | **Required** |
| `shipping_rates_type`  | `string` | **Required** |
| `sender_postcode`      | `Number` | **Required** |
| `receiver_postcode`    | `Number` | **Required** |
| `shipping_type`        | `string` | **Required** |
| `weight`               | `Number` | **Required** |

## API Testing

#### Access through

- Swagger UI

```bash
  http://127.0.0.1:8000/api-docs/
  https://<ngrok-free.app>:8000/api-docs/
```

- Form Submission

```bash
  http://127.0.0.1:8000/index.html
  https://<ngrok-free.app>:8000/index.html
```

- Postman

## Security Features

- morgan : save log request from client into file access.log
- express-rate-limit : Prevention from from bruteforce attack
- helmet : Prevention from Cross Site Scripting attack
- express-mongo-sanitize : Prevention from NoSQLI attack
- limit : Prevention from Denial of Service attack
