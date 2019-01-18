import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.css']
})
export class ConversationComponent implements OnInit {
  friendId: any
  constructor(private activatedRoute: ActivatedRoute) { 
    this.friendId = activatedRoute.snapshot.params["uid"]; //Consigo el parametro por URL
    console.log(this.friendId)
  }

  ngOnInit() {
  }

}
