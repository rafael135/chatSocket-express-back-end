import fs from "node:fs/promises"



export class ImageService {

    constructor() {

    }

    protected async convertFileToBase64(path: string): Promise<string> {
        let fileBase64 = await fs.readFile(path, { encoding: "base64url" });

        return fileBase64;
    }

}