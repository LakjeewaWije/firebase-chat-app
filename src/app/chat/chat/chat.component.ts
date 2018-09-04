import { Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  // @ViewChild('abcdf') nameInputRef: ElementRef;
  // @ViewChild('bbbb') bbbb: ElementRef;
  items: AngularFireList<any[]>;
  sentmessage: string; //messages in db
  showMessages = []; //messages to show
  typedmessage: string;
  sentmessages = [];
  constructor(private db: AngularFireDatabase) {

  }

  ngOnInit() {
    this.items = this.db.list('/messages');
    let gg: any = {};
    this.items.snapshotChanges().subscribe(value => {
      console.log(value);
      value.forEach(i => {

        this.sentmessages.push(i.payload.val());
        setTimeout(function(){
          // console.log(' elemeenenenenene '+this.bbbb.nativeElement);
          // let elementRef = this.nameInputRef.nativeElement;
          // let element = this.nameInputRef.nativeElement;
          // element.scrollTop = element.scrollHeight;
          let messageList = document.getElementById('message_list');
          messageList.scrollTop = messageList.scrollHeight;
        },10);
        gg = i.payload.val();
        // console.log(' GGGGGG' + gg.message.message);
      });
    });




  }

  sendMessageUser() {
    let msg: any = {};
    msg.id = '123';

    console.log('send User message clicked');
    const itemsRef = this.db.list('/messages');
    if (this.sentmessage) {
      msg.message = this.sentmessage;
      // itemsRef.push().key;
      this.sentmessage = null;
      this.sentmessages.length = 0;
      msg = null;
    } else {
      alert('Please Type a text');
    }

  }
  sendMessageAdmin() {
    console.log('send Admin message clicked');
    let msg: any = {};
    msg.message = this.sentmessage;
    const itemsRef = this.db.list('/messages');
    itemsRef.push({ message: msg });
    this.sentmessage = null;
    this.sentmessages.length = 0;
  }

}
