import { Component } from '@angular/core';
import { inject, Inject ,HostListener, OnInit, signal, computed} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BlockchainService } from '../blockchain.service';
import { Router } from '@angular/router';
import { LeftSidebarComponent } from '../left-sidebar/left-sidebar.component';


@Component({
  selector: 'app-results',
  imports: [CommonModule, FormsModule, LeftSidebarComponent],
  templateUrl: './results.component.html',
  styleUrl: './results.component.css'
})
export class ResultsComponent implements OnInit{
  isLeftSidebarCollapsed = signal<boolean>(false);
  screenWidth = signal<number>(window.innerWidth);

  @HostListener('window:resize')
  onResize() {
    this.screenWidth.set(window.innerWidth);
    if (this.screenWidth() < 768) {
      this.isLeftSidebarCollapsed.set(true);
    }
  }

  isUser: any;
  isOrg: any;

  constructor(private BlockchainService: BlockchainService, private router: Router) { }
  async ngOnInit() {
    this.isLeftSidebarCollapsed.set(this.screenWidth() < 768);
    this.isUser = await this.BlockchainService.userExists(await this.BlockchainService.getUserAddress());
    this.isOrg = await this.BlockchainService.isOrg(await this.BlockchainService.getUserAddress());
    this.allocateCandidates();
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

  access = '';

  chairmans: any[] = [];
  chairimg: string = '';
  chairmanVotes: any[] = [];
  vChairmans: any[] = [];
  vchairimg: string = '';
  vchairmanVotes: any[] = [];
  secretarys: any[] = [];
  secretaryimg: string = '';
  secretaryVotes: any[] = [];
  auditors: any[] = [];
  auditorimg: string = '';
  auditorVotes: any[] = [];
  pios: any[] = [];
  pioimg: string = '';
  pioVotes: any[] = [];
  candidates: any[] = [];

  electionID: any;
  closeElectionID: any;

  clear(){
    this.chairmans = [];
    this.chairimg = '';
    this.chairmanVotes = [];
    this.vChairmans = [];
    this.vchairimg = '';
    this.vchairmanVotes = [];
    this.secretarys = [];
    this.secretaryimg = '';
    this.secretaryVotes = [];
    this.auditors = [];
    this.auditorimg  = '';
    this.auditorVotes = [];
    this.pios = [];
    this.pioimg = '';
    this.pioVotes = [];
    this.chairmanWin = 0;
    this.viceChairmanWin = 0;
    this.secretaryWin = 0;
    this.auditorWin = 0;
    this.pioWin = 0;
  }


  async allocateCandidates(){
    await this.BlockchainService.loadBlockchain();
    this.candidates = await this.BlockchainService.getCandidates(this.electionID);
    for(let i = 0; i < this.candidates.length; i++){
        var position = await this.BlockchainService.getCandidatePosition(this.electionID, i);
        
        if (position == 'chairman'){
            this.chairmans.push(this.candidates[i]);
            
            this.chairmanVotes.push(await this.BlockchainService.getCandidateVoteCount(this.electionID, i));
        }
        if(position == 'vice-chairman'){
            this.vChairmans.push(this.candidates[i]);
            
            this.vchairmanVotes.push(await this.BlockchainService.getCandidateVoteCount(this.electionID, i));
        }
        if(position == 'secretary'){
            this.secretarys.push(this.candidates[i]);
            
            this.secretaryVotes.push(await this.BlockchainService.getCandidateVoteCount(this.electionID, i));
        }
        if(position == 'auditor'){
            this.auditors.push(this.candidates[i]);
            
            this.auditorVotes.push(await this.BlockchainService.getCandidateVoteCount(this.electionID, i));
        }
        if(position == 'pio'){
            this.pios.push(this.candidates[i]);
            
            this.pioVotes.push(await this.BlockchainService.getCandidateVoteCount(this.electionID, i));
        }
     }

     console.log('chairmans', this.chairmans, this.chairmanVotes, this.chairmanVotes.length);
     console.log('vice chairmans', this.vChairmans, this.vchairmanVotes);
     console.log('secretarys', this.secretarys, this.secretaryVotes);
     console.log('auditors', this.auditors, this.auditorVotes);
     console.log('pios', this.pios, this.pioVotes);
  }

  chairmanWin = 0;
  viceChairmanWin = 0;
  secretaryWin = 0;
  auditorWin = 0;
  pioWin = 0;

  electedChairman : string = '';
  electedViceChairman : string = '';
  electedSecretary : string = '';
  electedAuditor : string = '';
  electedPIO : string = '';


  electionStatus : any;
  msg : string = '';
  clsmsg = '';
  electionName = '';
  endDate = '';

  toggle = 1;

  async results(){
    this.clear();
     await this.allocateCandidates();
      this.electionStatus = await this.BlockchainService.getElectionStatus(this.electionID);
      this.endDate = await this.BlockchainService.getElectionEndDate(this.electionID);
      this.electionName = await this.BlockchainService.getElectionName(this.electionID);
      const date = new Date();
      // if(date > new Date(this.endDate)){
      //   this.msg = 'Election is past due, please end the election';
      //   return;
      // }




      if(this.electionStatus == false) {
        
        for(let i = 0; i < this.chairmanVotes.length; i++){
          if(this.chairmanVotes[i] > this.chairmanWin){
              this.chairmanWin = this.chairmanVotes[i];
              this.electedChairman = this.chairmans[i];
          }
        }
        for(let i = 0; i < this.vchairmanVotes.length; i++){
            if(this.vchairmanVotes[i] > this.viceChairmanWin){
                this.viceChairmanWin = this.vchairmanVotes[i];
                this.electedViceChairman = this.vChairmans[i];
            }
        }
        for(let i = 0; i < this.secretaryVotes.length; i++){
            if(this.secretaryVotes[i] > this.secretaryWin){
                this.secretaryWin = this.secretaryVotes[i];
                this.electedSecretary = this.secretarys[i];
            }
        }
        for(let i = 0; i < this.auditorVotes.length; i++){
            if(this.auditorVotes[i] > this.auditorWin){
                this.auditorWin = this.auditorVotes[i];
                this.electedAuditor = this.auditors[i];
            }
        }
        for(let i = 0; i < this.pioVotes.length; i++){
            if(this.pioVotes[i] > this.pioWin){
                this.pioWin = this.pioVotes[i];
                this.electedPIO = this.pios[i];
            }
        }

        this.toggle = 2;
      }else if(this.electionStatus == true){
        this.msg = 'Election is still ongoing';
        console.log('true');
      }else{
        this.msg = 'Election does not exist';
      console.log(this.electionStatus);
      }

      const chairID = await this.BlockchainService.getCandidateIDByName(this.electionID, this.electedChairman);
      const viceChairID = await this.BlockchainService.getCandidateIDByName(this.electionID, this.electedViceChairman);
      const secretaryID = await this.BlockchainService.getCandidateIDByName(this.electionID, this.electedSecretary);
      const auditorID = await this.BlockchainService.getCandidateIDByName(this.electionID, this.electedAuditor);
      const pioID = await this.BlockchainService.getCandidateIDByName(this.electionID, this.electedPIO);


      this.chairimg = await this.BlockchainService.getCandidateCdn(this.electionID, chairID);
      this.vchairimg = await this.BlockchainService.getCandidateCdn(this.electionID, viceChairID);
      this.secretaryimg = await this.BlockchainService.getCandidateCdn(this.electionID, secretaryID);
      this.auditorimg = await this.BlockchainService.getCandidateCdn(this.electionID, auditorID);
      this.pioimg = await this.BlockchainService.getCandidateCdn(this.electionID, pioID);
      console.log(this.chairimg);
      
      

  }



  async closeElection(electionID: number){
    this.electionStatus = await this.BlockchainService.getElectionStatus(electionID);
    if(this.electionStatus == false){
      this.clsmsg = 'Election is already closed';
    }else{
      await this.BlockchainService.closeElection(electionID);
      this.clsmsg = 'Election is now closed';
    }
    
    
    
  }

  clearfields(){
    this.electionID = '';
    this.msg = '';
    this.closeElectionID = '';
    this.clsmsg = '';
  }




}
