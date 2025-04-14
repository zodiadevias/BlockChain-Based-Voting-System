import { Component, inject, Inject ,HostListener, OnInit, signal, computed} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BlockchainService } from '../blockchain.service';
import { Router } from '@angular/router';
import { LeftSidebarComponent } from '../left-sidebar/left-sidebar.component';




@Component({
  selector: 'app-dashboard',
  imports: [ CommonModule, FormsModule, LeftSidebarComponent],
  templateUrl: './dashboard.component.html',
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
  
  constructor() {
  }


  walletAddress: string = '';
  userName: Promise<string> = Promise.resolve('');
  orgName: Promise<string> = Promise.resolve('');
  
  owner = '0xF3dcc20F2889631e7f09618b460149f770004517';
  user: Promise <string> = Promise.resolve(this.blockchainService.getUserAddress());
  whatAmI: string = '';
  
  
  async ngOnInit(): Promise<void> {
    this.isLeftSidebarCollapsed.set(this.screenWidth() < 768);
    
      try{
        await this.blockchainService.loadBlockchain();
        const isUser = await this.blockchainService.userExists(await this.blockchainService.getUserAddress());
        const isOrg = await this.blockchainService.isOrg(await this.blockchainService.getUserAddress());
        this.walletAddress = await this.blockchainService.getUserAddress();
        if (isUser){
          this.whatAmI = 'Voter';
        }
        else if (isOrg){
          this.whatAmI = 'Organizer';
        }
        else{
          localStorage.clear();
          this.router.navigate(['/auth']);
        }

      }catch(e){
        localStorage.clear();
        this.router.navigate(['/auth']);
      }

      if (this.whatAmI == ''){
        localStorage.clear();
        this.router.navigate(['/auth']);
      }
  }



  
  


}
