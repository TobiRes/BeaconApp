import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";

@Injectable()
export class BeaconService {

  private baseURL = "http://10.200.20.48:8080/beacon";
  constructor(private http: HttpClient) {
  }

  registerBeacon(beaconData) {
    return new Promise(resolve => {
      let body = {
        macAddress: beaconData.macAddress,
        name: beaconData.name
      }
      console.log(body)
      this.http.post(this.baseURL, body)
        .subscribe(() => resolve())
    })
  }

  getBeaconToRegister(beaconValues: any[]) {
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
    console.log(beacon)
    return new Promise((resolve, reject) => {
      this.http.delete(this.baseURL + "/" + beacon.macAddress)
        .subscribe(() => resolve(),
          () => reject())
    })
  }
}
