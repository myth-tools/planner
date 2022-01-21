export const fdirMock = (response: jest.Mock) =>
    class FdirMock {
        public group() {
            return this;
        }

        public withBasePath() {
            return this;
        }

        public crawl() {
            return this;
        }

        public async withPromise() {
            return response();
        }
    };
