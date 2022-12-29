import { AfterViewInit, Component } from '@angular/core';
import * as L from 'leaflet'
import { icon, Marker } from 'leaflet'
import { Modal } from 'bootstrap'

const iconRetinaUrl = 'assets/marker-icon-2x.png';
const iconUrl = 'assets/marker-icon.png';
const shadowUrl = 'assets/marker-shadow.png';
const iconDefault = icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
}); 
Marker.prototype.options.icon = iconDefault;

declare var bootstrap:any


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  title = 'COVID Tracker';
  private map: any;


  async ngAfterViewInit() {
    this.map = L.map('mapid').setView([49.25, -123], 11);
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZWV0YW4yMDAwIiwiYSI6ImNsYXlvcnk1djEyMTMzbm83dG1xNzQ1ZjQifQ.NzpqoZ-buer4m15Skp0Bnw', {
      maxZoom: 18,
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
        'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      id: 'mapbox/streets-v11',
      tileSize: 512,
      zoomOffset: -1 
    }).addTo(this.map);
  }
}
