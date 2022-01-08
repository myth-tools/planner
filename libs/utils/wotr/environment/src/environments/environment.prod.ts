import { Environment } from '../lib/models/environment';

export const environment: Environment = {
    production: true,
    release: '0.0.0-development',
    game: {
        directory: 'E:/Steam/steamapps/common/Pathfinder Second Adventure',
        date: '2021-12-22T14:51:00.000Z',
        hash: '34f0951707d3c52b611428f8db5b4710080c8b45',
        version: '1.1.6e'
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
