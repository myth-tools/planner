import { access } from 'fs/promises';
import { parse } from 'path';

export async function exists(name: string) {
    try {
        await access(name);
        return true;
    } catch {
        return false;
    }
}

export function getFileName(path: string) {
    const { name, ext } = parse(path);

    return `${name}${ext}`;
}
