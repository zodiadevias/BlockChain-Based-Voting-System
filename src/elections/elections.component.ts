import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { inject, HostListener, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BlockchainService } from '../blockchain.service';
import { Router } from '@angular/router';
import { LeftSidebarComponent } from '../left-sidebar/left-sidebar.component';
import * as UC from '@uploadcare/file-uploader';
import '@uploadcare/file-uploader/web/uc-file-uploader-regular.min.css';
import { MatDividerModule } from '@angular/material/divider';

UC.defineComponents(UC);

@Component({
  selector: 'app-elections',
  imports: [CommonModule, FormsModule, LeftSidebarComponent, MatDividerModule],
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

  async createElection() {
    await this.blockchainService.createElection(this.electionName, this.startDate, this.endDate, this.domainFilter);
    this.getOwnedElections();
  }

  async getElections() {
    this.elections = await this.blockchainService.getElectionNames();
    console.log(this.elections);
  }

  async getOwnedElections() {
    this.ownedElections = await this.blockchainService.getOwnedElectionNames();
    console.log(this.ownedElections);
    console.log(this.elections);
  }

  async ownedElectionNames() {
    this.ownedElections = await this.blockchainService.getOwnedElectionNames();
    for (let i = 0; i < this.ownedElections.length; i++) {
      this.elections[i] = await this.blockchainService.getElectionIDbyName(this.ownedElections[i]);
    }
  }

  
  

  electionIdTitle: number = 0;

  async viewElection(name: string) {
    this.elections = await this.blockchainService.getElectionNames();
    const electionID: number = Number(await this.getOwnedElectionIDbyName(name));
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


  candidateName: string = '';
  candidatePosition: string = '';
  candidatePlatform: string = '';
  candidates: any[] = [];
  updateCandidate: boolean = false;
  candidateNameUpdate: string = '';

  async addCandidate() {
    const electionID = this.electionIdTitle;
    await this.blockchainService.addCandidate(electionID, this.candidateName, this.candidatePosition, this.candidatePlatform);
    this.getCandidateNames();
    this.candidateName = '';
    this.candidatePosition = '';
    this.candidatePlatform = '';
  }

  async toggleCandidateUpdateOn(name: string) {
    this.updateCandidate = true;
    this.candidateNameUpdate = name;
  }

  async toggleCandidateUpdateOff() {
    this.updateCandidate = false;
    this.candidateNameUpdate = '';
  }

  async getCandidateNames() {
    this.candidates = await this.blockchainService.getCandidates(this.electionIdTitle);
  }
}

