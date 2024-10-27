import ImageProcessor from "./ImageProcessor";


// Template Method
// Classe que implementa a lógica de conversão
export class ImageService extends ImageProcessor {

    constructor() {
        super();
    }

    protected convertToBase64(fileContent: Buffer): string {
        // Usando base64url ao invés de base64, mantendo a mesma lógica do código original
        return fileContent.toString("base64url");
    }
}