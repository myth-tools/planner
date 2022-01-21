import { Environment } from '../models/environment';

export const environment: Environment = {
    production: false,
    release: '0.0.0-development',
    game: {
        date: '1899-12-31T00:00:00.000Z',
        hash: '00000000000000000000000000000000',
        version: '0.0.0'
    },
    firebase: {
        apiKey: 'AIzaSyCRsh4TCiKBZ9tFH6rJaJ_OdZt-3ckcbHI',
        prefix: 'short-url.myth-tools.com',
        domain: 'wotr.myth-tools.com'
    },
    blueprints: {
        outputFilePath: 'libs/wotr/assets/src/lib',
        outputFileName: 'explorer'
    }
};
