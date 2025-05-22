import { Component, CUSTOM_ELEMENTS_SCHEMA , ViewChild, ElementRef, NO_ERRORS_SCHEMA} from '@angular/core';
import { inject, HostListener, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BlockchainService } from '../blockchain.service';
import { Router } from '@angular/router';
import { LeftSidebarComponent } from '../left-sidebar/left-sidebar.component';
import * as UC from '@uploadcare/file-uploader';
import '@uploadcare/file-uploader/web/uc-file-uploader-regular.min.css';
import { MatDividerModule } from '@angular/material/divider';
import { OutputFileEntry } from '@uploadcare/file-uploader';
import { UploadComponent } from '../upload/upload.component';
import { GlobalsService } from '../globals.service';
import { Subscription, interval } from 'rxjs';
import { CheckAuthService } from '../check-auth.service';

UC.defineComponents(UC);

@Component({
  selector: 'app-elections',
  imports: [CommonModule, FormsModule, LeftSidebarComponent, MatDividerModule, UploadComponent],
  templateUrl: './elections.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
  styleUrl: './elections.component.css'
})
export class ElectionsComponent implements OnInit {
  @HostListener('window:resize')
  onResize() {
    this.screenWidth.set(window.innerWidth);
    if (this.screenWidth() < 768) {
      this.isLeftSidebarCollapsed.set(true);
    }
  }

  files: any[] = [];
  manage: number = 1;
  isLeftSidebarCollapsed = signal<boolean>(false);
  screenWidth = signal<number>(window.innerWidth);
  private blockchainService = inject(BlockchainService);
  private globalsService = inject(GlobalsService);
  router = inject(Router);
  private checkAuth = inject(CheckAuthService);
  whatAmI: string = '';
  elections: any[] = [];
  ownedElections: string[] = [];
  electionName: string = '';
  _electionName: string = '';
  startDate: string = '';
  endDate: string = '';
  domainFilter: string = '';
  _startDate: string = '';
  _endDate: string = '';
  _domainFilter: string = '';
  new_electionName: string = '';
  new_startDate: string = '';
  new_endDate: string = '';
  new_domainFilter: string = '';
  toggleWindowManager: string = 'candidates';
  address: string = '';
  msg: string = '';
  candidateName: string = '';
  candidatePosition: string = '';
  candidatePlatform: string = '';
  candidates: any[] = [];
  updateCandidate: boolean = false;
  candidateNameUpdate: string = '';
  candidatePositionUpdate: string = '';
  candidatePlatformUpdate: string = '';
  candidateNameTitle: string = '';
  cdnUpdate: string = '';
  cdn: string = '';
  electionIdTitle: number = 0;
  
  async ngDoCheck(){
    this.cdn = this.globalsService.getCDN();
  }


  async ngOnInit() {
    try{
      await this.blockchainService.loadBlockchain();
      const isUser = await this.blockchainService.userExists(await this.blockchainService.getUserAddress());
      const isOrg = await this.blockchainService.isOrg(await this.blockchainService.getUserAddress());
      if (isUser){
        localStorage.clear();
        localStorage.setItem('user', 'true');
        this.whatAmI = 'Voter';
      }
      else if (isOrg){
        localStorage.clear();
        localStorage.setItem('user', 'false');
        this.whatAmI = 'Organizer';
      }
      else{
        localStorage.clear();
        this.router.navigate(['/auth']);
      }
    }catch(e){
      localStorage.clear();
      this.whatAmI = '';
      this.router.navigate(['/auth']);
    }
    if (this.whatAmI == ''){
      localStorage.clear();
      this.router.navigate(['/auth']);
    }
    this.isLeftSidebarCollapsed.set(this.screenWidth() < 768);
    this.ownedElectionNames();
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

  async toggleWindow(window: string) {
    this.checkAuth.checkAuth();
    this.toggleWindowManager = window;
    if(window == 'details'){
      this._startDate = await this.blockchainService.getElectionStartDate(this.electionIdTitle);
      this._endDate = await this.blockchainService.getElectionEndDate(this.electionIdTitle);
      this._domainFilter = await this.blockchainService.getElectionDomainFilter(this.electionIdTitle);
    }else if(window == 'update'){
      this._startDate = await this.blockchainService.getElectionStartDate(this.electionIdTitle);
      this._endDate = await this.blockchainService.getElectionEndDate(this.electionIdTitle);
      this._domainFilter = await this.blockchainService.getElectionDomainFilter(this.electionIdTitle);
      this.new_electionName = this._electionName;
      this.new_startDate = this._startDate;
      this.new_endDate = this._endDate;
      this.new_domainFilter = this._domainFilter;
    }
  }

  checkDate(){
    this.checkAuth.checkAuth();
    if (this.electionName == '' || this.startDate == '' || this.endDate == '' || this.domainFilter == '') {
      this.msg = 'Please fill required fields';
      return;
    }
    const startDate = new Date(this.startDate);
    const endDate = new Date(this.endDate);
    if(startDate < endDate){
      this.msg = '';
      this.createElection();
      this.ownedElectionNames();
    }else{
      if(this.startDate == '' || this.endDate == ''){
        this.msg = 'Please fill required fields';
      }else{
        this.msg = 'Start date must be before end date';
      }
    }
  }

  async createElection() {
    this.checkAuth.checkAuth();
    await this.blockchainService.createElection(this.electionName, this.startDate, this.endDate, this.domainFilter);
    this.getOwnedElections();
  }

  async getElections() {
    this.checkAuth.checkAuth();
    this.elections = await this.blockchainService.getElectionNames();
    
  }

  async getOwnedElections() {
    this.ownedElections = await this.blockchainService.getOwnedElectionNames();
    
  }

  async ownedElectionNames() {
    this.blockchainService.getOwnedElectionNames().then(async (ownedElections) => {
      this.ownedElections = ownedElections;
      for (let i = 0; i < this.ownedElections.length; i++) {
        this.elections[i] = await this.blockchainService.getElectionIDbyName(this.ownedElections[i]);
      }
    });
    // for (let i = 0; i < this.ownedElections.length; i++) {
    //   this.elections[i] = await this.blockchainService.getElectionIDbyName(this.ownedElections[i]);
    // }
  }

  async updateElection(){
    this.checkAuth.checkAuth();
    const confirmUpdate = confirm('Are you sure you want to update this election?');
    if(confirmUpdate){
      await this.blockchainService.updateElection(this.electionIdTitle, this.new_electionName, this.new_startDate, this.new_endDate, this.new_domainFilter);
      this.ownedElectionNames();
      this.manage = 1;
    }
  }
  async viewElection(name: string) {
    this.checkAuth.checkAuth();
    this.elections = await this.blockchainService.getElectionNames();
    const electionID: number = Number(await this.getOwnedElectionIDbyName(name));
    const endDate = await this.blockchainService.getElectionEndDate(electionID);
    const date = new Date();
    if(date > new Date(endDate)){
      alert('Election ended at ' + new Date(endDate) + ', you cannot edit this election.');
      return;
    }
    this.electionIdTitle = electionID;
    this._electionName = this.elections[electionID - 1];
    console.log(this.electionName);
    this.getCandidateNames();
    this.manage = 2;
  }

  async getOwnedElectionIDbyName(name: string) {
    return await this.blockchainService.getElectionIDbyName(name);
  }

  async getElectionName(electionID: number) {
    this.electionName = await this.blockchainService.getElectionName(electionID);
    this._electionName = this.electionName;
  }

  async getElectionStartDate(electionID: number) {
    this.startDate = await this.blockchainService.getElectionStartDate(electionID);
    this._startDate = this.startDate;
  }

  async getElectionEndDate(electionID: number) {
    this.endDate = await this.blockchainService.getElectionEndDate(electionID);
    this._endDate = this.endDate;
  }

  async getElectionDomainFilter(electionID: number) {
    this.domainFilter = await this.blockchainService.getElectionDomainFilter(electionID);
    this._domainFilter = this.domainFilter;
  }

  async getElectionDetails(electionID: number) {
    await this.getElectionName(electionID);
    await this.getElectionStartDate(electionID);
    await this.getElectionEndDate(electionID);
    await this.getElectionDomainFilter(electionID);
  }

  async updateElectionDetails() {
    this.blockchainService.updateElectionDetails(this.electionIdTitle, this.new_electionName, this.new_startDate, this.new_endDate, this.new_domainFilter);
  }
  async getAddress() {
    this.address = await this.blockchainService.getUserAddress();
  }
  getcdnurl(){
    this.cdn = this.globalsService.getCDN();
    console.log(this.cdn);
  }

  

  async addCandidate() {
    this.checkAuth.checkAuth();
    if (this.candidateName == '' || this.candidatePosition == '' || this.candidatePlatform == '' || this.cdn == '') return;
    const electionID = this.electionIdTitle;
    await this.blockchainService.addCandidate(electionID, this.candidateName, this.candidatePosition, this.candidatePlatform, this.globalsService.getCDN());
    this.getCandidateNames();
    this.candidateName = '';
    this.candidatePosition = '';
    this.candidatePlatform = '';
    this.globalsService.postCDN('');
    this.globalsService.resetcdn();
    this.cdn = '';
    
  }

  async toggleCandidateUpdateOn(name: string) {
    this.checkAuth.checkAuth();
    this.updateCandidate = true;
    this.candidateNameTitle = name;
    this.candidateNameUpdate = name;
    this.candidatePositionUpdate = await this.blockchainService.getCandidatePosition(this.electionIdTitle, this.candidates.indexOf(name));
    this.candidatePlatformUpdate = await this.blockchainService.getCandidatePlatform(this.electionIdTitle, this.candidates.indexOf(name));
    this.cdnUpdate = await this.blockchainService.getCandidateCdn(this.electionIdTitle, this.candidates.indexOf(name));
  }

  async toggleCandidateUpdateOff() {
    this.checkAuth.checkAuth();
    this.updateCandidate = false;
    this.candidateNameUpdate = '';
  }

  async getCandidateNames() {
    this.candidates = await this.blockchainService.getCandidates(this.electionIdTitle);
  }

  async deleteCandidate(){
    this.checkAuth.checkAuth();
    const confirmDelete = confirm('Are you sure you want to delete this candidate?');

    if (confirmDelete) {
      await this.blockchainService.deleteCandidate(this.electionIdTitle, this.candidates.indexOf(this.candidateNameUpdate));
      this.getCandidateNames();
      this.candidateNameUpdate = '';
      this.candidatePositionUpdate = '';
      this.candidatePlatformUpdate = '';
      this.toggleCandidateUpdateOff();
    }
    
  }

  async updateCandidateInfo(){
    this.checkAuth.checkAuth();
    if (this.candidateNameUpdate == '' || this.candidatePositionUpdate == '' || this.candidatePlatformUpdate == '') return;
    const confirmUpdate = confirm('Are you sure you want to update this candidate?');
    if (confirmUpdate){
      await this.blockchainService.updateCandidate(this.electionIdTitle, this.candidates.indexOf(this.candidateNameTitle), this.candidateNameUpdate, this.candidatePositionUpdate, this.candidatePlatformUpdate, this.globalsService.getCDN());
      this.getCandidateNames();
      this.toggleCandidateUpdateOff();
    }
    
  }
}




