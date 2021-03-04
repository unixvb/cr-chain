import {ec} from 'elliptic';
import {SHA256} from "crypto-js";

export {v4 as uuidv4} from 'uuid';

// TODO: figure out how to migrate to curve25519
// http://safecurves.cr.yp.to/
const EC = new ec('secp256k1');

export const generateKeyPair = () => EC.genKeyPair();

export const generateHash = (data: any) => SHA256(JSON.stringify(data)).toString();

export const verifySignature = (publicKey: string, signature: ec.Signature, dataHash: string) =>
        EC.keyFromPublic(publicKey, 'hex').verify(dataHash, signature);
