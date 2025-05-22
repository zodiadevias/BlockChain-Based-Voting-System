import { Injectable } from '@angular/core';
import { BlockchainService } from './blockchain.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CheckAuthService {

  constructor(private blockchainService: BlockchainService, private router: Router) { }


  async checkAuth(){
    try{
        await this.blockchainService.loadBlockchain();
        const isUser = await this.blockchainService.userExists(await this.blockchainService.getUserAddress());
        const isOrg = await this.blockchainService.isOrg(await this.blockchainService.getUserAddress());
        
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
}
