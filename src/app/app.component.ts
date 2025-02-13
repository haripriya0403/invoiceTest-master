import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavigationComponent } from './navigation/navigation.component'; // Import the standalone NavigationComponent
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,  // Declare AppComponent as standalone
  imports: [RouterOutlet, NavigationComponent,CommonModule ],  // Import RouterOutlet and NavigationComponent
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'invoiceTest';
}
