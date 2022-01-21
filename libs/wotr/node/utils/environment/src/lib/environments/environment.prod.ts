import { Environment } from '../models/environment';

export const environment: Environment = {
    production: true,
    release: '0.0.0-development',
    game: {
        directory: 'E:/Steam/steamapps/common/Pathfinder Second Adventure',
        date: '2022-01-12T17:42:00.000Z',
        hash: '2a63f6ea055dd5380a206fe0210e361f06662a31',
        version: '1.1.7c'
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
