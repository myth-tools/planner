export class VersionInfo {
    public date: Date;
    public hash: string;
    public version: string;

    constructor(versionInfo: string) {
        const [date, time, hash, version] = versionInfo.split(' ');

        this.date = new Date(`${date} ${time} UTC`);
        this.hash = hash;
        this.version = version;
    }
}
