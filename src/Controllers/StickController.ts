import { before, GET, POST, route } from "awilix-express";
import AuthService from "../Services/AuthService";
import { StickService } from "../Services/StickService";
import { Request, Response } from "express";
import checkToken from "../Middlewares/Auth";
import TokenService from "../Services/TokenService";




@route("/api/stick")
export class StickController {
    private readonly _authService: AuthService;
    private readonly _tokenService: TokenService;
    private readonly _stickService: StickService;

    constructor(authService: AuthService, tokenService: TokenService, stickService: StickService) {
        this._authService = authService;
        this._tokenService = tokenService;
        this._stickService = stickService;
    }


    @route("/")
    @GET()
    @before(checkToken)
    public async getUserStickers(req: Request, res: Response) {
        let authCookie = req.cookies.auth_session as string | null;
    }


    @route("/")
    @POST()
    @before(checkToken)
    public async saveImageAsSticker(req: Request, res: Response) {
        let authCookie = req.cookies.auth_session as string | null;
    }

    @route("/:stickUuid")
    @GET()
    @before(checkToken)
    public async getImageAsBase64(req: Request, res: Response) {
        let { userUuid } = req.params as { userUuid: string | null };

        if(userUuid == null) {
            res.status(400);
            return res.send({
                status: 400
            });
        }

        let authCookie = req.cookies.auth_session as string | null;

        if (authCookie == null) {
            res.status(401);
            return res.send({
                status: 401
            });
        }

        let logUser = this._tokenService.decodeToken(authCookie);

        
    }

}