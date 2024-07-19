import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../env/environment';
import { Message } from '../model/message'
import { CreateEvent } from '../model/create-event';

@Injectable({
    providedIn: 'root'
  })
  export class EventService {
    
    constructor(private http: HttpClient) { }
  
    createEvent(event: CreateEvent): Observable<CreateEvent> {
        return this.http.post<CreateEvent>(
            environment.apiHost + 'v2/events',
            event
        );
    
    }
   
  }
