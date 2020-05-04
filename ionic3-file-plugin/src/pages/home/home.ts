import { Component } from '@angular/core';
import { File } from '@ionic-native/file';
import { NavController, Platform, Events } from 'ionic-angular';
import { Log } from '../../models/ConsoleLog';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  folderName: string;
  basePath: string;
  logs: Log[] = [];

  constructor(
    public navCtrl: NavController,
    public file: File,
    public p: Platform,
    public event: Events,
  ) {

    this.logs.push(new Log(`Base Path`, `basePath initialized with ${this.basePath}`))

    this.event.subscribe('basepath:set', () => {
      if (this.p.is('cordova')) {
        this.basePath = this.file.dataDirectory;
      } else {
        this.logs.push(new Log(`Base Path`, `Could not set base path. Not on Cordova device.`));
      }
    });
  }

  createFolder() {
    if (!this.p.is('cordova')) {
      alert(`You must run the app on a physical device to create folders.`);
      this.logs.push(new Log(`Error on createFolder()`, `Not on Cordova physical device.`));
      return;
    }

    if (this.basePath == null) {
      this.event.publish('basepath:set');
      this.logs.push(new Log(`Base Path`, `basePath was null. Try again.`));

    } else {
      this.file.checkDir(`${this.basePath}`, this.folderName)
        .then(res => {
          this.logs.push(new Log(`Checking Directory ${this.folderName}`, JSON.stringify(res)));
          alert(`Pasta ${this.folderName} já existe`);

        }).catch(err => {
          this.logs.push(new Log(`Error checking folder ${this.folderName}`, JSON.stringify(err)));
          alert(`Pasta ${this.folderName} não existe. Tentarei criá-la.`);

          this.file.createDir(`${this.basePath}`, this.folderName, true)
            .then(res => {
              alert(`Pasta ${this.folderName} created, enjoy.`);
              this.logs.push(new Log(`Created Directory ${this.folderName}`, JSON.stringify(res)));

            }).catch(err => {
              this.logs.push(new Log(`Error creating folder ${this.folderName}`, JSON.stringify(err)));
              alert(`Error creating folder ${this.folderName}: ${JSON.stringify(err)}`);
            });
        });
    }
  }
}
