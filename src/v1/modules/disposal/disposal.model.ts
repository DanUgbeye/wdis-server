import {
  BadRequestException,
  NotFoundException,
} from "../../../globals/exceptions";
import binRepo from "../bin/bin.schema";
import { BIN_STATUS, BinDocument } from "../bin/bin.types";
import disposalRepo from "./disposal.schema";
import {
  DISPOSAL_STATUS,
  DisposalData,
  DisposalDocument,
} from "./disposal.types";

export class DisposalModel {
  /**
   * finds all disposals
   */
  async findAll() {
    let result: DisposalDocument[];

    try {
      result = await disposalRepo.find();
    } catch (err: any | Error) {
      throw new BadRequestException(err.message);
    }

    return result;
  }

  /**
   * finds a disposal using id
   * @param id disposal id
   */
  async findById(id: string) {
    let result: DisposalDocument | null;
    try {
      result = await disposalRepo.findById(id);
    } catch (err: any | Error) {
      throw new BadRequestException(err.message);
    }

    if (!result) {
      throw new NotFoundException("Disposal not found");
    }

    return result;
  }

  /**
   * get disposal stats
   */
  async getDisposalStats() {
    let result: DisposalDocument | null;
    let stats = {
      total: 0,
      completed: 0,
      ongoing: 0,
    };

    try {
      stats.total = await disposalRepo.count();
      stats.completed = await disposalRepo.count({
        status: DISPOSAL_STATUS.COMPLETED,
      });
      stats.ongoing = await disposalRepo.count({
        status: DISPOSAL_STATUS.ONGOING,
      });
    } catch (err: any | Error) {
      throw new BadRequestException(err.message);
    }

    return stats;
  }

  /**
   * finds all disposals for a bin
   * @param binId bin id to get all disposals for
   * @returns
   */
  async findAllForBin(binId: string) {
    let results: DisposalDocument[];
    try {
      results = await disposalRepo.find({ binId });
    } catch (err: any | Error) {
      throw new BadRequestException(err.message);
    }

    return results;
  }

  /**
   * creates a new disposal
   * @param data disposal to create
   */
  async create(data: Partial<DisposalData>) {
    let result: DisposalDocument;

    try {
      result = await disposalRepo.create(data);
    } catch (err: any | Error) {
      throw new BadRequestException(err.message || "Failed to create disposal");
    }

    return result;
  }

  /**
   * updates a disposal
   * @param id disposal id
   * @param data disposal data
   */
  async update(id: string, data: Partial<DisposalData>) {
    let result: DisposalDocument | null;

    try {
      result = await disposalRepo.findByIdAndUpdate(id, data, {
        new: true,
      });
    } catch (err: any | Error) {
      throw new BadRequestException(err.message || "Failed to create disposal");
    }

    if (!result) {
      throw new NotFoundException("Disposal not found");
    }

    return result;
  }

  /**
   * marks a disposal as completed
   * @param binId disposal is
   * @param data disposal data
   */
  async markAsComplete(binId: string) {
    let result: DisposalDocument | null;
    const update: Partial<DisposalData> = {
      status: DISPOSAL_STATUS.COMPLETED,
    };

    try {
      result = await disposalRepo.findOneAndUpdate(
        { binId, status: DISPOSAL_STATUS.ONGOING },
        update,
        {
          new: true,
        }
      );
    } catch (err: any | Error) {
      throw new BadRequestException(err.message || "Failed to update disposal");
    }

    // if (!result) {
    //   throw new NotFoundException("Disposal not found");
    // }

    return result;
  }

  /**
   * deletes a disposal
   * @param id disposal id to delete
   */
  async delete(id: string) {
    let disposal: DisposalDocument | null;
    let bin: BinDocument | null;

    try {
      disposal = await disposalRepo.findById(id);
    } catch (err: any | Error) {
      throw new BadRequestException(err.message || "Failed to delete disposal");
    }

    if (!disposal) {
      throw new NotFoundException("Disposal not found");
    }

    try {
      bin = await binRepo.findById(disposal.binId);
    } catch (err: any | Error) {
      throw new BadRequestException(err.message || "Bin not found");
    }

    if (!bin) {
      throw new NotFoundException("Bin not found");
    }

    await disposal.deleteOne();
    // disposal = await disposalRepo.findByIdAndDelete(id);

    if (
      disposal.status === DISPOSAL_STATUS.ONGOING &&
      bin.status === BIN_STATUS.IN_DISPOSAL
    ) {
      try {
        await bin.updateOne({
          status: BIN_STATUS.FULL,
        });
      } catch (error) {
        console.log("failed to update bin after deleting an ongoingdisposal");
      }
    }

    return disposal;
  }
}

const disposalModel = new DisposalModel();

export default disposalModel;
