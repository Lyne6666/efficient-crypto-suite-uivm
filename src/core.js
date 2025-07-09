// src/core.js
const fs = require('fs').promises;
const path = require('path');
const logger = require('./logger');

async function processData({ input, output, transformFn }) {
    logger.debug(`Processing data from ${input} to ${output}`);
    
    try {
        // Read input
        const data = await readFile(input);
        
        // Transform data
        const transformed = transformFn ? transformFn(data) : data;
        
        // Write output if specified
        if (output) {
            await writeFile(output, transformed);
            return { input, output, success: true };
        }
        
        return transformed;
    } catch (error) {
        logger.error(`Processing error: ${error.message}`);
        throw error;
    }
}

async function readFile(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    
    try {
        const content = await fs.readFile(filePath, 'utf8');
        
        if (ext === '.json') {
            return JSON.parse(content);
        } else if (ext === '.csv') {
            // Implement CSV parsing
            const lines = content.split('\n');
            const headers = lines[0].split(',');
            return lines.slice(1).map(line => {
                const values = line.split(',');
                return headers.reduce((obj, header, i) => {
                    obj[header] = values[i];
                    return obj;
                }, {});
            });
        }
        
        return content;
    } catch (error) {
        throw new Error(`Failed to read file ${filePath}: ${error.message}`);
    }
}

async function writeFile(filePath, data) {
    const ext = path.extname(filePath).toLowerCase();
    let content;
    
    try {
        if (ext === '.json') {
            content = JSON.stringify(data, null, 2);
        } else if (ext === '.csv') {
            if (!Array.isArray(data) || data.length === 0) {
                throw new Error('Cannot convert non-array or empty data to CSV');
            }
            
            const headers = Object.keys(data[0]);
            const rows = data.map(item => 
                headers.map(header => item[header]).join(',')
            );
            content = [headers.join(','), ...rows].join('\n');
        } else {
            content = String(data);
        }
        
        await fs.writeFile(filePath, content);
    } catch (error) {
        throw new Error(`Failed to write file ${filePath}: ${error.message}`);
    }
}

module.exports = {
    processData,
    readFile,
    writeFile
};
