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
  scanningProximity: boolean = false;

  constructor(public navCtrl: NavController,
              private ble: BLE,
              private proxBle: BLE,
              private beaconService: BeaconService,
              private toastCtrl: ToastController) {
    this.getAllBeacons()
    this.scanProximity()
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

  removeBeacon(beacon: any) {
    this.beaconService.deleteBeacon(beacon)
      .then(() => {
        this.presentDeleteToast()
      })
  }

  refresh(refresher: any){
    this.isLoading = true;
    this.beaconService.getBeacons()
      .then((beacons: any []) => {
        this.beacons = beacons;
        this.isLoading = false;
        refresher.complete();
      })
      .catch(() => refresher.complete())
  }

  private getAllBeacons() {
    this.isLoading = true;
    this.beaconService.getBeacons()
      .then((beacons: any []) => {
        this.beacons = beacons;
        this.isLoading = false;
      })
  }

  private presentDeleteToast() {
    let toast = this.toastCtrl.create({
      message: 'Succesfully Deleted Beacon',
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

  private scanProximity() {
    this.scanningProximity = !this.scanningProximity;
    if(this.scanningProximity){
      let allIds: string[] = [];
      this.beacons.forEach((beacon) => {
        allIds.push(beacon.macAddress);
      })
      this.proxBle.startScanWithOptions(allIds, "reportDuplicates").subscribe(
        foundBeacon => this.calculateDistance(foundBeacon),
        (err) => console.error(err)
      )
    }
  }

  private calculateDistance(foundBeacon: any) {
    ß
  }
}
