import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "../entities/user.entity";
import { Todo } from "../entities/todo.entity";

export const AppDataSource = new DataSource({
  type: "mysql",
  url: process.env.DATABASE_URL,
  synchronize: true, 
  logging: false,
  entities: [User, Todo],
  charset: "utf8mb4",
  timezone: "Z",
});
