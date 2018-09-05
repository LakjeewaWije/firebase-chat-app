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
  // @ViewChild('abcdf') nameInputRef: ElementRef;
  // @ViewChild('bbbb') bbbb: ElementRef;
  // items: AngularFireList<any[]>;
  userId: string = '2016288';
  imageUrl: string = 'layers.png';
  percent: number = 0;
  sentmessage: string; //typed in db
  sentmessages = [];
  tempArray = [];
  key: string;
lastMessageKey: string;
  constructor() {
  }

  ngOnInit() {
    var starCountRef = firebase.database().ref('messages/').limitToLast(10);

    starCountRef.once('value', (snapshot) => {
      console.log('lenth', snapshot.numChildren());
      this.sentmessages.length =0;
      snapshot.forEach((entry) => {
        this.sentmessages.push(entry.val());
        this.lastMessageKey = this.sentmessages[0].messageId;
        console.log('This first meesage '+this.lastMessageKey);
        setTimeout(function(){
        let messageList = document.getElementById('message_list');
        messageList.scrollTop = messageList.scrollHeight;
        
      }, 10);
      });
    });

    
      var ccc = (snapshot) => {
        console.log(snapshot.val());
        this.sentmessages.push(snapshot.val());
        this.lastMessageKey = this.sentmessages[0].messageId;
        console.log('This first meesage '+this.lastMessageKey);
        setTimeout(function(){
          let messageList = document.getElementById('message_list');
          messageList.scrollTop = messageList.scrollHeight;
        }, 10);
      }
      var onNewMessage = firebase.database().ref('messages/');
      onNewMessage.on('child_added', ccc);

    
    
  }



  sendMessageUser() {
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
    this.percent = value;
    console.log('percentage',this.percent);
    if(this.percent<20){
      var starCountRef = firebase.database().ref('messages/').orderByChild('createdAt').endAt(this.lastMessageKey).limitToLast(10);

      starCountRef.once('value', (snapshot) => {
        console.log('lenth', snapshot.numChildren());
        this.sentmessages.length =0;
        snapshot.forEach((entry) => {
          this.tempArray.push(entry.val());
          setTimeout(function(){
          this.tempArray.pop();
          this.sentmessages.concat(this.sentmessages);
        }, 500);
        });
      });
    }
}

}