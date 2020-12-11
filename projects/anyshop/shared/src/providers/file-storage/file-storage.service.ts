import { Injectable } from '@angular/core';
import {
  AngularFireStorage,
  AngularFireUploadTask,
} from '@angular/fire/storage';
import { first } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class FileStorageService {
  constructor(protected storage: AngularFireStorage) {
    // console.log('Hello FileStorageProvider Provider');
  }

  static isURL(str: string) {
    const pattern = new RegExp(
      '^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$',
      'i'
    );

    return pattern.test(str);
  }

  static isValidFileData(fileData: string) {
    if (!fileData) {
      return false;
    }
    if (this.isURL(fileData)) {
      return false;
    } else {
      return true;
    }
  }

  uploadFile(
    ref: string,
    file: File,
    fileName?: string
  ): AngularFireUploadTask {
    const storageRef = this.storage.ref(`${ref}/${fileName ?? file.name}`);

    return storageRef.put(file);
  }

  async uploadFileFromString(
    ref: string,
    fileName: string,
    data: string
  ): Promise<{ downloadURL: string }> {
    const storageRef = this.storage.ref(`${ref}/${fileName}`);

    const snapshot = await storageRef.putString(data, 'data_url');
    const downloadURL: string = await snapshot.ref.getDownloadURL();
    return { downloadURL };
  }

  async getMetadata(ref: string, fileName: string) {
    const storageRef = this.storage.ref(`${ref}/${fileName}`);

    try {
      const metadata = await storageRef.getMetadata().pipe(first()).toPromise();
      console.log('metra datra value', metadata);
      return metadata;
    } catch (e) {
      console.log('error metra data');
      if (e.code === 'storage/object-not-found') {
        return null;
      }

      return null;
    }
  }

  async fileExist(ref: string, fileName: string): Promise<boolean> {
    const storageRef = this.storage.ref(`${ref}/${fileName}`);

    try {
      const value = await storageRef.getDownloadURL().pipe(first()).toPromise();
      return !!value;
    } catch (e) {
      if (e.code === 'storage/object-not-found') {
        return false;
      }

      throw e;
    }
  }
}
