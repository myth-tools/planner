import { Environment } from '../lib/models/environment';

export const environment: Environment = {
    production: false,
    release: '0.0.0-development',
    game: {
        directory: 'E:/Steam/steamapps/common/Pathfinder Second Adventure',
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
        zipFileName: 'blueprints.zip',
        extractToFolderPath: 'blueprints',
        outputFilePath: 'libs/assets',
        outputFileName: 'explorer'
    },
    version: {
        infoFilePath: '/Wrath_Data/StreamingAssets/Version.info',
        outputFilePath: 'libs/utils/wotr/environment/src/environments/environment.prod.ts'
    }
};
