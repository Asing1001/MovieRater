import { roughSizeOfObject } from '../helper/util';
import * as redis from 'redis';
import { systemSetting } from '../configs/systemSetting';

const client = redis.createClient(systemSetting.REDIS_URL);

export function get(key): Promise<any> {
    return new Promise((resolve, reject) => {
        client.get(key, (err, result) => {
            if (err) {
                reject(err);
            }
            resolve(JSON.parse(result));
        });
    })
}

export function set(key, value, ttl = 86400) {
    return new Promise((resolve, reject) => {
        client.set(key, JSON.stringify(value), 'EX', ttl, (err, result) => {
            if (err) {
                reject(err);
            }
            console.log(`${key} size:${roughSizeOfObject(value)}`);
            resolve(result);
        });
    });
}