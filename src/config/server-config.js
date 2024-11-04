const dotenv = require('dotenv');

dotenv.config();

module.exports = {
    PORT: process.env.PORT,
    SALTY_ROUND:process.env.SALTY_ROUND
}