import { Component, OnInit } from '@angular/core';
import { User } from '../interfaces/user';
import { UserService } from '../services/user.service';
import { AuthenticationService } from '../services/authentication.service';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { FirebaseStorage } from '@angular/fire';
import { AngularFireStorage } from '@angular/fire/storage';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: User
  imageChangedEvent: any = ''
  croppedImage: any = ''
  picture: any

  constructor(private userService: UserService, private authService: AuthenticationService, private firebaseStorage: AngularFireStorage) {
    this.authService.getStatus().subscribe(
      status => {
        this.userService.getUserById(status.uid).valueChanges().subscribe(
          (data: User) => {
            this.user = data
            console.log(this.user)
          }, error => {
            console.log(error)
          }
        )
      }, error => {
        console.log(error)
      }
    )
  }

  ngOnInit() {
  }

  saveSettings() {
    if (this.croppedImage) {
      //Si existe cropperImage --> <img [src]="croppedImage"
      const currentPictureId = Date.now(); //Agregamos un id de fecha para que sea único, ya que 2 usuairos pueden subir distinta imagen con igual nombre
      const pictures = this.firebaseStorage.ref('pictures/' + currentPictureId + '.jpg').putString(this.croppedImage, 'data_url')
      pictures.then(
        result => {
          this.picture = this.firebaseStorage.ref('pictures/' + currentPictureId + '.jpg').getDownloadURL()
          this.picture.subscribe(
            data => {
              this.userService.setAvatar(data, this.user.uid).then(
                data2 => {
                  alert('Avatar subido corectamente')
                }, error => {
                  console.log(error)
                }
                
              ).catch(
                error => {
                  console.log(error)
                }
              )
            }
          )
        },
        error => {
          console.log(error)
        }
      ).catch(
        data => {
          console.log(data)
        }
      )
    } else {

    }

    this.userService.editUser(this.user).then(
      data => {
        alert('Cambios guardados')
      }
    ).catch(
      error => {
        alert('Hubo un error')
        console.log(error)
      }
    )
  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }
  imageLoaded() {
    // show cropper
  }
  loadImageFailed() {
    // show message
  }
}
