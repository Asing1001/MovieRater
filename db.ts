import {MongoClient, Db} from 'mongodb';
import * as assert from "assert";
import * as Q from "q";

export class db {    
    static dbUrl: string = 'mongodb://acmLab1001:6RsEeqp9FfKJ@ds145415.mlab.com:45415/movierater';
    static dbConnection: Db = null;    

    public static openDbConnection() {
        var deferred = Q.defer();
        if (this.dbConnection == null) {
            MongoClient.connect(this.dbUrl, (err, db) => {
                assert.equal(null, err);
                console.log("Connected correctly to MongoDB server.");
                this.dbConnection = db;
                deferred.resolve(db);
            });
        }
        return deferred.promise;
    }

    public static closeDbConnection() {
        if (this.dbConnection) {
            this.dbConnection.close();
            this.dbConnection = null;
        }
    }

    public static insertDocument(document: any, collectionName: string): any {
        var deferred = Q.defer();
        this.dbConnection.collection(collectionName).insertOne(document, (err, result) => {
            assert.equal(err, null);
            if (err) {
                deferred.reject(new Error(JSON.stringify(err)));
            }
            deferred.resolve(result);
        });

        return deferred.promise;
    }

    public static insertCollection(document: any, collectionName: string): any {
        var deferred = Q.defer();
        this.dbConnection.collection(collectionName).insert(document, (err, result) => {
            assert.equal(err, null);
            if (err) {
                deferred.reject(new Error(JSON.stringify(err)));
            }
            deferred.resolve(result);
        });

        return deferred.promise;
    }

    public static getCollectionCount(collectionName: string): any {
        var deferred = Q.defer();
        this.dbConnection.collection(collectionName).count((err, result) => {
            assert.equal(err, null);
            if (err) {
                deferred.reject(new Error(JSON.stringify(err)));
            }
            deferred.resolve(result);
        });
        return deferred.promise;
    }

    public static getCollection(collectionName: string): any {
        var deferred = Q.defer();
        this.dbConnection.collection(collectionName).find({}).toArray((err, items) => {
            assert.equal(err, null);
            if (err) {
                deferred.reject(new Error(JSON.stringify(err)));
            }
            deferred.resolve(items);
        });
        return deferred.promise;
    }

    public static getDocument(query: Object, collectionName: string): any {
        var deferred = Q.defer();
        this.dbConnection.collection(collectionName).findOne(query, (err, document) => {
            assert.equal(err, null);
            if (err) {
                deferred.reject(new Error(JSON.stringify(err)));
            }
            deferred.resolve(document);
        });
        return deferred.promise;
    }    
}