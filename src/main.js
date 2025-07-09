// src/main.js
const { processData } = require('./core');
const { validateInput, transform } = require('./utils');
const logger = require('./logger');

class Efficient {
    constructor(config = {}) {
        this.input = config.input || null;
        this.output = config.output || null;
        this.verbose = config.verbose || false;
        
        if (this.verbose) {
            logger.enableDebug();
        }
    }
    
    async run() {
        try {
            logger.info(`Starting ${this.constructor.name}`);
            
            // Validate inputs
            if (!await validateInput(this.input)) {
                throw new Error('Invalid input');
            }
            
            // Process data
            const result = await processData({
                input: this.input,
                output: this.output,
                transformFn: transform
            });
            
            logger.info('Processing completed successfully');
            return result;
        } catch (error) {
            logger.error(`Processing failed: ${error.message}`);
            throw error;
        }
    }
}

module.exports = Efficient;

// CLI implementation
if (require.main === module) {
    const args = require('minimist')(process.argv.slice(2));
    const app = new Efficient({
        input: args.input,
        output: args.output,
        verbose: args.verbose
    });
    
    app.run().catch(err => {
        console.error(err);
        process.exit(1);
    });
}
