import { Component } from '@angular/core';
import {NavController, ToastController} from 'ionic-angular';
import {BLE} from "@ionic-native/ble";
import {BeaconService} from "../../services/beacon.service";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  beacons: any[] = []
  isLoading: boolean = false;
  secondLoading: boolean = false;

  constructor(public navCtrl: NavController,
              private ble: BLE,
              private beaconService: BeaconService,
              private toastCtrl: ToastController) {
    this.getAllBeacons()
  }

  scanBeacon(){
    this.secondLoading = true;
    let allBeacons = [];
     this.ble.scan([], 5).subscribe(
       foundBeacon => allBeacons.push(foundBeacon),
       () => this.secondLoading = false
         )
     setTimeout(() => {
       this.ble.stopScan().then( () => {
         this.secondLoading = false;
         this.beaconService.registerBeacon(allBeacons)
           .then(() => {
             this.secondLoading = false;
             this.getAllBeacons()
           })
           .catch(() => this.secondLoading = false)
       })
     }, 7000);
  }

  private getAllBeacons() {
    this.isLoading = true;
    this.beaconService.getBeacons()
      .then((beacons: any []) => {
        this.beacons = beacons;
        this.isLoading = false;
      })
  }

  removeBeacon(beacon: any) {
    this.beaconService.deleteBeacon(beacon)
      .then(() => {
        this.presentToast()
      })
  }

  private presentToast() {
    let toast = this.toastCtrl.create({
      message: 'Succesfully Deleted Beacon',
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }
}
