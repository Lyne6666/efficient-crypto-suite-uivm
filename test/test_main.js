// test/test_efficient.js
const assert = require('assert');
const { processData } = require('../src/core');
const { transform } = require('../src/utils');
const fs = require('fs').promises;
const path = require('path');

describe('Efficient', function() {
    let tempDir;
    let inputFile;
    let outputFile;
    
    before(async function() {
        tempDir = await fs.mkdtemp('/tmp/test-');
        inputFile = path.join(tempDir, 'test.json');
        outputFile = path.join(tempDir, 'output.json');
        
        await fs.writeFile(inputFile, JSON.stringify({ Test: 'Value' }));
    });
    
    after(async function() {
        await fs.rm(tempDir, { recursive: true });
    });
    
    it('should process data', async function() {
        const result = await processData({
            input: inputFile,
            output: outputFile,
            transformFn: transform
        });
        
        assert.strictEqual(result.success, true);
        const outputExists = await fs.access(outputFile)
            .then(() => true)
            .catch(() => false);
        assert.strictEqual(outputExists, true);
    });
    
    it('should transform data', function() {
        const data = { Test: 'Value' };
        const transformed = transform(data);
        assert.deepStrictEqual(transformed, { test: 'Value' });
    });
});
