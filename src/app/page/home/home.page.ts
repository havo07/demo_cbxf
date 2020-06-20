import { Component } from '@angular/core';
import { FirebaseService } from '../../services/firebase/firebase.service';

interface Estudiante {
  Nombre: string;
  Edad: number;
  Sexo: string;
  FechaNacimiento: string;
  Foto: string;
}
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  estudianteLista = [];
  estudianteData: Estudiante;
  // studentForm: FormGroup;
  constructor(
    private firebaseService: FirebaseService
  ) {
    this.estudianteData = {} as Estudiante;
  }

  ngOnInit() {
    this.filtrado({detail:{value:''}});
  }

  filtrado(texto){
    const filtro = texto.detail.value.toUpperCase();
    this.firebaseService.obtenerEstudiantes().subscribe(data => {
      this.estudianteLista = data.map( e => {
        if( filtro !== ''){
          const nm = e.payload.doc.data()['Nombre'].toUpperCase();
          const sx = e.payload.doc.data()['Sexo'].toUpperCase();
          const ed = e.payload.doc.data()['Edad'].toString();
          if(nm.indexOf(filtro) > -1 || sx.indexOf(filtro) > -1 || ed.indexOf(filtro) > -1){
            return {
              id: e.payload.doc.id,
              isEdit: false,
              Nombre: e.payload.doc.data()['Nombre'],
              Edad: e.payload.doc.data()['Edad'],
              Sexo: e.payload.doc.data()['Sexo'],
              FechaNacimiento: e.payload.doc.data()['FechaNacimiento'],
              Foto: e.payload.doc.data()['Foto'],
            };
          } 
        } else {
          return {
            id: e.payload.doc.id,
            isEdit: false,
            Nombre: e.payload.doc.data()['Nombre'],
            Edad: e.payload.doc.data()['Edad'],
            Sexo: e.payload.doc.data()['Sexo'],
            FechaNacimiento: e.payload.doc.data()['FechaNacimiento'],
            Foto: e.payload.doc.data()['Foto'],
          };
        }
      });
    });
  }
  
}
