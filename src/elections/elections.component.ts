import { Component , CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { inject, Inject ,HostListener, OnInit, signal, computed} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BlockchainService } from '../blockchain.service';
import { Router } from '@angular/router';
import { LeftSidebarComponent } from '../left-sidebar/left-sidebar.component';
import * as UC from '@uploadcare/file-uploader';
import "@uploadcare/file-uploader/web/uc-file-uploader-regular.min.css"



UC.defineComponents(UC);
@Component({
  selector: 'app-elections',
  imports: [CommonModule, FormsModule, LeftSidebarComponent],
  templateUrl: './elections.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  styleUrl: './elections.component.css'
})
export class ElectionsComponent implements OnInit {
  manage: number = 1;
  isLeftSidebarCollapsed = signal<boolean>(false);
  screenWidth = signal<number>(window.innerWidth);
  private blockchainService = inject(BlockchainService);
  router = inject(Router);
  @HostListener('window:resize')
  onResize() {
    this.screenWidth.set(window.innerWidth);
    if (this.screenWidth() < 768) {
      this.isLeftSidebarCollapsed.set(true);
    }
  }

  async ngOnInit() {
    this.blockchainService.loadBlockchain();
    this.isLeftSidebarCollapsed.set(this.screenWidth() < 768);
    this.getElections();
    
  }


  

  changeIsLeftSidebarCollapsed(isLeftSidebarCollapsed: boolean): void {
    this.isLeftSidebarCollapsed.set(isLeftSidebarCollapsed);
  }

  sizeClass = computed(() => {
    const isLeftSidebarCollapsed = this.isLeftSidebarCollapsed();
    if (isLeftSidebarCollapsed) {
      return '';
    }
    return this.screenWidth() > 768 ? 'body-trimmed' : 'body-md-screen';
  });


  

  elections: any[] = [];
  electionName: string = '';
  startDate: string = '';
  endDate: string = '';
  domainFilter: string = '';

  _startDate: string = '';
  _endDate: string = '';
  _domainFilter: string = '';

  toggleWindowManager: string = 'candidates';


  async getElections() {
    this.elections = await this.blockchainService.getElectionNames();
  }

  async createElection() {
    await this.blockchainService.createElection(this.electionName);
    this.getElections();
  }

  async viewElection(index: number) {
    this.electionName = this.elections[index];
    this.manage = 2;
    
  }

  async updateElection() {
  }

}
