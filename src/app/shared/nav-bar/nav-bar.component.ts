import { Component } from '@angular/core';

import { CompanysService } from 'src/app/services/companys.service';
import { TrackingService } from 'src/app/services/tracking.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent {






  constructor( private companysService :CompanysService, public trackingService : TrackingService, public authService : AuthService  ) { }

  ngOnInit( ): void {



  }




}
