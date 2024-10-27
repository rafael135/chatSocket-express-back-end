import fs from "node:fs/promises";

// Classe com o template:
abstract class ImageProcessor {
    public async processImage(path: string): Promise<string> {
        const fileContent = await this.readFile(path);
        const base64Content = this.convertToBase64(fileContent);
        return base64Content;
    }

    protected async readFile(path: string): Promise<Buffer> {
        return fs.readFile(path);
    }

    protected convertToBase64(fileContent: Buffer): string {
        return fileContent.toString("base64");
    }
}

export default ImageProcessor;