import { Component, inject, Inject ,HostListener, OnInit, signal, computed,CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BlockchainService } from '../blockchain.service';
import { Router } from '@angular/router';
import { LeftSidebarComponent } from '../left-sidebar/left-sidebar.component';
import { MatDividerModule } from '@angular/material/divider';
import {MatRadioModule} from '@angular/material/radio';
import { CheckAuthService } from '../check-auth.service';

@Component({
  selector: 'app-vote',
  imports: [CommonModule, FormsModule, LeftSidebarComponent, MatDividerModule, MatRadioModule],
  templateUrl: './vote.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  styleUrl: './vote.component.css'
})
export class VoteComponent implements OnInit {

  join:boolean = true
  vote: boolean = false
  isLeftSidebarCollapsed = signal<boolean>(false);
  screenWidth = signal<number>(window.innerWidth);

  @HostListener('window:resize')
  onResize() {
    this.screenWidth.set(window.innerWidth);
    if (this.screenWidth() < 768) {
      this.isLeftSidebarCollapsed.set(true);
    }
  }

  constructor(private BlockchainService: BlockchainService, private router: Router, private checkAuth: CheckAuthService) {
    
  }

  async ngOnInit(){
    
    this.isLeftSidebarCollapsed.set(this.screenWidth() < 768);
    try{
        await this.BlockchainService.loadBlockchain();
        const isUser = await this.BlockchainService.userExists(await this.BlockchainService.getUserAddress());
        const isOrg = await this.BlockchainService.isOrg(await this.BlockchainService.getUserAddress());
        if (isUser){
          localStorage.clear();
          localStorage.setItem('user', 'true');
          
          
        }
        else if (isOrg){
          localStorage.clear();
          localStorage.setItem('user', 'false');
          
          
        }
        else{
          localStorage.clear();
          this.router.navigate(['/auth']);
        }

      }catch(e){
        localStorage.clear();
        
        this.router.navigate(['/auth']);
      }

      
    
    
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

  switch(name: string){
    this.toggle = name
  }

  toggle: string = 'vote';
  msg = '';
  elections: string[] = [];

  electionID:any;
  electionName: string = '';
  startDate: string = '';
  endDate: string = '';
  domainFilter: string = '';
  email: string = '';
  user: string = '';

  candidates: any[] = [];

  chairmans: any[] = [];
  chairimgs: any[] = [];
  vChairmans: any[] = [];
  vchairimgs: any[] = [];
  secretarys: any[] = [];
  secretaryimgs: any[] = [];
  auditors: any[] = [];
  auditorimgs: any[] = [];
  pios: any[] = [];
  pioimgs: any[] = [];



  async allocatePositions(){
    await this.BlockchainService.loadBlockchain();
    for(let i = 0; i < this.candidates.length; i++){
        var position = await this.BlockchainService.getCandidatePosition(this.electionID, i);
        
        if (position == 'chairman'){
            this.chairmans.push(this.candidates[i]);
            this.chairimgs.push(await this.BlockchainService.getCandidateCdn(this.electionID, i));
        }
        if(position == 'vice-chairman'){
            this.vChairmans.push(this.candidates[i]);
            this.vchairimgs.push(await this.BlockchainService.getCandidateCdn(this.electionID, i));
        }
        if(position == 'secretary'){
            this.secretarys.push(this.candidates[i]);
            this.secretaryimgs.push(await this.BlockchainService.getCandidateCdn(this.electionID, i));
        }
        if(position == 'auditor'){
            this.auditors.push(this.candidates[i]);
            this.auditorimgs.push(await this.BlockchainService.getCandidateCdn(this.electionID, i));
        }
        if(position == 'pio'){
            this.pios.push(this.candidates[i]);
            this.pioimgs.push(await this.BlockchainService.getCandidateCdn(this.electionID, i));
        }
    }


  }
  

  async viewElection(electionID: number){
    try{
      const endDate = await this.BlockchainService.getElectionEndDate(electionID);
      const date = new Date(endDate);
      const status = await this.BlockchainService.getElectionStatus(electionID);
      if(status == false){
        this.msg = 'Election already closed.';
        return;
      }

      if(date < new Date()){
        this.msg = 'Election is over. Please check results';
        return;
      }
    }catch(e){
      this.msg = 'Election does not exist';
      return;
    }
    
    
    
    

    

    this.getVoteCount();
    await this.BlockchainService.loadBlockchain();
    this.getCandidateNames();
    try{
      this.electionName = await this.BlockchainService.getElectionName(electionID);
      this.startDate = await this.BlockchainService.getElectionStartDate(electionID);
      this.endDate = await this.BlockchainService.getElectionEndDate(electionID);
      this.domainFilter = await this.BlockchainService.getElectionDomainFilter(electionID);
      this.user = await this.BlockchainService.getUserAddress();
      this.email = await this.BlockchainService.getEmail(this.user);
      if(this.email.includes(this.domainFilter) == false && this.domainFilter != 'any'){
        this.msg = 'You are not allowed to vote in this election';
        return;
      }
      this.allocatePositions();
      this.join = false;
      this.vote = true;
    }catch(error){
      this.join = true;
      this.vote = false;
      this.msg = 'Election does not exist';
    }
     

  }

  exitElection(){
    this.toggle = 'vote';
    this.chairmans = [];
    this.chairimgs = [];
    this.vChairmans = [];
    this.vchairimgs = [];
    this.secretarys = [];
    this.secretaryimgs = [];
    this.auditors = [];
    this.auditorimgs = [];
    this.pios = [];
    this.pioimgs = [];
    this.join = true;
    this.vote = false;
    this.msg = '';
  }

  async getCandidateNames() {
    this.candidates = await this.BlockchainService.getCandidates(this.electionID);
    
  }


    votedChairman: string = '';
    votedVChairman: string = '';
    votedSecretary: string = '';
    votedAuditor: string = '';
    votedPIO: string = '';
    errormsg: string = '';
    

    candidateVotes: any[] = [];
    chairmanVotes: any[] = [];
    vChairmanVotes: any[] = [];
    secretaryVotes: any[] = [];
    auditorVotes: any[] = [];
    pioVotes: any[] = [];

    async getVoteCount(){
      this.BlockchainService.loadBlockchain();
      this.chairmanVotes = [];
      this.vChairmanVotes = [];
      this.secretaryVotes = [];
      this.auditorVotes = [];
      this.pioVotes = [];
      let candidatelist :any[] = [];
      candidatelist = await this.BlockchainService.getCandidates(this.electionID);

      for (let i = 0; i < candidatelist.length; i++){
          if(await this.BlockchainService.getCandidatePosition(this.electionID, i) == 'chairman'){
              this.chairmanVotes.push(await this.BlockchainService.getCandidateVoteCount(this.electionID, i));
          }
          if(await this.BlockchainService.getCandidatePosition(this.electionID, i) == 'vice-chairman'){
              this.vChairmanVotes.push(await this.BlockchainService.getCandidateVoteCount(this.electionID, i));        
          }
          if(await this.BlockchainService.getCandidatePosition(this.electionID, i) == 'secretary'){
              this.secretaryVotes.push(await this.BlockchainService.getCandidateVoteCount(this.electionID, i));
          }
          if(await this.BlockchainService.getCandidatePosition(this.electionID, i) == 'auditor'){
              this.auditorVotes.push(await this.BlockchainService.getCandidateVoteCount(this.electionID, i));
          }
          if(await this.BlockchainService.getCandidatePosition(this.electionID, i) == 'pio'){
              this.pioVotes.push(await this.BlockchainService.getCandidateVoteCount(this.electionID, i));
          }
      }
      
      
      
      for(let i = 0; i < candidatelist.length; i++){
        this.candidateVotes.push(await this.BlockchainService.getCandidateVoteCount(this.electionID, i));
      }
  
      
      
    }

  async submitVote(){
    this.checkAuth.checkAuth();
    try{
      let selectedChairman = <HTMLInputElement>document.querySelector('input[name="chairman"][type="radio"]:checked');
      let selectedVChairman = <HTMLInputElement>document.querySelector('input[name="vchairman"][type="radio"]:checked');
      let selectedSecretary = <HTMLInputElement>document.querySelector('input[name="secretary"][type="radio"]:checked');
      let selectedAuditor = <HTMLInputElement>document.querySelector('input[name="auditor"][type="radio"]:checked');
      let selectedPIO = <HTMLInputElement>document.querySelector('input[name="pio"][type="radio"]:checked');
      this.votedChairman = selectedChairman.value;
      this.votedVChairman = selectedVChairman.value;
      this.votedSecretary = selectedSecretary.value;
      this.votedAuditor = selectedAuditor.value;
      this.votedPIO = selectedPIO.value;
    }catch(error){
      this.errormsg = 'Please select a candidate in each positions';
    }
    const voteID: any[] = [
        await this.BlockchainService.getCandidateIDByName(this.electionID, this.votedChairman),
        await this.BlockchainService.getCandidateIDByName(this.electionID, this.votedVChairman),
        await this.BlockchainService.getCandidateIDByName(this.electionID, this.votedSecretary),
        await this.BlockchainService.getCandidateIDByName(this.electionID, this.votedAuditor),
        await this.BlockchainService.getCandidateIDByName(this.electionID, this.votedPIO)
    ];

    
    if(this.votedChairman != '' && this.votedVChairman != '' && this.votedSecretary != '' && this.votedAuditor != '' && this.votedPIO != ''){
      try{
        await this.BlockchainService.vote(this.electionID, voteID);
        this.getVoteCount();
      }catch(error){
        this.errormsg = 'You have already voted';
      }
        
    }
  }


  async getCandidateIDByName(name: string){
    return await this.BlockchainService.getCandidateIDByName(this.electionID, name);
    
  }


  pCandidateName = '';
  pCandidatePlatform = '';
  pCandidateID: number | null = null;
  pCandidateImage = '';

  async toggleToPlatform(name: string){
    this.pCandidateName = name;
    this.pCandidateID = await this.getCandidateIDByName(name);
    this.pCandidatePlatform = await this.BlockchainService.getCandidatePlatform(this.electionID, this.pCandidateID);
    this.pCandidateImage = await this.BlockchainService.getCandidateCdn(this.electionID, this.pCandidateID);
    this.toggle = 'platform';


  }

  
}

