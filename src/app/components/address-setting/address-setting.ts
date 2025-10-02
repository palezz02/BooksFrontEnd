import { Component, Inject, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AddressServiceService } from '../../services/address-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../../services/user-service';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from '../../auth/authService';

@Component({
  selector: 'app-address-setting',
  standalone: false,
  templateUrl: './address-setting.html',
  styleUrl: './address-setting.css',
})
export class AddressSetting implements OnInit {
  private _snackBar = inject(MatSnackBar);

  addressForm: FormGroup;
  address = {
    id: 0,
    city: '',
    country: '',
    region: '',
    street: '',
    cap: '',
    user: 0,
  };

  constructor(
    private fb: FormBuilder,
    private addressService: AddressServiceService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private userService: UserService,
    private auth: AuthService
  ) {
    this.addressForm = this.fb.group({
      city: ['', [Validators.required, Validators.minLength(2)]],
      country: ['', [Validators.required, Validators.minLength(2)]],
      region: ['', [Validators.required, Validators.minLength(2)]],
      street: ['', [Validators.required, Validators.minLength(3)]],
      cap: ['', Validators.required],
    });
  }

  ngOnInit() {
    // Carica l'indirizzo esistente se necessario
    if (isPlatformBrowser(this.platformId)) {
      let userId = this.auth.getUserId();
      this.userService.getById(userId).subscribe((res) => {
        if (res.rc) {
          const user = res.dati;
          // Controllo aggiuntivo su user.address
          let addressId = null;
          if (user.addresses && Array.isArray(user.addresses) && user.addresses.length > 0) {
            addressId = user.addresses[0];
          }
          if (addressId != 0 && addressId != null && addressId != undefined) {
            this.addressService.getById(addressId).subscribe((res) => {
              if (res.rc) {
                const address = res.dati;
                this.address = {
                  id: Number(address.id),
                  city: address.city,
                  country: address.country,
                  region: address.region,
                  street: address.street,
                  cap: address.cap,
                  user: 0,
                };
                this.addressForm.patchValue({
                  city: address.city,
                  country: address.country,
                  region: address.region,
                  street: address.street,
                  cap: address.cap,
                  user: 0,
                });
              }
            });
          }
        }
      });
    }
  }

  onAddressSubmit() {
    if (this.addressForm.valid) {
      this.address.user = this.auth.getUserId();

      this.addressForm.value.id = this.address.id;
      this.addressForm.value.user = this.address.user;
      if (this.address.id === 0) {
        console.log(this.addressForm.value);
        this.addressService.insertAddress(this.addressForm.value).subscribe(
          (res) => {
            console.log(res);
            this._snackBar.open('Indirizzo creato con successo!', 'Chiudi', { duration: 3000 });
          },
          (err) => {
            this._snackBar.open("Errore durante la creazione dell'indirizzo.", 'Chiudi', {
              duration: 3000,
            });
          }
        );
      } else {
        this.addressService.updateAddress(this.addressForm.value).subscribe(
          (res) => {
            console.log(res);
            this._snackBar.open('Indirizzo aggiornato con successo!', 'Chiudi', { duration: 3000 });
          },
          (err) => {
            this._snackBar.open("Errore nell'aggiornamento dell'indirizzo!", 'Chiudi', {
              duration: 3000,
            });
          }
        );
      }
    } else {
      this._snackBar.open('Compila tutti i campi correttamente.', 'Chiudi', { duration: 3000 });
    }
  }
}
