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
    foldersOfInterest: [
        'Backgrounds',
        'Buffs',
        'Classes',
        'Classgroups',
        'Encycolpedia',
        'Equipment',
        'Feats',
        'Items',
        'Mythic',
        'Races',
        'Spells',
        'Traits',
        'Weapons'
    ]
};
