import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class ConversationService {

  constructor(private angularFireDatabase: AngularFireDatabase) { }

  createConversation(conversacion){
    return this.angularFireDatabase.object('conversations/' + conversacion.uid + '/' + conversacion.timeStamp).set(conversacion);
  }
  getConversation(uid){
    return this.angularFireDatabase.list('conversations/' + uid)
  }
  editConversation(conversacion){
    return this.angularFireDatabase.object('conversations/' + conversacion.uid + '/' + conversacion.timeStamp).set(conversacion);
  }
}
