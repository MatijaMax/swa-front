import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'src/app/services/message.service';
import { Message } from 'src/app/model/message';
import { LoggedUser } from 'src/app/model/logged-user';
import { Subscription } from 'rxjs';
import { CreateEvent } from 'src/app/model/create-event';
import { EventService } from 'src/app/services/event.service';
import { UserEvent } from 'src/app/model/user-event';
import { UserEventService } from 'src/app/services/userEvent.service';

@Component({
  selector: 'app-join-event-list',
  templateUrl: './join-event-list.component.html',
  styleUrls: ['./join-event-list.component.css']
})
export class JoinEventListComponent implements OnInit {
  events: CreateEvent[] = [];
  currentUser: LoggedUser;
  errorDescription: string = ''
  private subscriptions: Subscription[] = [];
  role? = 0;

  constructor( private authService : AuthService, private eventService : EventService, private messageService : MessageService, private userEventService : UserEventService) {
    this.currentUser = authService.getCurrentUser();
    this.loadEvents();
  }

  ngOnInit(): void {
  }

  loadEvents() {
    const subscription = this.eventService.getAllEvents().subscribe(
      (data) => {
        //console.log(this.currentUser.username)
        //console.log(data[0].creator)
        this.events = data.filter((item) => item.creator != this.currentUser.username);
      },
      (error) => {
        console.error('Error loading events:', error);
      }
    ); 
  
  }

  joinEvent(event: CreateEvent){
    this.sendMessage(event.creator, event.name);
    this.createLink(event.id, this.currentUser.username || "");
  }

  filterByDate(lowerBound: string, upperBound: string){
    //For the core purpose of the research paper, the functionality will only be developed on the server
  }

  sendMessage(creator: string, eventName: string){
    this.errorDescription = ''
    const messageData: Message = {
      id: 0,
      content: this.currentUser.username + " joined your event " + eventName + ".",
      receiver: creator,
      read: false,
    }
    console.log(messageData)
    this.messageService.createMessage(messageData).subscribe({
      next: (result: any) => {
        console.log("MESSAGE SENT")
        console.log(result)
      },
      error: (err: any) => {
        if(err.status == 401){
          this.errorDescription = 'ERROR 401'
        }
      }
  })
  }

  createLink(eventId: number, joinerUsername: string){
    this.errorDescription = ''
    const messageData: UserEvent = {
      id: 0,
      idEvent: eventId,
      username: joinerUsername,
      
    }
    console.log(messageData)
    this.userEventService.createUserEvent(messageData).subscribe({
      next: (result: any) => {
        console.log("USER EVENT CREATED")
        console.log(result)
      },
      error: (err: any) => {
        if(err.status == 401){
          this.errorDescription = 'ERROR 401'
        }
      }
  })
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
  }

}
