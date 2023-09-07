import mongoose, { FilterQuery, Model } from "mongoose";
import { UserData, UserDocument } from "./user.types";
import userSchema from "./user.schema";

export class UserRepository {
  protected readonly repo: Model<UserDocument>;

  constructor() {
    this.repo = mongoose.model("User", userSchema);
  }

  async create(data: Partial<UserData>) {
    return await this.repo.create(data);
  }

  async findById(userId: string) {
    return await this.repo.findById(userId);
  }

  async findByEmail(email: string) {
    return await this.repo.findOne({ email });
  }

  async find(filter: FilterQuery<UserData>) {
    return await this.repo.find(filter);
  }

  async update(userId: string, data: Partial<UserData>) {
    return this.repo.updateOne({ _id: userId }, data);
  }

  async delete(userId: string) {
    return this.repo.deleteOne({ _id: userId });
  }
}

const userRepository = new UserRepository();

export default userRepository;
