import { Component, OnInit } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import { DateTime } from 'luxon';
import { Subscription } from 'rxjs';
import { AppComponent } from 'src/app/app.component';
import { AuthService } from 'src/app/services/auth.service';
import { Time } from '@angular/common';
import { DatePipe } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { LoggedUser } from 'src/app/model/logged-user';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
  providers: [DatePipe],
})
export class CalendarComponent implements OnInit {
  

  idFromUrl: number;

  dataSource: any;
  eventsList: any[] = [];
  currentUser: LoggedUser;
  subscription: Subscription;


  selectedDateTime: DateTime;

  todaysDate: String = DateTime.now().toISO();

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, timeGridPlugin],
    events: [],
    themeSystem: 'custom',
    eventClick: this.handleEventClick,
    headerToolbar: {
      left: 'prev,next today', 
      center: 'title', 
      right: 'timeGridWeek,dayGridMonth,dayGridYear', 
    },
  };
  ids: number[] = [];


  constructor(
    private authService: AuthService,
    public datePipe: DatePipe,
    private route: ActivatedRoute
  ) {
    this.currentUser = this.authService.getCurrentUser()
  }

  ngOnInit(): void {
    this.subscription = this.authService.currentUser.subscribe((user) => {
      this.todaysDate = this.todaysDate.split('T')[0];
      this.todaysDate += 'T00:00';
    });
    

    console.log(this.eventsList); 
    this.calendarOptions.events = this.eventsList;
  }
  handleEventClick(clickInfo: any): void {
    const eventTitle = clickInfo.event.title || 'No title';
    const eventDescription =
      clickInfo.event.extendedProps.description || 'No description';
    const eventId = clickInfo.event.extendedProps.id || 'No id';


  }

  loadParams(): void {
    this.route.params.subscribe((params) => {
      this.idFromUrl = parseInt(params['id'], 10);
      console.log(this.idFromUrl);
      console.log('ID FETCHED');
    });
  }
}