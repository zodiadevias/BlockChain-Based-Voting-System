import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild , CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from '@angular/core';
import * as UC from "@uploadcare/file-uploader";
import { OutputFileEntry } from '@uploadcare/file-uploader';
import { GlobalsService } from '../globals.service';


UC.defineComponents(UC);
@Component({
  selector: 'app-upload',
  imports: [CommonModule],
  templateUrl: './upload.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
  styleUrl: './upload.component.css'
})
export class UploadComponent {

  @ViewChild('ctxProvider', { static: true }) ctxProviderRef!: ElementRef<
  InstanceType<UC.UploadCtxProvider>
>;
constructor(private GlobalsService: GlobalsService) { }
files: any[] = [];

ngOnInit() {
  this.ctxProviderRef.nativeElement.addEventListener(
    'change',
    this.handleChangeEvent
  );
}

ngOnDestroy() {
  this.ctxProviderRef.nativeElement.removeEventListener('change', this.handleChangeEvent);
}

handleChangeEvent = (e: UC.EventMap['change']) => {
  this.files = e.detail.allEntries.filter(f => f.status === 'success') as OutputFileEntry<'success'>[];
  this.GlobalsService.postCDN(this.files[0].cdnUrl);
};

getcdn(){
  return this.files[0].cdnUrl;
}

resetcdn(){
  this.files = [];
  this.GlobalsService.postCDN('');
}

}
