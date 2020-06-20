import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFirestore } from '@angular/fire/firestore';
import { File } from "@ionic-native/file/ngx";
import * as firebase from "firebase";

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  collectionName = 'Estudiantes';

  constructor(
    private afs: AngularFirestore,
    private storage: AngularFireStorage,
    private file: File
    ) { }

  crearEstudiante(data){
    return this.afs.collection(this.collectionName).add(data);
  }

  obtenerEstudiante(idKey){
    return this.afs.collection(this.collectionName).doc(idKey).snapshotChanges();
  }

  obtenerEstudiantes(){
    return this.afs.collection(this.collectionName).snapshotChanges();
  }

  actulizarEstudiante(idKey, data){
    return this.afs.collection(this.collectionName).doc(idKey).set(data);
  }

  borrarEstudiante(idKey){
    return this.afs.collection(this.collectionName).doc(idKey).delete();
  }

  obtenerImagen(path): Promise<string>{
    return new Promise((resolve, reject) => {
      var storageRef = firebase.storage().ref("estudiantes");
      storageRef.listAll().then( result => {
        result.items.forEach( (imageRef:any) => {
          if(imageRef.location.path === path){
            imageRef.getDownloadURL().then( url  => {
              resolve(url);
            }).catch(error => { });
          }  
        });
      }).catch( error => { });
    });
  }

  subirImagen(_imageBlobInfo) {
    firebase.storage()
    return new Promise((resolve, reject) => {
      let fileRef = firebase.storage().ref("estudiantes/" + _imageBlobInfo.fileName);
      let uploadTask = fileRef.put(_imageBlobInfo.imgBlob);
      uploadTask.on( "state_changed", (_snapshot: any) => {},
        _error => {
          reject(_error);
        },
        () => {
          resolve('estudiantes/' + uploadTask.snapshot.metadata.name);
        }
      );
    });
  }
  
  convertiraBlob(_imagePath) {
    return new Promise((resolve, reject) => {
      let fileName = "";
      this.file
        .resolveLocalFilesystemUrl(_imagePath)
        .then(fileEntry => {
          let { name, nativeURL } = fileEntry;
          let path = nativeURL.substring(0, nativeURL.lastIndexOf("/"));
          fileName = name;
          return this.file.readAsArrayBuffer(path, name);
        })
        .then(buffer => {
          let imgBlob = new Blob([buffer], { type: "image/jpeg" });
          resolve({
            fileName,
            imgBlob
          });
        })
        .catch(e => reject(e));
    });
  }

}
