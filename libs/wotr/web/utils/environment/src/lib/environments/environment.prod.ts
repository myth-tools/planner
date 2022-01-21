import { Environment } from '../models/environment';

export const environment: Environment = {
    production: true,
    release: '0.0.0-development',
    game: {
        date: '2022-01-12T17:42:00.000Z',
        hash: '2a63f6ea055dd5380a206fe0210e361f06662a31',
        version: '1.1.7c'
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
