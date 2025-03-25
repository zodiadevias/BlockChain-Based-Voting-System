import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BlockchainService } from '../blockchain.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-auth',
  imports: [CommonModule, FormsModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent {

  public register = false;
  public success = '';
  
  constructor(private blockchainService: BlockchainService,
    private router: Router
  ) {
    // if (GlobalsService.isSignedin == true) {
    //   this.router.navigate(['/dashboard']);
    // }
    // console.log(GlobalsService.isSignedin);
  }

  async ngOnInit(): Promise<void> {
    // await this.blockchainService.loadBlockchain();
    if (this.blockchainService.signer) {
      this.router.navigate(['/dashboard']);
    }
  }


  gotoDashboard(){
    this.router.navigate(['/dashboard']);
    this.register = false;
  }

  async login() {
    await this.blockchainService.loadBlockchain();
    if (this.blockchainService.signer) {
      const user = await this.blockchainService.getUserAddress();
      const isUser = await this.blockchainService.userExists(user);
      console.log(user);
      console.log(isUser);
      if (!isUser){
        this.register = true;
      }else{
        this.register = false;
        this.router.navigate(['/dashboard']);
      }
    }
  }

  async registerUser() {
    const userAddress = await this.blockchainService.getUserAddress();
    const isUser = await this.blockchainService.userExists(userAddress);
    const userName :string = (document.getElementById('name') as HTMLInputElement).value;
    const email :string = (document.getElementById('email') as HTMLInputElement).value;
    console.log(userName);
    console.log(email);
    await this.blockchainService.addUser(userAddress, userName, email);
    if (isUser){
      this.router.navigate(['/dashboard']);
    }else{
      this.success = 'User registered successfully';
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 3000);
    }
  }  


  

}


//TODO:
// 1. Add user to blockchain - DONE
// 2. Check if user exists in blockchain - DONE
// 3. Check if user is logged in - DONE
// 4. Redirect to dashboard if user is logged in - DONE
// 5. Redirect to login if user is not logged in - DONE
// 6. Make Database
// 7. Connect Database
// 8. Make API
// 9. Connect API
// 10. Dashboard page
// 11. Candidates page
// 12. Vote page
// 13. Results page
