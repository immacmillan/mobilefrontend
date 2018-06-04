import { Component,EventEmitter, Output, OnInit} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import * as moment from 'moment';
import { HabitPostService } from '../../services/habitpost.service';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { Platform } from 'ionic-angular';
import { stagger } from '@angular/animations/src/animation_metadata';
/**
 * Generated class for the ReminderComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'reminder',
  templateUrl: 'reminder.html'
})
export class ReminderComponent implements OnInit {
  @Output() goBack = new EventEmitter<any>();
  @Output() nextPage: EventEmitter<any> = new EventEmitter<any>();
  @Output() goToHabitLandingPage: EventEmitter<any> = new EventEmitter<any>();
  reminderTime: string;
  min: string;
  max: string;
  hasChanged: boolean = false;

  constructor(private habitPostService: HabitPostService, private platform: Platform, private notifications: LocalNotifications){}

  ngOnInit() {
    this.reminderTime = "08:00:00.000Z";

  }

  setReminderTime() {
    this.hasChanged = true;
    console.log(this.reminderTime + ":This is reminder time");
  }

  emitGoBack() {
    this.goBack.emit();
  }

  emitGoToHabitLandingPage() {

    let habit = {
      title: localStorage.getItem("basichabit"),
      startDate: localStorage.getItem("basicstartdate"),
      targetEnd: localStorage.getItem("basictargetdate"),  
      reminder: moment(this.reminderTime, "HH:mm:ss.SSSZ").toDate(),
      streakCounter: 0,
      habitCategory: localStorage.getItem('habitCategory'),
      activehabit: true,
    };
        
    this.habitPostService.habitpost(habit).subscribe(
      data => {

        var startDate = data.startDate;
        var reminder = data.reminder;
        var reminderHour = moment(reminder).get('hour');
        var reminderMinute = moment(reminder).get('minute');

        // Create notification here
        this.platform.ready().then(() => {
          console.log(data);

          var firstReminder = moment(startDate).set({'hour': reminderHour, 'minute': reminderMinute}).toDate();
          console.log(startDate + ": this is startDate");
          console.log(firstReminder + ": this is firstReminder");

          let notification = {
            id: data._id,
            title: 'Alert for ' + data.title,
            text: 'This is an alert for ' + data.title,
            firstAt: firstReminder,
            every: 'day'
          };
//Need to add logic in here that disable a daily reminder
          console.log(notification + ": notification");
          this.notifications.schedule(notification);
          
        });
      
        this.goToHabitLandingPage.emit();
      },
      error => {
        console.error(error);
      })

  }
}
