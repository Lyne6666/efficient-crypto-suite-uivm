// src/utils.js
const logger = require('./logger');

function validateInput(input) {
    if (!input) {
        logger.warn('No input provided');
        return false;
    }
    return true;
}

function transform(data) {
    if (Array.isArray(data)) {
        return data.map(item => {
            const newItem = {};
            for (const key in item) {
                newItem[key.toLowerCase()] = item[key];
            }
            return newItem;
        });
    } else if (typeof data === 'object' && data !== null) {
        const result = {};
        for (const key in data) {
            result[key.toLowerCase()] = data[key];
        }
        return result;
    }
    return data;
}

function validateEmail(email) {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
}

function generateHash(data) {
    const crypto = require('crypto');
    return crypto.createHash('sha256')
        .update(data)
        .digest('hex');
}

module.exports = {
    validateInput,
    transform,
    validateEmail,
    generateHash
};
