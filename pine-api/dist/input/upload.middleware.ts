import { Middleware } from "koa";
import multer from 'koa-multer';

export class UploadMiddleware {
    private upload: multer.Instance;

    constructor(destination: string){
        this.upload = multer({dest: destination});
    }

    public uploadSingle(fieldName: string): Middleware {
        return this.upload.single(fieldName);
    }
}