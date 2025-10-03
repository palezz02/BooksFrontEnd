import { Injectable } from '@angular/core';
import CryptoJS from 'crypto-js';
import { SALT_KEY } from '../../environments/pwd';

@Injectable({
  providedIn: 'root',
})
export class PasswordFunctions {
  private readonly saltKey = SALT_KEY;
  hashPassword(password: string): string {
    return CryptoJS.SHA256(password + this.saltKey).toString(CryptoJS.enc.Hex);
  }

  verifyPassword(password: string, hashed: string): boolean {
    const hashCheck = this.hashPassword(password);
    return hashCheck === hashed;
  }
}
