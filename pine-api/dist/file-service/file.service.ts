import fs from 'fs';

export class FileService {
    public moveFile(originalPath: string, newPath: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            fs.rename(originalPath, newPath, (err) => {
                if(err) return reject(err);

                resolve(true);
            });
        });
    }

    public exists(path: string): Promise<boolean> {
        return new Promise((resolve) => {
            fs.exists(path, (exists) => {
                resolve(exists);
            });
        });
    }

    public mkdir(path: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            fs.mkdir(path, (err) => {
                if(err) return reject(err);

                resolve(true);
            });
        });
    }
}
