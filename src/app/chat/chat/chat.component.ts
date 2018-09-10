import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { RequestService } from '../../shared/requests/request.service';
// import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import * as firebase from 'firebase';
import { ScrollDirectiveDirective } from '../../scroll-directive.directive';
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  
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
  groupId: string;
  imageUrl: string;
  sender: string;
  tenantAuthToken : string;
  fireBaseAuthToken : string;
  constructor(private http: HttpClient,private _activatedRoute: ActivatedRoute, private _requestService: RequestService) {
    this._activatedRoute.queryParams.subscribe(this.getQueryParams.bind(this));
  }

  ngOnInit() {
    
    // console.log(btoa('%7B"groupId":null,"tenantAuthToken":"eyJhbGciOiJIUzUxMiJ9.eyJ0ZW5hbnROYW1lIjoiQUJDRCBUZW5hbnQiLCJ0ZW5hbnRJZCI6IjEwMzUxNjA2Nzc2MDc2OTg0MzIiLCJpc3MiOiJhdXRoMCIsInRpbWUiOjE1MzYxNTU5OTAsInR5cGUiOiJzYWxlcyJ9.6N3XVkAPGAMUlDzDLmgLdviindlE-Lo-O8IyfRK43vbF-qiyZLflCToYcNngoSGA-Wxlj9LwpGLkET-529OeAg","fireBaseAuthToken":"eyJhbGciOiJSUzI1NiJ9.eyJhdWQiOiJodHRwczovL2lkZW50aXR5dG9vbGtpdC5nb29nbGVhcGlzLmNvbS9nb29nbGUuaWRlbnRpdHkuaWRlbnRpdHl0b29sa2l0LnYxLklkZW50aXR5VG9vbGtpdCIsInN1YiI6ImZpcmViYXNlLWFkbWluc2RrLWs1MWgxQGVkdWxpbmtncmFkY2hhdC5pYW0uZ3NlcnZpY2VhY2NvdW50LmNvbSIsInVpZCI6Im51bGwiLCJpc3MiOiJmaXJlYmFzZS1hZG1pbnNkay1rNTFoMUBlZHVsaW5rZ3JhZGNoYXQuaWFtLmdzZXJ2aWNlYWNjb3VudC5jb20iLCJleHAiOjE1MzYzMjM4OTksImlhdCI6MTUzNjMyMDg5OX0.onojalouDw6t2ba4wx9WBbZ4cZ-voi6Yq8nuQzLhfKhEFjVLykZGF6qZLoBJMh1uCor17BHwxenq899douXdil9pHG0BBI5LftzOOYNKcUzH2Zj4cRVESowREKpn63V-vNQRFgiySr_aNSHCRsHBzETCs4DVOpVLE58WytDJyS9udwasYPwxNbFqc1DGElhVye7ulMA4Qp-bxxGSIALKoDJn_sGR2HKTsRoY77vyIXiEoEZEdpBg7t9E6L8gYDwrxCl4uScpg4FUTcxzo97vW2VzqFCYnM8pfaqQEtDi1YsYw7hAVA9h_IKjkD5mcx2I9AruH-K-cQlFu4PTMTdz_Q"%7D&sender=Sudheesan'));
    // firebase.auth().signInWithCustomToken(this.fireBaseAuthToken)
    // .then(
    //  function(token){
    //    console.log(token.user.uid);
    //    this.uid = token.user.uid;
    //  }
    // )
    // .catch(function(error) {
    //  // Handle Errors here.
    //  var errorCode = error.code;
    //  var errorMessage = error.message;
    //  console.log(error.message);
    //  // ...
    // });
    // this.uid = firebase.auth().currentUser.uid; // current user
    var starCountRef = firebase.database().ref('Message/1038033912568545280_sales').limitToLast(10); // reference
    starCountRef.once('value', (snapshot) => {
      console.log('lenth', snapshot.numChildren());
      this.sentmessages.length = 0;
      snapshot.forEach((entry) => {
        // console.log(snapshot.val());
        this.sentmessages.push(entry.val());
        console.log('once',this.sentmessages);
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
      userId: this.groupId,
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

  /**
   * Method to get  the cursor percentage when the scroll event trigers
   * @param value 
   */
  track(value: number): void {
    let messageList = document.getElementById('message_list');
    console.log('Message list height', messageList.scrollTop);
    this.firstMessageKey = this.sentmessages[0].objectId;
    console.log('First Message Key ' + this.firstMessageKey);
    this.percent = value;
    console.log('percentage', this.percent);

    if (this.percent === 0) {

      var starCountRef = firebase.database().ref('Message/1038033912568545280_sales').orderByKey().endAt(this.firstMessageKey).limitToLast(10);

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
          var theDiv = document.getElementById(this.tempArray[x].objectId).offsetHeight;
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

  /**
   * To catch the new  message added to firebase
   */
  onNewMessage() {
    
    var ccc = (snapshot) => {
        if (this.loadedOnce) {
          let messageList = document.getElementById('message_list');
          
            if (messageList.scrollTop + messageList.offsetHeight >= messageList.scrollHeight) {
            this.sentmessages.push(snapshot.val());
          
            console.log(snapshot.val());
            console.log('___________________________________________________________________');
            console.log('messageList.scrollTop',messageList.scrollTop);
            console.log('messageList.scrollHeight',messageList.scrollHeight);
            console.log('messageList.offsetHeight',messageList.offsetHeight);
            console.log('___________________________________________________________________');
            setTimeout(() => {
            var theDiv = document.getElementById(snapshot.val().objectId).offsetHeight;
            console.log(theDiv,'thidDiv');
            },40);
            setTimeout(() => {
              messageList.scrollTop = messageList.scrollHeight;
            },50);
            
          }else{
            this.sentmessages.push(snapshot.val());
            if(!snapshot.val().admin){
              setTimeout(() => {
                var theDiv = document.getElementById(snapshot.val().objectId).offsetHeight;
                console.log(theDiv,'thidDiv');
                },50);
                setTimeout(() => {
                  messageList.scrollTop = messageList.scrollHeight;
                },100);
            }else{
              alert('You have a new message From the Admin');
            }
            
          }
           
        } else {
          this.loadedOnce = true;
          console.log('First Time Loaded');
        }

    }
    var onNewMessage = firebase.database().ref('Message/1038033912568545280_sales').limitToLast(1);
    onNewMessage.on('child_added', ccc);
  }

  /**
   * To send a new message
   */
  sendAMessage() {
    const payload = {
      groupId: '1038033912568545280_sales',
      objectId: '',
      senderId: '1038033912568545280',
      senderImage: 'http://cdn.gradchat.co/gradchatPublicImages/default_profile_picture.jpg',
      senderName: this.sender,
      status: '',
      type: 'text',
      text: this.sentmessage
    };

    this._requestService.sendAMessage(payload).
    subscribe(this.sendMessageOnSuccess.bind(this), this.sendMessageOnError.bind(this));

  }

  /**
   * Successfull response of a sent message request
   * @param res 
   */
  sendMessageOnSuccess(res){
    console.log(res);

  }
  /**
   * Error response of a sent message
   * @param error 
   */
  sendMessageOnError(error){
    console.log(error);
  }

  /**
   * To read the query params
   * @param queryParams 
   */
  getQueryParams(queryParams) {
    let data;
    if(queryParams){
      console.log(queryParams);
      data = decodeURIComponent(atob(queryParams.token));
      console.log('Query params',JSON.parse(data));
      this.sender = queryParams.sender;
      this.fireBaseAuthToken = JSON.parse(data).fireBaseAuthToken;
      this.tenantAuthToken = JSON.parse(data).tenantAuthToken;
      this.groupId = JSON.parse(data).groupId;

      // console.log('sender',this.sender,'firebaseAuthToken',this.fireBaseAuthToken,'tenantToken',this.tenantAuthToken,'groupId',this.groupId);
    }else{
      console.log('no query params found');
    }
    
  }
  
}

