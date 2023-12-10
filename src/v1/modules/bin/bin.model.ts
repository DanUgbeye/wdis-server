import {
  BadRequestException,
  NotFoundException,
} from "../../../globals/exceptions";
import binRepo from "./bin.schema";
import { BinData, BinDocument, BinStatus } from "./bin.types";


export class BinModel {
  /**
   * finds a bin using id
   * @param id bin id
   */
  async findById(id: string) {
    let result: BinDocument | null;
    try {
      result = await binRepo.findById(id);
    } catch (err: any | Error) {
      throw new BadRequestException(err.message);
    }

    if (!result) {
      throw new NotFoundException("Bin not found");
    }

    return result;
  }

  /** finds all bins */
  async findAll() {
    let results: BinDocument[];
    try {
      results = await binRepo.find();
    } catch (err: any | Error) {
      throw new BadRequestException(err.message);
    }

    return results;
  }

  /**
   * creates a new bin
   * @param data bin to create
   */
  async create(data: Partial<BinData>) {
    if (await binRepo.findOne({ location: data.location! })) {
      throw new BadRequestException("Bin name already exists");
    }

    let result: BinDocument;

    try {
      result = await binRepo.create(data);
    } catch (err: any | Error) {
      throw new BadRequestException(err.message || "Failed to create bin");
    }

    return result;
  }

  /**
   * updates a bin status
   * @param id bin id
   * @param status the status to update
   */
  async updateStatus(id: string, status: BinStatus) {
    let result: BinDocument | null;

    try {
      result = await binRepo.findByIdAndUpdate(id, { status }, { new: true });
    } catch (err: any | Error) {
      throw new BadRequestException(err.message);
    }

    if (!result) {
      throw new NotFoundException("Bin not found");
    }

    return result;
  }

  /**
   * updates a bin
   * @param id bin id
   * @param data the data to update
   */
  async update(id: string, data: Partial<BinData>) {
    let result: BinDocument | null;

    try {
      result = await binRepo.findByIdAndUpdate(id, data, { new: true });
    } catch (err: any | Error) {
      throw new BadRequestException(err.message);
    }

    if (!result) {
      throw new NotFoundException("Bin not found");
    }

    return result;
  }

  /**
   * deletes a bin
   * @param id bin id to delete
   */
  async delete(id: string) {
    let result: BinDocument | null;

    try {
      result = await binRepo.findByIdAndDelete(id);
    } catch (err: any | Error) {
      throw new BadRequestException(err.message || "Failed to delete bin");
    }

    if (!result) {
      throw new NotFoundException("Bin not found");
    }

    return result;
  }
}

const binModel = new BinModel();

export default binModel;
