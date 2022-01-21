import { Environment } from '../models/environment';

export const environment: Environment = {
    production: false,
    release: '0.0.0-development',
    game: {
        directory: 'E:/Steam/steamapps/common/Pathfinder Second Adventure',
        date: '1899-12-31T00:00:00.000Z',
        hash: '00000000000000000000000000000000',
        version: '0.0.0'
    },
    blueprints: {
        zipFileName: 'blueprints.zip',
        extractToFolderPath: '.output/blueprints',
        outputFilePath: 'libs/wotr/assets/src/lib',
        outputFileName: 'explorer'
    },
    version: {
        infoFilePath: '/Wrath_Data/StreamingAssets/Version.info',
        outputFilePaths: [
            'libs/wotr/node/utils/environment/src/lib/environments/environment.prod.ts',
            'libs/wotr/web/utils/environment/src/lib/environments/environment.prod.ts'
        ]
    }
};
