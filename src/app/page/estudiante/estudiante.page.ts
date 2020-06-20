import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FirebaseService } from 'src/app/services/firebase/firebase.service';
import { Location } from '@angular/common';
import { ToastController, LoadingController, PickerController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { Camera, CameraOptions } from "@ionic-native/camera/ngx";

interface Estudiante {
  Nombre: string;
  Edad: number;
  Sexo: string;
  FechaNacimiento: string;
  Foto: string;
}

@Component({
  selector: 'app-estudiante',
  templateUrl: './estudiante.page.html',
  styleUrls: ['./estudiante.page.scss'],
})
export class EstudiantePage implements OnInit {
  estudianteData: Estudiante;
  estudianteForm: FormGroup;
  idKey: string;
  fotoEstudiante: string;
  urlfotoEstudiante: string;
  constructor(
    private camera: Camera,
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private firebaseService: FirebaseService,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public pickerController: PickerController,
    public fb: FormBuilder) {
    this.idKey = this.activatedRoute.snapshot.paramMap.get('idKey');
    this.estudianteData = {} as Estudiante;
    this.fotoEstudiante = 'assets/imgs/camara.png';
    this.urlfotoEstudiante = 'assets/imgs/camara.png';
  }

  async ngOnInit() {
    this.estudianteForm = this.fb.group({
      Nombre: ['', [Validators.required]],
      Edad: ['', [Validators.required]],
      Sexo: ['', [Validators.required]],
      FechaNacimiento: ['', [Validators.required]]
    });

    if (this.idKey !== 'new') {
      const loading = await this.loadingCtrl.create({
        message: 'Cargando informacion'
      });
      this.firebaseService.obtenerEstudiante(this.idKey).subscribe(async data => {
        loading.present();
        this.estudianteData = {
          Nombre: data.payload.data()['Nombre'],
          Edad: data.payload.data()['Edad'],
          Sexo: data.payload.data()['Sexo'],
          FechaNacimiento: data.payload.data()['FechaNacimiento'],
          Foto: data.payload.data()['Foto']
        };
        this.fotoEstudiante = data.payload.data()['Foto'];
        if (this.fotoEstudiante !== undefined && this.fotoEstudiante !== '')
          this.urlfotoEstudiante = await this.firebaseService.obtenerImagen(this.fotoEstudiante);
        else {
          this.fotoEstudiante = '';
          this.urlfotoEstudiante = 'assets/imgs/camara.png';
        }
        loading.dismiss();
      });
    }
  }

  actualizarRegistro() {
    const data = this.estudianteForm.value;
    this.estudianteData = {
      Nombre: data.Nombre,
      Edad: data.Edad,
      Sexo: data.Sexo,
      FechaNacimiento: data.FechaNacimiento,
      Foto: this.fotoEstudiante
    }
    this.firebaseService.actulizarEstudiante(this.idKey, this.estudianteData).then(resp => {
      this.creatToast('El registro fue actualizado correctamente', 5);
      this.estudianteForm.reset();
      this.location.back();
    }).catch(error => {
      this.creatToast('El registro no fue actualizado', 5);
    });
  }

  crearRegistro() {
    const data = this.estudianteForm.value;
    this.estudianteData = {
      Nombre: data.Nombre,
      Edad: data.Edad,
      Sexo: data.Sexo,
      FechaNacimiento: data.FechaNacimiento,
      Foto: this.fotoEstudiante
    }
    this.firebaseService.crearEstudiante(this.estudianteData).then(resp => {
      this.creatToast('El registro fue creado correctamente', 5);
      this.estudianteForm.reset();
      this.location.back();
    }).catch(error => {
      console.log(error);
      this.creatToast('El registro no fue creado', 5);
    });
  }

  evento() { }

  tomarImagen(event) {
    let options: CameraOptions = {
      quality: 80,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG
    };
    this.camera.getPicture(options).then(async image => {
      const loading = await this.loadingCtrl.create({
        message: 'Cargando imagen'
      });
      loading.present();
      let blobInfo = await this.firebaseService.convertiraBlob(image);
      let uploadInfo: any = await this.firebaseService.subirImagen(blobInfo);
      this.fotoEstudiante = uploadInfo;
      this.urlfotoEstudiante = await this.firebaseService.obtenerImagen(this.fotoEstudiante);
      loading.dismiss();
    });
  }

  async creatToast(mensaje: string, duracionSegundos: number) {
    const toas = await this.toastCtrl.create({
      message: mensaje,
      duration: duracionSegundos * 1000
    });
    toas.present();
  }

  getBackButtonText() {
    const win = window as any;
    const mode = win && win.Ionic && win.Ionic.mode;
    return mode === 'ios' ? '' : '';
  }

  keyUpChecker(ev) {
    let elementChecker: string;
    let format = /[ !~@#$%^&*()_+×÷°={N}{};’:"|,.1234567890<>/?]/;
    elementChecker = ev.target.value;
    if (format.test(elementChecker)) {
      this.estudianteData.Nombre = elementChecker.slice(0, -1);
    }
  }

}
