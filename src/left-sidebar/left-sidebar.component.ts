import { Component, inject } from '@angular/core';
import { input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import {MatIconModule} from '@angular/material/icon'



@Component({
  selector: 'app-left-sidebar',
  imports: [RouterModule, CommonModule, MatIconModule],
  templateUrl: './left-sidebar.component.html',
  styleUrl: './left-sidebar.component.css'
})
export class LeftSidebarComponent {
  isLeftSidebarCollapsed = input.required<boolean>();
  changeIsLeftSidebarCollapsed = output<boolean>();
  whatAmI = localStorage.getItem('user');
  router = inject(Router);

  toggleCollapse(): void {
    this.changeIsLeftSidebarCollapsed.emit(!this.isLeftSidebarCollapsed());
  }

  closeSidenav(): void {
    this.changeIsLeftSidebarCollapsed.emit(true);
  }

  logout(){
    const confirmLogout = confirm('Are you sure you want to logout?');
    if (!confirmLogout) return;
    localStorage.clear();
    this.router.navigate(['/auth']);
  }

}
