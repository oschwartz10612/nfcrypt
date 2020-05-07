import { Component, ChangeDetectorRef } from '@angular/core';
import { NFC, Ndef } from '@ionic-native/nfc/ngx';
import { ToastController } from '@ionic/angular';
import { Observable, Subscription, Subject } from 'rxjs';
import * as CryptoJS from 'crypto-js'

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  writeState: Subject<boolean> = new Subject();
  writeListener: Observable<any>;
  writeSub: Subscription;

  constructor(private nfc: NFC, private ndef: Ndef, public toastController: ToastController, private cdRef:ChangeDetectorRef) {}

  ngOnInit() {
    this.writeState.next(false);
    this.writeState.subscribe((data) => {
      console.log(`The verible says: ${data}`);
    })

    // this.writeListener = this.nfc.addTagDiscoveredListener(() => {
    //   console.log('Successfully attached ndef listener');
    // }, (err) => {
    //   console.log(err);
    //   this.presentToast(`Error attaching ndef listener: ${err}`);
    // });
  }

  writeToTag(secretMsg) {
    var enc = CryptoJS.AES.encrypt(secretMsg, "Secret Passphrase").toString();
    //var payload = this.ndef.textRecord(enc);
    console.log(enc);
    try {
      var out = CryptoJS.AES.decrypt(enc, "Secret Passdphrase").toString(CryptoJS.enc.Utf8);
    } catch (error) {
      this.presentToast('Error decrypting tag');
    }
    if (out == null || out == '') {
      this.presentToast('Incorrect Passphrase');
    }
    
    console.log(out);

    //this.writeState.next(true);
    // this.writeSub = this.writeListener.subscribe(() => {
    //   this.nfc.write([payload]).then(() => {
    //     this.stopWrite();
    //     this.presentToast('Successfully wrote to tag')
    //   }, (err) => {
    //     this.presentToast(`Error writing to tag: ${err}`)
    //     console.log(err);
    //     this.stopWrite();
    //   })
    // });
  }

  stopWrite() {
    this.writeSub.unsubscribe();
    this.writeState.next(false);
    this.cdRef.detectChanges();
  }

  async presentToast(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }

}
