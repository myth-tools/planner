import { StreamFile } from '../../data-models/stream-file';
import { FileReader } from '../file-reader';

export class WebFile {
    public readonly fileList: StreamFile[] = [];

    constructor(private readonly reader: FileReader) {}
}
