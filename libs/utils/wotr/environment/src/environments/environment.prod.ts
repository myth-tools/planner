import { Environment } from '../lib/models/environment';

export const environment: Environment = {
    production: true,
    release: '0.0.0-development',
    game: {
        directory: 'E:/Steam/steamapps/common/Pathfinder Second Adventure',
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
        zipFileName: 'blueprints.zip',
        extractToFolderPath: '.output/blueprints',
        outputFilePath: 'libs/assets',
        outputFileName: 'explorer'
    },
    version: {
        infoFilePath: '/Wrath_Data/StreamingAssets/Version.info',
        outputFilePath: 'libs/utils/wotr/environment/src/environments/environment.prod.ts'
    }
};
