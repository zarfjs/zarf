import * as path from "path";
import * as fs from "fs/promises";
import { constants } from "fs";

interface FileMeta {
    name: string
    dir: string
    ext: string
}
type FileType = 'DIR' | 'FILE'

export async function walkSync(dir: string) {
    const f = []
    const files = await fs.readdir(dir, {withFileTypes: true});
    for (const file of files) {
        if (file.isDirectory()) {
            await walkSync(path.join(dir, file.name));
        } else {
            f.push(path.join(dir, file.name))
        }
    }
    return f
}

export async function readFilesWithMeta(dir: string): Promise<FileMeta[]> {
    let files: FileMeta[] = [];
    const dirFiles = await walkSync(dir)
    for (const filePath of dirFiles) {
        const { base, ext, dir } = path.parse(filePath)
        files.push({
            name: `${base}${ext}`,
            dir,
            ext
        });
    }
    return files;
}


export async function readAndReturn(path: string, succssFn: (type: FileType, out: Array<FileMeta>) =>  void, errorFn: (err: any) => void) {
    try {
        await fs.access(path, constants.R_OK)
        const fStat = await fs.stat(path)
        if(fStat.isDirectory()) {
            const files = await readFilesWithMeta(path)
            succssFn('DIR', files)
        } else {
            succssFn('FILE', [])
        }
      } catch(err) {
        console.error(`${path} is not readable`);
        errorFn(err)
    }
}
