import { Request, Response } from "express";
import disposalModel from "./disposal.model";
import ApiResponse from "../../../globals/helpers/apiResponse";
import { DisposalData } from "./disposal.types";
import { BaseException } from "src/globals/exceptions";

export class DisposalController {
  /**
   * get disposal data
   * @route GET .../disposal/:id
   */
  async getAll(req: Request<any, any, any, any>, res: Response) {
    let disposal;

    try {
      disposal = await disposalModel.findAll();
    } catch (error: any | Error | BaseException) {
      return ApiResponse.create(res).error(error);
    }

    return ApiResponse.create(res).success(
      "disposals found successfully",
      disposal
    );
  }

  /**
   * get disposal data
   * @route GET .../disposal/:id
   */
  async getById(req: Request<any, any, any, any>, res: Response) {
    const id = req.params.id as string;
    let disposal;

    try {
      disposal = await disposalModel.findById(id);
    } catch (error: any | Error | BaseException) {
      return ApiResponse.create(res).error(error);
    }

    return ApiResponse.create(res).success(
      "disposal found successfully",
      disposal
    );
  }

  /**
   * get disposal stats
   * @route GET .../disposal/stats
   */
  async getStats(req: Request<any, any, any, any>, res: Response) {
    let stats;

    try {
      stats = await disposalModel.getDisposalStats();
    } catch (error: any | BaseException) {
      return ApiResponse.create(res).error(error);
    }

    return ApiResponse.create(res).success("disposal stats retrieved", stats);
  }

  /**
   * update disposal
   * @route PATCH .../disposal/:id
   */
  async update(req: Request<any, any, any, any>, res: Response) {
    const id = req.params.id as string;
    const updateData = req.body.status as Partial<DisposalData>;
    let updatedDisposal;

    try {
      updatedDisposal = await disposalModel.update(id, updateData);
    } catch (error: any | Error | BaseException) {
      return ApiResponse.create(res).error(error);
    }

    return ApiResponse.create(res).success(
      "disposal updated successfully",
      updatedDisposal
    );
  }

  /**
   * delete disposal
   * @route DELETE .../disposal/:id
   */
  async delete(req: Request<any, any, any, any>, res: Response) {
    const id = req.params.id as string;

    try {
      await disposalModel.delete(id);
    } catch (error: any | Error | BaseException) {
      return ApiResponse.create(res).error(error);
    }

    return ApiResponse.create(res).success(
      "disposal deleted successfully",
      200
    );
  }
}

const disposalController = new DisposalController();

export default disposalController;
