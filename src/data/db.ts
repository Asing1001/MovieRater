import { MongoClient, Db } from 'mongodb';
import log from '../helper/log';

const DEFAULT_DB_URL = 'mongodb://localhost:27018/movierater';

function getDbUrl() {
  return process.env.DB_URL || DEFAULT_DB_URL;
}

declare global {
  var __mongoClient: MongoClient | undefined;
  var __mongoDb: Db | undefined;
}

export class Mongo {
  static get dbConnection(): MongoClient { return globalThis.__mongoClient ?? null; }
  static set dbConnection(v: MongoClient) { globalThis.__mongoClient = v; }
  static get db(): Db { return globalThis.__mongoDb ?? null; }
  static set db(v: Db) { globalThis.__mongoDb = v; }

  public static async openDbConnection() {
    try {
      if (!this.dbConnection) {
        this.dbConnection = new MongoClient(getDbUrl());
        await this.dbConnection.connect();
        this.db = this.dbConnection.db();
        console.log('connect to mongodb correctly');
      }
    } catch (error) {
      console.error(error);
    }
    return this.dbConnection;
  }

  public static closeDbConnection() {
    if (this.dbConnection) {
      this.dbConnection.close();
      this.dbConnection = null;
    }
  }

  public static async updateDocument(
    filter: Object,
    value: Object,
    collectionName: string,
    options = { upsert: true }
  ) {
    try {
      log.debug('updateDocument', arguments);
      return await this.db
        .collection(collectionName)
        .updateOne(filter, { $set: value }, options);
    } catch (error) {
      console.error(error);
    }
  }

  public static async insertDocument(document: any, collectionName: string) {
    try {
      log.debug('insertDocument', arguments);
      return await this.db.collection(collectionName).insertOne(document);
    } catch (error) {
      console.error(error);
    }
  }

  public static async getCollection<T>({ name, sort = {}, options = {} }): Promise<any[]> {
    try {
      await this.openDbConnection();
      log.debug('getCollection', arguments);
      return await this.db
        .collection<T>(name)
        .find({}, options)
        .sort(sort)
        .toArray();
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  public static async getDocument(query: Object, collectionName: string) {
    try {
      log.debug('getDocumnet', arguments);
      return await this.db.collection(collectionName).findOne(query);
    } catch (error) {
      console.error(error);
    }
  }
}
