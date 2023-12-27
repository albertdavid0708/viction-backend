import { NextFunction, Request, Response, Router } from "express";
import { IUserService } from "../../services/IUserService";

export class UserRouter {
  private readonly _router = Router();

  constructor(private readonly userService: IUserService) {
    this._configure();
  }

  get router() {
    return this._router;
  }

  private _configure() {
    this._router.get(
      "/:id",
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          res
            .status(200)
            .json(await this.userService.findOneById(parseInt(req.params.id)));
        } catch (error) {
          next(error);
        }
      }
    );

    this._router.post(
      "",
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          res
            .status(200)
            .json(await this.userService.findOneById(parseInt(req.params.id)));
        } catch (error) {
          next(error);
        }
      }
    );
  }
}
