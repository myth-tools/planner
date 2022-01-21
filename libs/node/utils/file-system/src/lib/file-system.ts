import { PathLike } from 'fs';
import { access } from 'fs/promises';

export async function exists(path: PathLike, mode?: number) {
    try {
        await access(path, mode);
        return true;
    } catch {
        return false;
    }
}
