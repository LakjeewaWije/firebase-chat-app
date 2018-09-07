import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
// import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import * as firebase from 'firebase';
import { ScrollDirectiveDirective } from '../../scroll-directive.directive';
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  userId: string = '2016288';
  imageUrl: string = 'layers.png';
  percent: number = 0;
  sentmessage: string; //typed in db
  sentmessages = [];
  tempArray = [];
  key: string;
  firstMessageKey: string;
  checkIfFirstMessage: string;
  divHeight: number = 0;
  scrollHeightToAlertUser: number;
  loadedOnce:boolean = false;
  constructor() {
  }

  ngOnInit() {
    var starCountRef = firebase.database().ref('messages/').limitToLast(10);

    starCountRef.once('value', (snapshot) => {
      console.log('lenth', snapshot.numChildren());
      this.sentmessages.length = 0;
      snapshot.forEach((entry) => {
        this.sentmessages.push(entry.val());
        setTimeout(function () {
          let messageList = document.getElementById('message_list');
          console.log('Scroll Top once', messageList.scrollTop);
          messageList.scrollTop = messageList.scrollHeight;

        }, 10);
      });
    });
      this.onNewMessage();
  }



  sendMessageUser() {
    console.log(this.sentmessages);
    this.key = firebase.database().ref('messages/').push().key;
    firebase.database().ref(`messages/${this.key}`).set({
      userId: this.userId,
      messageId: this.key,
      message: this.sentmessage,
      imageUrl: this.imageUrl
    });
    this.sentmessage = null;
  }

  sendMessageAdmin() {
    this.key = firebase.database().ref('messages/').push().key;

    firebase.database().ref(`messages/${this.key}`).set({
      messageId: this.key,
      message: this.sentmessage,
      imageUrl: this.imageUrl
    });
    this.sentmessage = null;
  }

  track(value: number): void {
    let messageList = document.getElementById('message_list');
    console.log('Message list height',messageList.scrollTop);
    this.firstMessageKey = this.sentmessages[0].messageId;
    console.log('First Message Key ' + this.firstMessageKey);
    this.percent = value;
    console.log('percentage', this.percent);
    
    if (this.percent === 0) {

      var starCountRef = firebase.database().ref('messages/').orderByKey().endAt(this.firstMessageKey).limitToLast(10);

      starCountRef.on('value', (snapshot) => {
        snapshot.forEach((entry) => {
          this.tempArray.push(entry.val());
        });
      });
      setTimeout(() => {
        this.tempArray.pop();
        this.sentmessages = this.tempArray.concat(this.sentmessages);
        this.firstMessageKey = null;
        console.log('new message array', this.sentmessages);
      }, 1000);

      setTimeout(() => {
        for (var x = 0; x < this.tempArray.length; x++) {
          var theDiv = document.getElementById(this.tempArray[x].messageId).offsetHeight;
          this.divHeight += theDiv;
          console.log('Div heaight', this.divHeight);
          let messageList = document.getElementById('message_list');
          messageList.scrollTop = this.divHeight;
        }
        this.divHeight = 0;
        this.tempArray.length = 0;
      }, 1000);
    }
  }

  onNewMessage(){
    
    var ccc = (snapshot) => {
      setTimeout(() =>{
          let messageList = document.getElementById('message_list');
          if(this.loadedOnce){
            if (messageList.scrollTop+messageList.offsetHeight>=messageList.scrollHeight){
              this.sentmessages.push(snapshot.val());
              setTimeout(()=>{
                messageList.scrollTop = messageList.scrollHeight;
              },20);
            }else{
              if (snapshot.val().userId){

              }else{
                alert('You have a new message');
              }
              this.sentmessages.push(snapshot.val());
            }
          }else{
            this.loadedOnce = true;
            console.log('First Time Loaded');
          }
      }, 10);   
 
  }
  var onNewMessage = firebase.database().ref('messages/').limitToLast(1);
  onNewMessage.on('child_added', ccc);
  }
}