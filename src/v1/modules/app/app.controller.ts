import { Request, Response } from "express";
import ApiResponse from "../../../globals/helpers/apiResponse";
import { BadRequestException, BaseException } from "src/globals/exceptions";
import disposalModel from "../disposal/disposal.model";
import binRepo from "../bin/bin.schema";

export class AppController {
  /**
   * get app stats
   * @route GET .../app/stats
   */
  async getStats(req: Request<any, any, any, any>, res: Response) {
    const id = req.params.id as string;
    let appSats = {
      numBins: 0,
      disposal: {
        total: 0,
        ongoing: 0,
        completed: 0,
      },
    };

    try {
      appSats.disposal = await disposalModel.getDisposalStats();
      appSats.numBins = await binRepo.count();
    } catch (error: any | Error | BaseException) {
      return ApiResponse.create(res).error(error);
    }

    return ApiResponse.create(res).success("app stats retrieved", appSats);
  }
}

const appController = new AppController();

export default appController;
