import {ec} from 'elliptic';

const EC = new ec('curve25519');

export const genKeyPair = () =>  EC.genKeyPair();

export { v4 as uuidv4 } from 'uuid';
