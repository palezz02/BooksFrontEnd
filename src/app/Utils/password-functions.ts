import { Injectable } from '@angular/core';
import CryptoJS from 'crypto-js';
import { SALT_KEY } from '../environments/pwd';

@Injectable({
  providedIn: 'root',
})
export class PasswordFunctions {
  private readonly saltKey = SALT_KEY;
  // Crea hash SHA-256 con saltKey
  hashPassword(password: string): string {
    return CryptoJS.SHA256(password + this.saltKey).toString(CryptoJS.enc.Hex);
  }

  // Verifica ricreando lo stesso hash
  verifyPassword(password: string, hashed: string): boolean {
    const hashCheck = this.hashPassword(password);
    return hashCheck === hashed;
  }
}
