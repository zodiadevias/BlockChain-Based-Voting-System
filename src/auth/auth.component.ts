import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BlockchainService } from '../blockchain.service';
import { Router } from '@angular/router';
import emailjs, { send, type EmailJSResponseStatus } from '@emailjs/browser';


@Component({
  selector: 'app-auth',
  imports: [CommonModule, FormsModule],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {
  
  
  public reg_1 = true;
  public register = false;
  public voter = false;
  public organizer = false;
  public success = '';

  

  isOtp = false;
  otp = '';
  randomOTP: number = Math.floor(Math.random() * 10000);

  constructor(private blockchainService: BlockchainService,
    private router: Router
  ) { }

  async ngOnInit(): Promise<void> {
    // await this.blockchainService.loadBlockchain(); pending fix for onload

    // if (this.blockchainService.signer) {
    //   this.router.navigate(['/dashboard']);
    // }
  }

  
  toggleOTP(){
    if ((document.getElementById('name') as HTMLInputElement).value == '' || (document.getElementById('email') as HTMLInputElement).value == '') return;
    this.isOtp = true;
    this.randomOTP = Math.floor(Math.random() * 10000);
    
    const templateParams = {
      passcode: this.randomOTP,
      email: (document.getElementById('email') as HTMLInputElement).value,
    };

    emailjs.send('blockvote', 'template_q1zygbv', templateParams, 'M-Lel7Aav1F3ztGZV')
    .then((response) => {
      console.log('SUCCESS!', response.status, response.text);

    })
    .catch((err) => {
      console.log('FAILED...', err);
    });
  }

  //LOGIN WITH METAMASK
  async login() {
    //LOAD BLOCKCHAIN
    await this.blockchainService.loadBlockchain();
    //CHECKS IF SIGNER RETURNS TRUE
    if (this.blockchainService.signer) {
      const user = await this.blockchainService.getUserAddress();
      const isUser = await this.blockchainService.userExists(user);
      const isOrg = await this.blockchainService.isOrg(user);
      //IF TRUE, REDIRECTS TO DASHBOARD
      if (isUser || isOrg){
        if (isUser){
          localStorage.clear();
          localStorage.setItem('user', 'true');
        }
        if (isOrg){
          localStorage.clear();
          localStorage.setItem('user', 'false');
        }
        this.register = false;
        this.router.navigate(['/dashboard']);
      }else{
        this.register = true;
      }
    }
  }

  //REGISTRATION
  async registerUser(isOrg: boolean){
    
    const userName :string = (document.getElementById('name') as HTMLInputElement).value;
    const email :string = (document.getElementById('email') as HTMLInputElement).value;
    await this.blockchainService.loadBlockchain();
    const userAddress = await this.blockchainService.getUserAddress();
    const io = await this.blockchainService.isOrg(userAddress);
    const iv = await this.blockchainService.userExists(userAddress);
    //CHECKS IF THE CREDENTIALS ARE EITHER ORGANIZATION OR VOTER
    if (!io && !iv) {
      //ORGANIZATION
      if (isOrg == true){
        const orgName :string = (document.getElementById('orgName') as HTMLInputElement).value;
        if (userName != '' && email != '' && orgName != '') {
          this.success = 'Processing...'
          await this.blockchainService.addOrg(orgName, userName, email);
          const isOrganizer = await this.blockchainService.isOrg(userAddress);
          if (isOrganizer){
            localStorage.setItem('user', 'false');
            this.success = 'Organizer registered successfully';
            setTimeout(() => {
              this.router.navigate(['/dashboard']);
            }, 3000);
          }
        }
      }
      //VOTER
      else if (isOrg == false){
        if(this.otp == (this.randomOTP).toString()){
          if (userName != '' && email != '') {
            this.success = 'Processing...'
            await this.blockchainService.addUser(userAddress, userName, email);
            const isUser = await this.blockchainService.userExists(userAddress);
            if (isUser){
              localStorage.setItem('user', 'true');
              this.success = 'Voter registered successfully';
              setTimeout(() => {
                this.router.navigate(['/dashboard']);
              }, 3000);
            }
          }
        }else{
          this.success = 'Incorrect OTP';
          
        }
        
      }
    }

  }

  async toggleVoter(){
    await this.blockchainService.loadBlockchain();
    const userAddress = await this.blockchainService.getUserAddress();
    const isOrg = await this.blockchainService.isOrg(userAddress);
    const isUser = await this.blockchainService.userExists(userAddress);
    if (!isOrg && !isUser){
      this.reg_1 = false;
      this.voter = true;
    }else{
      location.reload();
    }
  }

  async toggleOrganizer(){
    await this.blockchainService.loadBlockchain();
    const userAddress = await this.blockchainService.getUserAddress();
    const isOrg = await this.blockchainService.isOrg(userAddress);
    const isUser = await this.blockchainService.userExists(userAddress);
    if (!isOrg && !isUser){
      this.reg_1 = false;
      this.organizer = true;
    }else{
      location.reload();
    }
  }
}

