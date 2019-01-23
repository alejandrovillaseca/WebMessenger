import { Component, OnInit } from '@angular/core';
import { User } from '../interfaces/user';
import { UserService } from '../services/user.service';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';
import { TestService } from '../services/test.service';
import { DataResponse } from '../interfaces/DataResponse';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RequestsService } from '../services/requests.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  friends: User[]
  query: string = ""
  dummy: DataResponse
  friendEmail = ''
  closeResult: string;
  user: User

  constructor(private userService: UserService, private authService: AuthenticationService
    , private router: Router, private dummyService: TestService, private modalService: NgbModal
    , private requestServices: RequestsService) {

    userService.getUsers().valueChanges()
      .subscribe(
        (data: User[]) => {
          this.friends = data
        }, (error) => {
          console.log(error)
        }
      )
    this.authService.getStatus().subscribe(
      status => {
        this.userService.getUserById(status.uid).valueChanges().subscribe(
          (data: User) => {
            this.user = data
          }
        )
      },
    )
  }

  ngOnInit() {
  }

  logOut() {
    this.authService.logOut()
      .then((data) => {
        alert('Sessión cerrada con éxito')
        this.router.navigate(['login'])
      }).catch((error) => {
        console.log(error)
      })

  }

  getDummy() {
    this.dummyService.getDummy().subscribe(
      data => {
        this.dummy = data
      }
    )
  }

  open(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {

    });
  }
  sendRequest() {
    const request = {
      timesTamp: Date.now(),
      recieverEmail: this.friendEmail,
      sender: this.user.uid,
      status: 'pending'
    }
    this.requestServices.createRequest(request).then(
      data => {
        alert('Solicitud enviada')
      }
    ).catch(
      error => {
        console.log(error);
      }
    )
  }
}
