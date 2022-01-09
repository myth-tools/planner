export interface Directory {
    name: string;
    files: string[];
    directories: Directory[];
}
