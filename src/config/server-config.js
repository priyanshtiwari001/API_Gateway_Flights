const dotenv = require('dotenv');

dotenv.config();

module.exports = {
    PORT: process.env.PORT,
    SALTY_ROUND:process.env.SALTY_ROUND,
    JWT_SECRET_KEY:process.env.JWT_SECRET_KEY,
    JWT_EXPIRY:process.env.JWT_EXPIRY,
    FLIGHT_SERVICE:process.env.FLIGHT_SERVICE,
    BOOKING_SERVICE:process.env.BOOKING_SERVICE,
}