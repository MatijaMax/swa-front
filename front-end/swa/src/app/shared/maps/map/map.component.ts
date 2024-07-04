import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import * as L from 'leaflet';
import { MapService } from './map.service';
import { LocationResponse } from '../model/location-response';
import { Observable, Observer, catchError, map, of, tap } from 'rxjs';
import { MAPBOX_API_KEY } from '../constants';
import { RouteResponse } from '../model/RouteResponse';
import { ElevationResponse } from '../model/elevation-response';

import { CheckpointPreview } from '../model/checkpoint-preview';

@Component({
  selector: 'xp-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})
export class MapComponent implements AfterViewInit {
  @Output() mapClick: EventEmitter<any> = new EventEmitter();
  @Input() initialCenter: [number, number] = [45.2396, 19.8227];
  @Input() initialZoom: number = 13;
  @Output() timeAndDistance: EventEmitter<any> = new EventEmitter<
    Observable<number>
  >();
  dist: number = 0;
  time: number = 0;
  profile: string = '';

  private map: any;

  constructor(private mapService: MapService) {}

  private initMap(): void {
    this.map = L.map('map', {
      center: this.initialCenter,
      zoom: this.initialZoom,
    });

    const tiles = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        maxZoom: 18,
        minZoom: 3,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }
    );
    tiles.addTo(this.map);
    this.registerOnClick();
  }

  search(street: string): Observable<LocationResponse> {
    this.map.eachLayer((layer: any) => {
      if (layer instanceof L.Marker) {
        this.map.removeLayer(layer);
      }
    });
    return this.mapService.search(street).pipe(
      map((result) => result[0]),
      tap((location) => {
        console.log('Location:', location);
        L.marker([location.lat, location.lon])
          .addTo(this.map)
          .bindPopup(location.display_name)
          .openPopup();
      }),
      catchError((error) => {
        console.error('Error in search:', error);
        throw error;
      })
    );
  }

  reverseSearch(lat: number, lon: number): Observable<LocationResponse> {
    this.map.eachLayer((layer: any) => {
      if (layer instanceof L.Marker) {
        this.map.removeLayer(layer);
      }
    });
    return this.mapService.reverseSearch(lat, lon).pipe(
      map((result) => result),
      tap((location) => {
        console.log('Location:', location);
        L.marker([location.lat, location.lon])
          .addTo(this.map)
          .bindPopup(location.display_name)
          .openPopup();
      }),
      catchError((error) => {
        console.error('Error in reverse search:', error);
        throw error;
      })
    );
  }

  reverseSearchCar(lat: number, lon: number): Observable<LocationResponse> {
    this.map.eachLayer((layer: any) => {
      if (layer instanceof L.Marker) {
        this.map.removeLayer(layer);
      }
    });
  
    return this.mapService.reverseSearch(lat, lon).pipe(
      map((result) => result),
      tap((location) => {
        const customIcon = L.icon({
          iconUrl: 'https://cdn-icons-png.flaticon.com/512/4736/4736213.png',
          iconSize: [32, 32],
          iconAnchor: [16, 16], 
        });
  
        L.marker([location.lat, location.lon], { icon: customIcon })
          .addTo(this.map)
          .bindPopup(location.display_name)
          .openPopup();
      }),
      catchError((error) => {
        console.error('Error in reverse search:', error);
        throw error;
      })
    );
  }

  reverseSearchA(lat: number, lon: number): Observable<LocationResponse> {
    this.map.eachLayer((layer: any) => {
      if (layer instanceof L.Marker) {
        this.map.removeLayer(layer);
      }
    });
  
    return this.mapService.reverseSearch(lat, lon).pipe(
      map((result) => result),
      tap((location) => {
        console.log('Location:', location);
  
        const customIcon = L.icon({
          iconUrl: 'https://cdn-icons-png.freepik.com/512/495/495468.png',
          iconSize: [32, 32],
          iconAnchor: [16, 16], 
        });
  
        L.marker([location.lat, location.lon], { icon: customIcon })
          .addTo(this.map)
          .bindPopup(location.display_name)
          .openPopup();
      }),
      catchError((error) => {
        console.error('Error in reverse search:', error);
        throw error;
      })
    );
  }

  reverseSearchB(lat: number, lon: number): Observable<LocationResponse> {
    this.map.eachLayer((layer: any) => {
      if (layer instanceof L.Marker) {
        this.map.removeLayer(layer);
      }
    });
  
    return this.mapService.reverseSearch(lat, lon).pipe(
      map((result) => result),
      tap((location) => {
        console.log('Location:', location);
  
        const customIcon = L.icon({
          iconUrl: 'https://cdn.iconscout.com/icon/free/png-256/free-finish-flag-5946228-4986608.png',
          iconSize: [32, 32],
          iconAnchor: [16, 16], 
        });
  
        L.marker([location.lat, location.lon], { icon: customIcon })
          .addTo(this.map)
          .bindPopup(location.display_name)
          .openPopup();
      }),
      catchError((error) => {
        console.error('Error in reverse search:', error);
        throw error;
      })
    );
  }


  getElevation(lat: number, lon: number): Observable<number> {
    return this.mapService.getElevation(lat, lon).pipe(
      map((response) => response.results[0].elevation),
      tap((elevation) => {
        console.log('Elevation:', elevation);
      }),
      catchError((error) => {
        console.error('Error in elevation fetch:', error);
        throw error;
      })
    );
  }

  registerOnClick(): void {
    this.map.on('click', (e: any) => {
      const coord = e.latlng;
      const lat = coord.lat;
      const lng = coord.lng;
      console.log(
        'You clicked the map at latitude: ' + lat + ' and longitude: ' + lng
      );
      this.mapClick.emit({ lat, lon: lng });
    });
  }

  ngAfterViewInit(): void {
    let DefaultIcon = L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.6.0/dist/images/marker-icon.png',
    });

    L.Marker.prototype.options.icon = DefaultIcon;
    this.initMap();
  }

  setCheckpoints(checkpoints: CheckpointPreview[]): void {
    let defaultIcon = L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.6.0/dist/images/marker-icon.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
    });

    console.log('Checkpoints set successfully.');
  }

  setCircle(center: { lat: number; lon: number }, radius: number): void {
    if (this.map) {
      this.map.eachLayer((layer: any) => {
        if (layer instanceof L.Circle) {
          this.map.removeLayer(layer);
        }
      });
      L.circle([center.lat, center.lon], { radius: radius }).addTo(this.map);
    }
  }

  reloadMap(): void {
    if (this.map) {
      this.map.remove();
    }
    this.ngAfterViewInit();
  }

  addPublicCheckpoints(
    coords: [
      { lat: number; lon: number; picture: string; name: string; desc: string }
    ]
  ): void {
    let defaultIcon = L.icon({
      iconUrl: 'https://cdn-icons-png.flaticon.com/512/7193/7193514.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
    });
    coords.forEach((element) => {
      L.marker([element.lat, element.lon], { icon: defaultIcon })
        .bindPopup(
          '<b>' +
            element.name +
            '</b><br>' +
            element.desc +
            "<br><img src='" +
            element.picture +
            "' width=70 height=50>"
        )
        .addTo(this.map)
        .openPopup();
    });
  }

  addCheckpoints(
    coords: [{ lat: number; lon: number; name: string; desc: string }]
  ): void {
    let defaultIcon = L.icon({
      iconUrl: 'https://cdn-icons-png.flaticon.com/512/6303/6303225.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
    });
    coords.forEach((element) => {
      L.marker([element.lat, element.lon], { icon: defaultIcon })
        .bindPopup('<b>' + element.name + '</b><br>' + element.desc)
        .addTo(this.map)
        .openPopup();
    });
  }

  addTouristPosition(lat: number, lon: number): Observable<LocationResponse> {
    return this.mapService.reverseSearch(lat, lon).pipe(
      map((result) => result),
      tap((location) => {
        console.log('Location:', location);
        L.marker([location.lat, location.lon])
          .addTo(this.map)
          .bindPopup(location.display_name)
          .openPopup();
      }),
      catchError((error) => {
        console.error('Error in reverse search:', error);
        throw error;
      })
    );
  }

  addMapObjects(
    coords: [
      { lat: number; lon: number; category: string; name: string; desc: string }
    ]
  ): void {
    let defaultIconWC = L.icon({
      iconUrl: 'https://cdn-icons-png.flaticon.com/512/1257/1257334.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
    });
    let defaultIconRestaurant = L.icon({
      iconUrl: 'https://cdn-icons-png.flaticon.com/512/3448/3448609.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
    });
    let defaultIconParking = L.icon({
      iconUrl: 'https://cdn-icons-png.flaticon.com/512/8/8206.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
    });
    let defaultIconOther = L.icon({
      iconUrl:
        'https://png.pngtree.com/png-vector/20190420/ourmid/pngtree-list-vector-icon-png-image_963980.jpg',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
    });
    coords.forEach((element) => {
      if (element.category == 'WC')
        L.marker([element.lat, element.lon], { icon: defaultIconWC })
          .bindPopup(
            '<b>' +
              element.name +
              '</b><br>' +
              element.category +
              '<br>' +
              element.desc
          )
          .openPopup()
          .addTo(this.map);
      if (element.category == 'Restaurant')
        L.marker([element.lat, element.lon], { icon: defaultIconRestaurant })
          .bindPopup(
            '<b>' +
              element.name +
              '</b><br>' +
              element.category +
              '<br>' +
              element.desc
          )
          .openPopup()
          .addTo(this.map);
      if (element.category == 'Parking')
        L.marker([element.lat, element.lon], { icon: defaultIconParking })
          .bindPopup(
            '<b>' +
              element.name +
              '</b><br>' +
              element.category +
              '<br>' +
              element.desc
          )
          .openPopup()
          .addTo(this.map);
      if (element.category == 'Other')
        L.marker([element.lat, element.lon], { icon: defaultIconOther })
          .bindPopup(
            '<b>' +
              element.name +
              '</b><br>' +
              element.category +
              '<br>' +
              element.desc
          )
          .openPopup()
          .addTo(this.map);
    });
  }
  drawMe(lat: number, lon: number) {
    let defaultIconOther = L.icon({
      iconUrl:
        'https://png.pngtree.com/png-vector/20190420/ourmid/pngtree-list-vector-icon-png-image_963980.jpg',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
    });
    L.marker([44.4, 45.5], { icon: defaultIconOther })
      .bindPopup(
        '<b>' +
          'sdwwww' +
          '</b><br>' +
          'element.category' +
          '<br>' +
          'element.desc'
      )
      .openPopup()
      .addTo(this.map);
    console.log('sd');
  }
}
