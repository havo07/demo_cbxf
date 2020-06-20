import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase/firebase.service';
import { ToastController, IonItemSliding, AlertController } from '@ionic/angular';

interface Estudiante {
  Nombre: string;
  Edad: number;
  Sexo: string;
  FechaNacimiento: string;
  Foto: string;
}

@Component({
  selector: 'app-estudiante',
  templateUrl: './estudiante.component.html',
  styleUrls: ['./estudiante.component.scss'],
})
export class EstudianteComponent implements OnInit {
  @ViewChild(IonItemSliding) slidingItem: IonItemSliding;
  @Input() estudiante: Estudiante;

  constructor(
    private firebaseService: FirebaseService,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController
    ) { }

  ngOnInit() {}

  isIos() {
    const win = window as any;
    return win && win.Ionic && win.Ionic.mode === 'ios';
  }

  async borrar(idKey) {
    const alert = await this.alertCtrl.create({
      header: 'Alerta',
      message: 'Desea borrar este registro',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => { }
        }, {
          text: 'Si',
          handler: () => {
            this.firebaseService.borrarEstudiante(idKey);
            this.creatToast('El estudiante fue borrado correctamente', 5);
          }
        }
      ]
    });

    await alert.present();
  }

  async creatToast(mensaje: string, duracionSegundos: number){
    const toas = await this.toastCtrl.create({
      message: mensaje,
      duration: duracionSegundos * 1000
    });
    toas.present();
  }

  close(){
    this.slidingItem.close();
  }
}
