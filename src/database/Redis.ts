import IORedis from "ioredis";
import { env } from "../config/config";
import { ICache } from "./ICache";

export function createRedisClient(label = "default") {
  const newClient = new IORedis({
    ...env.redis,
    retryStrategy: (times) => {
      return Math.min(times * 50, 2000);
    },
  });
  newClient
    // .on("connect", () => logger.info(`Redis[${label}]: Connected`))
    // .on("ready", () => logger.info(`Redis[${label}]: Ready`))
    .on("error", (error) => console.log(`Redis[${label}]: Error: `, error))
    .on("close", () => console.log(`Redis[${label}]: Close connection`))
    .on("reconnecting", () => console.log(`Redis[${label}]: Reconnecting`))
    .on("+node", (data) =>
      console.log(`Redis[${label}]: A new node is connected: `)
    )
    .on("-node", (data) =>
      console.log(`Redis[${label}]: A node is disconnected: `)
    )
    .on("node error", (data) =>
      console.log(
        `Redis[${label}]: An error occurs when connecting to a node: `
      )
    )
    .on("end", () => console.log(`Redis[${label}]: End`));
  return newClient;
}

class RedisCache implements ICache {
  constructor(public redisClient: IORedis) {}

  public async get(key: string): Promise<any> {
    return await this.redisClient.get(key);
  }

  public async set(key: string, value: any): Promise<any> {
    return await this.redisClient.set(key, value);
  }

  public async delete(key: string): Promise<any> {
    return await this.redisClient.hdel(key);
  }

  public async hset(key: string, field: string, value: any) {
    return await this.redisClient.hset(key, field, value);
  }

  public async hget(key: string, field: string) {
    return await this.redisClient.hget(key, field);
  }
  public async hdel(key: string, field: string) {
    return await this.redisClient.hdel(key, field);
  }
}

const defaultRedisClient = new RedisCache(createRedisClient())
export  {
  RedisCache,
  defaultRedisClient,
}