import { Component, inject, Inject } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BlockchainService } from '../blockchain.service';
import { Router } from '@angular/router';



@Component({
  selector: 'app-dashboard',
  imports: [HeaderComponent, CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})


export class DashboardComponent {
  
  router = inject(Router);
  private blockchainService = inject(BlockchainService);
  
  constructor() {

   
    // if (GlobalsService.isSignedin == false || GlobalsService.isSignedin == undefined) {
    //   this.router.navigate(['/auth']);
    // }
    // console.log(GlobalsService.isSignedin);
  }


  walletAddress: Promise<string> = Promise.resolve('');
  userName: Promise<string> = Promise.resolve('');
  elections: any[] = [];
  electionName: string = '';
  owner = '0xF3dcc20F2889631e7f09618b460149f770004517';
  user: Promise <string> = Promise.resolve(this.blockchainService.getUserAddress());
  

  async getElections() {
    this.elections = await this.blockchainService.getElectionNames();
  }
  async ngOnInit(): Promise<void> {
      try {
        await this.blockchainService.loadBlockchain();
        if (this.blockchainService.signer) {
          this.walletAddress = this.blockchainService.signer.getAddress();
          this.userName = this.blockchainService.getUsername(this.blockchainService.signer.getAddress());
        } else {
          this.router.navigate(['/auth']);
        }
      } catch (e) {
        this.router.navigate(['/auth']);
      } 


      await this.getElections();
  }


  async createElection() {
    await this.blockchainService.createElection(this.electionName);
    
  }

  

  


  


}
