import { Component, OnInit } from '@angular/core';
import { LoadingService } from './loading/loading.service';
import { MessagesService } from './messages/messages.service';
import { AuthStore } from './services/auth.store';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
  // we add de provider to the root of our application to access this service wherever we want and emit the loader
  // observable variable in the project
  // providers: [
  //  LoadingService,
  //  MessagesService]
})
export class AppComponent implements OnInit {

  constructor(public authStore: AuthStore) {

  }

  ngOnInit() {


  }

  logout() {

    this.authStore.logout();

  }

}
