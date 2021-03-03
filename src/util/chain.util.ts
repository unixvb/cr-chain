import {ec} from 'elliptic';

const EC = new ec('curve25519');

export const genKeyPair = () =>  EC.genKeyPair();

