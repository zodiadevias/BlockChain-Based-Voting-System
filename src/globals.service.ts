import { Injectable } from '@angular/core';
import { ElectionsComponent } from './elections/elections.component';
import { UploadComponent } from './upload/upload.component';
import { Inject } from '@angular/core';
@Injectable({
  providedIn: 'root'
})


export class GlobalsService {

  private electionsComponent = Inject(ElectionsComponent);
  private uploadComponent = Inject(UploadComponent);
  constructor() {}



  cdn = '';

  getCDN(){
    return this.cdn;
  }

  postCDN(cdn: string){
    this.cdn = cdn;
    this.electionsComponent.cdn = cdn;
  }

  resetcdn(){
    this.uploadComponent.resetcdn();
  }
}
