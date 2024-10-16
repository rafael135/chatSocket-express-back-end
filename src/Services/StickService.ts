import { ImageService } from "./ImageService";




export class StickService {
    private readonly _imageService: ImageService;

    constructor(imageService: ImageService) {
        this._imageService = imageService;
    }

    
}