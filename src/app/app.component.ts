import { AfterViewInit, Component } from '@angular/core';
import * as L from 'leaflet'
import { icon, Marker } from 'leaflet'
import { Modal } from 'bootstrap'
import { Case } from './CaseModel';
import { CaseServiceService } from './case-service.service';

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
  markerArray = new Map()
  cases: Case[] = []
  locations: any[] = []

  constructor(private caseService: CaseServiceService) {  }

  async ngAfterViewInit() {
    this.cases = await this.caseService.getCases()
    this.locations = await this.caseService.getLocations()
    this.map = L.map('mapid').setView([49.25, -123], 11);

    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZWV0YW4yMDAwIiwiYSI6ImNsYXlvcnk1djEyMTMzbm83dG1xNzQ1ZjQifQ.NzpqoZ-buer4m15Skp0Bnw', {
      maxZoom: 18,
      /*attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
        'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',*/
      id: 'mapbox/streets-v11',
      tileSize: 512,
      zoomOffset: -1 
    }).addTo(this.map);

    for(let i = 0; i < this.cases.length; i++) {
      var caseLocation = this.cases[i].getLocation()
      var id = this.cases[i].getID()
      var latitude
      var longitude
      var count
      for(let j = 0; j < this.locations.length; j++) {
        if(caseLocation === this.locations[j].location) {
          latitude = this.locations[j].latitude
          longitude = this.locations[j].longitude
          count = this.locations[j].count
        }
      }
      var marker = L.marker([latitude, longitude]).addTo(this.map)
      .bindPopup(`<b>${caseLocation}</b><br />${count} cases reported`)
  
      this.markerArray.set(id, marker)
    }
  }

  addMarker(event: any) {
      var marker = L.marker([event.latitude, event.longitude]).addTo(this.map)
      .bindPopup(`<b>${event.location}</b><br/>${event.count} pigs reported`)
      marker.openPopup()
      this.markerArray.set(event.pid, marker)
  }

  showMarker = (id: number): void => {
    this.markerArray.get(id).openPopup()
  }
}
