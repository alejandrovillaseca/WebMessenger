import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../services/user.service';
import { User } from '../interfaces/user';

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

  constructor(private activatedRoute: ActivatedRoute,
    private userService: UserService) { 

    this.friendId = activatedRoute.snapshot.params["uid"]; //Consigo el parametro por URL
    /*this.friends = userService.getFriends()
    this.friend = this.friends.find(x => {
      return x.uid == this.friendId
    })*/
    this.userService.getUserById(this.friendId).valueChanges()
    .subscribe(
      (data : User) => {
        this.friend = data
        console.log(data)
      }, (error) => {
        console.log(error)
      }
    )

    console.log(this.friend)
  }

  ngOnInit() {
  }

}
