import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
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
  loadedOnce: boolean = false;
  uid: string;
  token = 'eyJhbGciOiJSUzI1NiJ9.eyJhdWQiOiJodHRwczovL2lkZW50aXR5dG9vbGtpdC5nb29nbGVhcGlzLmNvbS9nb29nbGUuaWRlbnRpdHkuaWRlbnRpdHl0b29sa2l0LnYxLklkZW50aXR5VG9vbGtpdCIsInN1YiI6ImZpcmViYXNlLWFkbWluc2RrLWpqMnRxQHFhZ3JhZGNoYXQuaWFtLmdzZXJ2aWNlYWNjb3VudC5jb20iLCJ1aWQiOiIxMDM3OTQzMTg5OTcyMTU2NDE2IiwiaXNzIjoiZmlyZWJhc2UtYWRtaW5zZGstamoydHFAcWFncmFkY2hhdC5pYW0uZ3NlcnZpY2VhY2NvdW50LmNvbSIsImV4cCI6MTUzNjMwMjkxNSwiaWF0IjoxNTM2Mjk5OTE1fQ.bzpbLEqjikVXoydH4nIKrrHmYQaEpXt82nPWwR5hT2VeQrfWtcODBAYD1fsCWedcQ17HeSGad3C-Wf_VcnJukXXmsO2zOsSt8LhRtX2ArbHUJh8cw0KfwyLRmxt3yFpR7FtfNTjUeXft7jMf-lOksuWgCsuK08yTEwv_jf9jlH50lKl2h3H36SQSHwK3tNSCSQOBJr4XnuTNTP09Dsa4xFPINN-WUv9G77X2048wAR5Fx4rTs5VTYXXX9_Mr0gbpf-ac8oty20LgBGbPlqk5XxtZB7qvmHwyxD5cQg1uWlYV0uydSYlvOjRRCTcnbJOUs6U1Qv-7lk9npSGCGDFubw';
  constructor(private http: HttpClient,private _activatedRoute: ActivatedRoute) {
    this._activatedRoute.queryParams.subscribe(this.getQueryParams.bind(this));
  }

  ngOnInit() {

    // firebase.auth().signInWithCustomToken(this.token).catch(function(error) {
    //   // Handle Errors here.
    //   console.log('Error message',error.message)
      
    //   // ...
    // });
    // this.uid = firebase.auth().currentUser.uid; // current user
    // var starCountRef = firebase.database().ref(`messages/${this.uid}`).limitToLast(10); // reference
    // starCountRef.once('value', (snapshot) => {
    //   console.log('lenth', snapshot.numChildren());
    //   this.sentmessages.length = 0;
    //   snapshot.forEach((entry) => {
    //     console.log(snapshot.val());
    //     this.sentmessages.push(entry.val());
    //     setTimeout(function () {
    //       let messageList = document.getElementById('message_list');
    //       console.log('Scroll Top once', messageList.scrollTop);
    //       messageList.scrollTop = messageList.scrollHeight;
    //     }, 10);
    //   });
    // });
    // this.onNewMessage();
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

  // sendMessageAdmin() {
  //   this.key = firebase.database().ref('messages/').push().key;

  //   firebase.database().ref(`messages/${this.key}`).set({
  //     messageId: this.key,
  //     message: this.sentmessage,
  //     imageUrl: this.imageUrl
  //   });
  //   this.sentmessage = null;
  // }

  track(value: number): void {
    let messageList = document.getElementById('message_list');
    console.log('Message list height', messageList.scrollTop);
    this.firstMessageKey = this.sentmessages[0].messageId;
    console.log('First Message Key ' + this.firstMessageKey);
    this.percent = value;
    console.log('percentage', this.percent);

    if (this.percent === 0) {

      var starCountRef = firebase.database().ref(`messages/${this.uid}`).orderByKey().endAt(this.firstMessageKey).limitToLast(10);

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

  onNewMessage() {

    var ccc = (snapshot) => {
      setTimeout(() => {
        let messageList = document.getElementById('message_list');
        if (this.loadedOnce) {
          if (messageList.scrollTop + messageList.offsetHeight >= messageList.scrollHeight) {
            this.sentmessages.push(snapshot.val());
            setTimeout(() => {
              messageList.scrollTop = messageList.scrollHeight;
            }, 20);
          } else {
            if (snapshot.val().userId) {

            } else {
              alert('You have a new message');
            }
            this.sentmessages.push(snapshot.val());
          }
        } else {
          this.loadedOnce = true;
          console.log('First Time Loaded');
        }
      }, 10);

    }
    var onNewMessage = firebase.database().ref(`messages/${this.uid}`).limitToLast(1);
    onNewMessage.on('child_added', ccc);
  }

  sendAMessage() {

 const payload = {
      groupId: '1037943189972156416_sales',
      objectId: '',
      senderId: '1037943189972156416',
      senderImage: 'http://cdn.gradchat.co/gradchatPublicImages/default_profile_picture.jpg',
      senderName: 'namindu',
      status: '',
      type: 'text',
      text: this.sentmessage
    };
    console.log(payload);
    const headers = new HttpHeaders({
      "X-AUTH-TOKEN": "abc",
      "cache-control": "no-cache",
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    });

    this.http.post<any>('https://qa.api.gradchat.co/v2/message/anonymous', 
      payload
    , { headers: headers }).subscribe(function(res) {
      console.log(res);
      if (res.data != null) {
        console.log(res.data);
        this.sendAMessage = null;
      }
    },
      err => {
        console.log(err);

      }
    );
  }

  test(X) {
    if (typeof X === 'object') {
      return 'kashif';
    } else {
      return new Error('wrong type');
    }
  };
  getQueryParams(queryParams) {
    if(queryParams){
      console.log('Query params',queryParams);
    }else{
      console.log('no query params found');
    }
    
  }
  
}

