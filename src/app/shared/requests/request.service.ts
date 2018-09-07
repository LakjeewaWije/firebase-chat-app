import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class RequestService {

  constructor(private http: HttpClient) { }

  sendAMessage(payload){
    
    const headers = new HttpHeaders({
      "X-AUTH-TOKEN": "abc",
      "cache-control": "no-cache",
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    });

    return this.http.post('https://qa.api.gradchat.co/v2/message/anonymous', payload,{headers: headers});
  }



}
