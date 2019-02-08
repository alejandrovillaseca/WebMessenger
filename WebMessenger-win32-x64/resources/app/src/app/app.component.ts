import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from './services/authentication.service';
import { UserService } from './services/user.service';
import { RequestsService } from './services/requests.service';
import { User } from 'firebase';
import { DialogService } from 'ng2-bootstrap-modal';
import { RequestComponent } from './modals/request/request.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Platzinger';
  user: User;
  request: any[] = []
  mailShown: any[] = []
  amigo: User

  constructor(public router: Router, private authService: AuthenticationService, 
    private userService: UserService, private requestService: RequestsService,
    private dialogService: DialogService) {
    this.authService.getStatus().subscribe(
      (data) => {
        if(data){
          this.userService.getUserById(data.uid).valueChanges().subscribe(
            (data: User) => {
              this.user = data
              this.requestService.getRequestsForEmail(this.user.email).valueChanges().subscribe(
                (data: any) => {
                  this.request = data
                  this.request = this.request.filter(
                    req => {
                      return req.status !== 'accepted' && req.status !== 'rejected'
                    }
                  )
                  this.request.forEach(
                    (req) => {
                      if(this.mailShown.indexOf(req.sender) === -1){
                        this.mailShown.push(req.sender)
                        this.dialogService.addDialog(RequestComponent, {scope: this, currentRequest: req});
                        this.userService.getUserById(req.sender).valueChanges().subscribe(
                          (data: User) => {
                            this.amigo = data
                          }
                        )
                      }
                    }
                  )
                }, error => {
                  console.log(error);
                }
              )
            }
          )
        }
        
      }
    )

  }
}
