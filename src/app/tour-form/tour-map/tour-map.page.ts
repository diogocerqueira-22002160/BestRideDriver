import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Map, tileLayer, marker } from 'leaflet';
import { TourServiceService } from '../tour-service.service';
import { Address } from './AddressMarker';

@Component({
  selector: 'app-tour-map',
  templateUrl: './tour-map.page.html',
  styleUrls: ['./tour-map.page.scss'],
})
export class TourMapPage implements OnInit {
  interestForm: FormGroup;
  submited = false;
  private map: Map;
  private newMarker: any;
  public address: Address;
  public searchValue: string;
  public ListSuggestions: Array<string> = [];

  constructor(
    private formBuilder: FormBuilder,
    private service: TourServiceService,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {
    this.interestForm = this.formBuilder.group({
      name: ['', Validators.required],
    });
  }

  ionViewDidEnter() {
    this.loadMap();
  }

  loadMap() {
    this.map = new Map('map').setView([38.72847, -9.13823], 13);

    tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
      maxZoom: 18,
      id: 'mapbox/streets-v11',
      tileSize: 512,
      zoomOffset: -1,
      attribution: 'BestRide.com',
    }).addTo(this.map);

    this.map.on('click', (e) => {
      if (this.newMarker != null) {
        this.map.removeLayer(this.newMarker);
      }
      this.onMapClick(e);
    });
  }

  onMapClick(e) {
    this.newMarker = marker([e.latlng.lat, e.latlng.lng]).addTo(this.map);
    const coords = {
      lat: e.latlng.lat,
      lng: e.latlng.lng,
    };
    this.service.get_address(coords).subscribe((res) => {
      this.address = res;
    });
  }

  public submitForm() {
    this.submited = true;
    if (!this.interestForm.valid) {
      console.log('Please provide all the required values!');
      return false;
    } else {
      console.log(this.interestForm.value);
      this.modalCtrl.dismiss({
        name: this.interestForm.get('name').value,
        address: this.address['address']['Address'],
      });
    }
  }
  public get errorControl() {
    return this.interestForm.controls;
  }

  updateSearch(event: any) {
    this.ListSuggestions = [];
    const place = event['detail'].value;
    this.service.get_suggestions(place).subscribe(
      (res) => {
        for (let r of res['suggestions']) {
          this.ListSuggestions.push(r.text);
        }
      },
      (err) => {
        //console.log(err);
      }
    );
  }

  public itemClick(name: any) {
    console.log(name);
    this.service.get_suggestions_coords(name).subscribe(
      (res) => {
        console.log(res['candidates'][0]['location']);
        if (this.newMarker != null) {
          this.map.removeLayer(this.newMarker);
        }
        this.newMarker = marker([
          res['candidates'][0]['location'].y,
          res['candidates'][0]['location'].x,
        ]).addTo(this.map);

        this.map.setView(
          [
            res['candidates'][0]['location'].y,
            res['candidates'][0]['location'].x,
          ],
          15
        );
        this.ListSuggestions = [];
      },
      (err) => {
        console.log(err);
      }
    );
  }
}