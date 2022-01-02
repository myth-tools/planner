export const environment = {
    production: false,
    release: '0.0.0-development',
    root: 'E:/Steam/steamapps/common/Pathfinder Second Adventure',
    blueprints: {
        file: 'blueprints.zip',
        output: 'blueprints'
    },
    version: {
        file: '/Wrath_Data/StreamingAssets/Version.info',
        output: 'apps/wotr-planner/src/environments/environment.prod.ts'
    },
    bundles: {
        file: '/Bundles',
        output: 'bundles'
    },
    foldersOfInterest: [
        'Backgrounds',
        'Buffs',
        'Classes',
        'ClassGroups',
        'Encyclopedia',
        'Equipment',
        'Feats',
        'Items',
        'Mythic',
        'Races',
        'Spells',
        'Traits',
        'Weapons',
        'Units/Companions'
    ]
};
