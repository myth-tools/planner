const nxPreset = require('@nrwl/jest/preset');

module.exports = {
    ...nxPreset,
    coverageReporters: ['html', 'text-summary'],
    coverageThreshold: {
        global: {
            branches: 80,
            functions: 80,
            lines: 80,
            statements: 80
        }
    }
};
