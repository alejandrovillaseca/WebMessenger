import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../services/user.service';
import { User } from '../interfaces/user';
import { ConversationService } from '../services/conversation.service';
import { AuthenticationService } from '../services/authentication.service';
import { timeout } from 'q';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.css']
})
export class ConversationComponent implements OnInit {

  friendId: any
  friend: User
  friends: User[]
  price: number = 78.2313818339213213
  today: any = Date.now()
  user: User
  idConversacion: string
  textMessage: string
  userId: string
  conversation: any[]
  shake: boolean = false

  constructor(private activatedRoute: ActivatedRoute,
    private userService: UserService, private conversationServices: ConversationService, private authServices: AuthenticationService) {

    this.friendId = activatedRoute.snapshot.params["uid"]; //Consigo el parametro por URL
    /*this.friends = userService.getFriends()
    this.friend = this.friends.find(x => {
      return x.uid == this.friendId
    })*/
    this.userService.getUserById(this.friendId).valueChanges()
      .subscribe(
        (data: User) => {
          this.friend = data
          console.log(data)
        }, (error) => {
          console.log(error)
        }
      )

    //Obtenemos los datos del usuario autenticado
    this.authServices.getStatus().subscribe(
      data => {
        this.userId = data.uid
        const array = [
          this.userId,
          this.friendId
        ].sort()
        this.idConversacion = array.join('|')
        this.getConversation()

        /*this.userService.getUserById(data.uid).valueChanges().subscribe(
          (data2 : User) => {
            this.user = data2
            //Ahora al amigo
            this.userService.getUserById(this.friend.uid).valueChanges().subscribe(
              (data3: User) => {
                this.friend = data3
                //Genero el famoso arreglo para concatenar y crear una id de la conversación
                const array = [
                  this.user.uid,
                  this.friend.uid
                ].sort()
                this.idConversacion = array.join('|')
              }, error => {
                console.log(error)
              }
            )
          }, error => {

          }
        )*/


      }, error => {
        console.log(error)
      }
    )


  }

  ngOnInit() {
  }

  sendMessage() {
    const message = {
      uid: this.idConversacion,
      timeStamp: Date.now(),
      text: this.textMessage,
      sender: this.userId,
      receiver: this.friendId,
      type: 'text'
    }
    this.conversationServices.createConversation(message)
    //para dejar en blanco el mensaje
    this.textMessage = ''
  }
  sendZumbido() {
    const message = {
      uid: this.idConversacion,
      timeStamp: Date.now(),
      text: null,
      sender: this.userId,
      receiver: this.friendId,
      type: 'zumbido'
    }
    //this.conversationServices.createConversation(message)
    //para dejar en blanco el mensaje
    this.textMessage = ''
  }
  doZumbido() {
    const audio = new Audio('assets/sound/zumbido.m4a')
    audio.play()
    this.shake = true
    window.setTimeout(
      data => {
        this.shake = false
      }, 1000
    )
  }
  getConversation() {
    this.conversationServices.getConversation(this.idConversacion).valueChanges().subscribe(
      data => {
        this.conversation = data
        this.conversation.forEach(
          message => {
            if (!message.seen) {
              message.seen = true
              this.conversationServices.editConversation(message)
              if (message.type == 'text') {
                const audio = new Audio('assets/sound/new_message.m4a')
                audio.play()
              }else if(message.type == 'zumbido') {
                this.doZumbido()
              }

            }
          }
        )
        console.log(data)
      }, error => {
        console.log(error)
      }
    )
  }
  getUserNickById(uid) {
    if (uid === this.friend.uid)
      return this.friend.nick
    else
      return this.user.nick
  }
}
