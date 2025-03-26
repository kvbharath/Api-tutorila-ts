import { FilterQuery, InferSchemaType } from "mongoose";
import User, { UserDocument } from "../model/user.model";
import { omit } from "lodash";

export async function createUser(input: Omit<InferSchemaType<typeof User>, "comparePassword">) {
    try {
        return await User.create(input);
    } catch (error) {
        throw new Error((error as Error).message || "An error occurred");
    }
}


export async function findUser(query:FilterQuery<UserDocument>) {
    return User.findOne(query).lean();
}
export async function validatePassword({
    email,
    password,
  }: {
    email: UserDocument["email"];
    password: string;
  }): Promise<Omit<UserDocument, "password"> | false> {
    const user = await User.findOne({ email });
    if (!user) {
      return false;
    }
  
    const isValid = await user.comparePassword(password);
    if (!isValid) {
      return false;
    }
  
    // Correctly omit the password field
    return omit(user.toJSON(), "password") as Omit<UserDocument, "password">;
  }