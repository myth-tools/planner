jest.spyOn(global.console, 'log').mockImplementation(() => jest.fn());
jest.spyOn(global.console, 'time').mockImplementation(() => jest.fn());
jest.spyOn(global.console, 'timeEnd').mockImplementation(() => jest.fn());
