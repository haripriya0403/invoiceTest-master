import { Component } from '@angular/core';
import { RouterLinkActive, RouterLink } from '@angular/router';

@Component({
  selector: 'app-navigation',
  standalone: true, // Declare as standalone component
  imports: [RouterLinkActive, RouterLink], // Import necessary modules
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent {
  activeLink: string = 'home';

  setActiveLink(link: string) {
    this.activeLink = link;
  }
}
