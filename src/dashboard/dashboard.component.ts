import { Component, inject, Inject ,HostListener, OnInit, signal, computed, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BlockchainService } from '../blockchain.service';
import { Router } from '@angular/router';
import { LeftSidebarComponent } from '../left-sidebar/left-sidebar.component';
import { MatDividerModule } from '@angular/material/divider';
import { CheckAuthService } from '../check-auth.service';




@Component({
  selector: 'app-dashboard',
  imports: [ CommonModule, FormsModule, LeftSidebarComponent, MatDividerModule],
  templateUrl: './dashboard.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  styleUrl: './dashboard.component.css'
})


export class DashboardComponent implements OnInit {

  isLeftSidebarCollapsed = signal<boolean>(false);
  screenWidth = signal<number>(window.innerWidth);

  @HostListener('window:resize')
  onResize() {
    this.screenWidth.set(window.innerWidth);
    if (this.screenWidth() < 768) {
      this.isLeftSidebarCollapsed.set(true);
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




  router = inject(Router);
  private blockchainService = inject(BlockchainService);
  private checkAuth = inject(CheckAuthService);
  
  constructor() {
    
  }


  walletAddress: string = '';
  userName: Promise<string> = Promise.resolve('');
  orgName: Promise<string> = Promise.resolve('');
  
  owner = '0xF3dcc20F2889631e7f09618b460149f770004517';
  user: Promise <string> = Promise.resolve(this.blockchainService.getUserAddress());
  whatAmI: string = '';
  upcomingElections:any[] = [];
  ongoingElections:any[] = [];

  upcomingElectionID:any[] = [];
  ongoingElectionID:any[] = [];

  elections:any[] = [];
  
  
  
  async ngOnInit(): Promise<void> {
    this.isLeftSidebarCollapsed.set(this.screenWidth() < 768);
    

    
      try{
        await this.blockchainService.loadBlockchain();
        this.elections = await this.blockchainService.getElectionNames();
        await this.getMyRecentElectionIds();
        const isUser = await this.blockchainService.userExists(await this.blockchainService.getUserAddress());
        const isOrg = await this.blockchainService.isOrg(await this.blockchainService.getUserAddress());
        this.walletAddress = await this.blockchainService.getUserAddress();
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

      await this.upcomingElection();
      await this.ongoingElection();
     

      
  }


  async upcomingElection() {

    
    this.elections = await this.blockchainService.getOwnedElectionNames();
    for (let i = 0; i < this.elections.length; i++) {
      var electionName = await this.blockchainService.getElectionIDbyName(this.elections[i]);
      var startDate = await this.blockchainService.getElectionStartDate(electionName);
      var endDate = await this.blockchainService.getElectionEndDate(electionName);
      var start = new Date(startDate);
      var end = new Date(endDate);
      var date = new Date();
      if (start > date && end > date) {
        this.upcomingElections.push(this.elections[i]);
        
      }
    }

    for(let i = 0; i < this.upcomingElections.length; i++) {
      this.upcomingElectionID.push(await this.blockchainService.getElectionIDbyName(this.upcomingElections[i]));
    }

    

  }

  async ongoingElection() {
    console.log("Ongoing Elections");
    this.elections = await this.blockchainService.getOwnedElectionNames();
    for (let i = 0; i < this.elections.length; i++) {
      var electionName = await this.blockchainService.getElectionIDbyName(this.elections[i]);
      var startDate = await this.blockchainService.getElectionStartDate(electionName);
      var endDate = await this.blockchainService.getElectionEndDate(electionName);
      var start = new Date(startDate);
      var end = new Date(endDate);
      var date = new Date();
      
      if (start < date && end > date) {
        this.ongoingElections.push(this.elections[i]);
      }
    }

    for(let i = 0; i < this.ongoingElections.length; i++) {
      this.ongoingElectionID.push(await this.blockchainService.getElectionIDbyName(this.ongoingElections[i]));
    }
    
  }

recents: any[] = [];
recentElectionNames: any[] = [];
recentElectionNamesReverse: any[] = [];

async getMyRecentElectionIds(){
  this.recents = await this.blockchainService.getMyRecentElectionIds();
  for (let i = 0; i < this.recents.length; i++) {
    this.recentElectionNames.push(await this.blockchainService.getElectionName(this.recents[i]));
  }

  for (let i = this.recents.length - 1; i >= 0; i--) {
    this.recentElectionNamesReverse.push(await this.blockchainService.getElectionName(this.recents[i]));
  }

}



  
  


}
