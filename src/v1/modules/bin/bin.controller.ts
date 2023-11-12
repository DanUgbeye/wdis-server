import { Request, Response } from "express";
import binModel from "./bin.model";
import ApiResponse from "../../../globals/helpers/apiResponse";
import { BIN_STATUS, BinData, BinStatus } from "./bin.types";
import {
  BadRequestException,
  BaseException,
} from "../../../globals/exceptions";
import disposalModel from "../disposal/disposal.model";

export class BinController {
  /**
   * get bin data
   * @route GET .../bin/:id
   */
  async findById(req: Request<any, any, any, any>, res: Response) {
    const id = req.params.id as string;
    let bin;

    try {
      bin = await binModel.findById(id);
    } catch (error: any | Error | BaseException) {
      return ApiResponse.create(res).error(error);
    }

    return ApiResponse.create(res).success("bin found successfully", bin);
  }

  /**
   * get all disposals for a bin
   * @route GET - .../bin/:id/disposal
   */
  async findAllDisposalsForBin(
    req: Request<any, any, any, any>,
    res: Response
  ) {
    const id = req.params.id as string;
    let disposals;

    try {
      disposals = await disposalModel.findAllForBin(id);
    } catch (error: any | Error | BaseException) {
      return ApiResponse.create(res).error(error);
    }

    return ApiResponse.create(res).success(
      "disposals found successfully",
      disposals
    );
  }

  /**
   * get all bin data
   * @route GET - .../bin
   */
  async findAll(req: Request<any, any, any, any>, res: Response) {
    let bins;

    try {
      bins = await binModel.findAll();
    } catch (error: any | Error | BaseException) {
      return ApiResponse.create(res).error(error);
    }

    return ApiResponse.create(res).success("bins found successfully", bins);
  }

  /**
   * create new bin
   * @route POST - .../bin
   */
  async create(req: Request<any, any, any, any>, res: Response) {
    const data = req.body as BinData;
    let newBin;

    try {
      newBin = await binModel.create(data);
    } catch (error: any | Error | BaseException) {
      return ApiResponse.create(res).error(error);
    }

    return ApiResponse.create(res).success(
      "bin created successfully",
      newBin,
      201
    );
  }

  /**
   * create new disposal
   * @route POST - .../bin/:id/disposal
   */
  async createDisposal(req: Request<any, any, any, any>, res: Response) {
    const id = req.params.id as string;
    let newDisposal;
    let bin;

    try {
      bin = await binModel.findById(id);
      if (bin.status === BIN_STATUS.IN_DISPOSAL) {
        throw new BadRequestException("a disposal is on going for this bin");
      }
    } catch (error: any | BaseException) {
      return ApiResponse.create(res).error(error);
    }

    try {
      newDisposal = await disposalModel.create({ binId: id });
      bin.status = BIN_STATUS.IN_DISPOSAL;
      await bin.save();
    } catch (error: any | Error | BaseException) {
      return ApiResponse.create(res).error(error);
    }

    return ApiResponse.create(res).success(
      "disposal created successfully",
      newDisposal,
      201
    );
  }

  /**
   * update bin status to ongoing
   * @route PATCH .../bin/:id/status/ongoing
   */
  async markAsOngoing(req: Request<any, any, any, any>, res: Response) {
    const id = req.params.id as string;
    const status = BIN_STATUS.IN_DISPOSAL;
    let updatedBin;

    try {
      await disposalModel.create({ binId: id });
    } catch (error: any | Error | BaseException) {
      return ApiResponse.create(res).error(error);
    }

    try {
      updatedBin = await binModel.updateStatus(id, status);
    } catch (error: any | Error | BaseException) {
      return ApiResponse.create(res).error(error);
    }

    return ApiResponse.create(res).success(
      "bin status updated successfully",
      updatedBin
    );
  }

  /**
   * update bin status to full
   * @route PATCH .../bin/:id/status/full
   */
  async markAsFull(req: Request<any, any, any, any>, res: Response) {
    const id = req.params.id as string;
    const status = BIN_STATUS.FULL;
    let updatedBin;

    try {
      updatedBin = await binModel.updateStatus(id, status);
    } catch (error: any | Error | BaseException) {
      return ApiResponse.create(res).error(error);
    }

    return ApiResponse.create(res).success(
      "bin status updated successfully",
      updatedBin
    );
  }

  /**
   * update bin status to empty
   * @route PATCH .../bin/:id/status/empty
   */
  async markAsEmpty(req: Request<any, any, any, any>, res: Response) {
    const id = req.params.id as string;
    const status = BIN_STATUS.EMPTY;
    let updatedBin;

    try {
      await disposalModel.markAsComplete(id);
    } catch (error: any | Error | BaseException) {
      return ApiResponse.create(res).error(error);
    }

    try {
      updatedBin = await binModel.updateStatus(id, status);
    } catch (error: any | Error | BaseException) {
      return ApiResponse.create(res).error(error);
    }

    return ApiResponse.create(res).success(
      "bin status updated successfully",
      updatedBin
    );
  }

  /**
   * update bin
   * @route PATCH .../bin/:id
   */
  async update(req: Request<any, any, any, any>, res: Response) {
    const id = req.params.id as string;
    const updateData = req.body.status as Partial<BinData>;
    let updatedBin;

    try {
      updatedBin = await binModel.update(id, updateData);
    } catch (error: any | Error | BaseException) {
      return ApiResponse.create(res).error(error);
    }

    return ApiResponse.create(res).success(
      "bin updated successfully",
      updatedBin
    );
  }

  /**
   * delete bin
   * @route DELETE .../bin/:id
   */
  async delete(req: Request<any, any, any, any>, res: Response) {
    const id = req.params.id as string;

    try {
      await binModel.delete(id);
    } catch (error: any | Error | BaseException) {
      return ApiResponse.create(res).error(error);
    }

    return ApiResponse.create(res).success("bin deleted successfully", 200);
  }
}

const binController = new BinController();

export default binController;
