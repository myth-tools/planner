module.exports = {
    displayName: 'wotr-explorer-model-blueprint',
    preset: '../../../../../jest.preset.js',
    globals: {
        'ts-jest': {
            tsconfig: '<rootDir>/tsconfig.spec.json'
        }
    },
    transform: {
        '^.+\\.[tj]sx?$': 'ts-jest'
    },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
    coverageDirectory: '../../../../../.output/coverage/libs/wotr/explorer/model/blueprint'
};
