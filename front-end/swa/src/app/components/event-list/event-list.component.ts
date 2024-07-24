import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'src/app/services/message.service';
import { Message } from 'src/app/model/message';
import { LoggedUser } from 'src/app/model/logged-user';
import { Subscription } from 'rxjs';
import { CreateEvent } from 'src/app/model/create-event';
import { EventService } from 'src/app/services/event.service';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css']
})
export class EventListComponent implements OnInit {
  events: CreateEvent[] = [];
  currentUser: LoggedUser;
  private subscriptions: Subscription[] = [];
  role? = 0;

  constructor( private authService : AuthService, private eventService : EventService) {
    this.currentUser = this.authService.getCurrentUser()
    this.loadEvents();
  }

  ngOnInit(): void {
  }

  loadEvents() {
    const subscription = this.eventService.getAllEvents().subscribe(
      (data) => {
        this.events = data;
        this.events = data.filter((item) => item.creator === this.currentUser.username);
      },
      (error) => {
        console.error('Error loading events:', error);
      }
    ); 
  
  }

  cancelEvent(){
    //For the core purpose of the research paper, the functionality will only be developed on the server
  }

  filterByDate(lowerBound: string, upperBound: string){
    //For the core purpose of the research paper, the functionality will only be developed on the server
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
  }

}
