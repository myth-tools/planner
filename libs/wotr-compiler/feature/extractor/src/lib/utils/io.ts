import { access } from 'fs/promises';
import { glob } from 'glob';
import { join, parse } from 'path';

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

export async function getFiles(path: string, pattern: string, allDirectories = false) {
    return new Promise<string[]>((resolve, reject) => {
        const match = allDirectories ? join(`${path}`, '**', `${pattern}`) : join(`${path}`, `${pattern}`);

        glob(match, undefined, (error, matches) => {
            if (error) {
                reject(error);
                return;
            }

            resolve(matches);
        });
    });
}
