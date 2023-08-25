import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Storage } from '@google-cloud/storage';



@Injectable({
  providedIn: 'root',
})
export class GoogleDriveService {
  private storage: Storage;

  constructor() {
    this.storage = new Storage({
      credentials: environment.googleDriveCredentials,
    });
  }

  async checkUserPermissions(userEmail: string, folderId: string): Promise<boolean> {
    try {
      const [permissions] = await this.storage.bucket(folderId).getMetadata();

      const authorizedUser = permissions.acl.find(
        (permission) => permission.email === userEmail
      );

      return !!authorizedUser;
    } catch (error) {
      console.error('Error al comprobar los permisos:', error);
      return false;
    }
  }
}
