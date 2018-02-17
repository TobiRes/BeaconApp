import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Injectable()
export class BeaconService {

  private baseURL = "http://10.200.18.137:8080/beacon";
  constructor(private http: HttpClient) {
  }

  registerBeacon(beaconValues) {
    return new Promise(resolve => {
      let beaconData = this.getBeaconToRegister(beaconValues);
      let body = {
        macAddress: beaconData.macAddress,
        name: beaconData.name
      }
      this.http.post(this.baseURL, body)
        .subscribe(() => resolve())
    })
  }

  private getBeaconToRegister(beaconValues: any[]) {
    let currentBeacon = {
      name: "test",
      macAddress: "test",
      rssi: -1000
    };
    beaconValues.forEach(beacon => {
      if (currentBeacon.name == "test") {
        currentBeacon.name = "beacon";
        currentBeacon.macAddress = beacon.id;
        currentBeacon.rssi = beacon.rssi;
      }
      else if (beacon.rssi > currentBeacon.rssi) {
        currentBeacon.macAddress = beacon.id;
        currentBeacon.rssi = beacon.rssi;
      }
    })
    return currentBeacon;
  }

  getBeacons() {
    return new Promise((resolve => {
      this.http.get(this.baseURL)
        .subscribe((beacons: any[]) => {
          resolve(beacons)
        })
    }))
  }

  deleteBeacon(beacon: any) {
    return new Promise(resolve => {
      this.http.delete(this.baseURL, beacon)
        .subscribe(() => resolve())
    })
  }
}
