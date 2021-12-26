import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { MenuController, Platform } from '@ionic/angular';
import { AuthenticationService } from './services/authentication.service';
import { CustomTranslateService } from './shared/services/custom-translate.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public hide_tab: boolean = true;
  public activeIndex;
  any;
  public activePageTitle = 'Home';
  public pages = [
    {
      title: 'Home',
      url: '/home',
      icon: 'Home-White.svg',
    },
    {
      title: 'Tour management',
      url: '/tour-management',
      icon: 'Tour Management-White.svg',
    },
    /*{
      title: 'Driver management',
      url: '',
      icon: 'receipt',
    },*/
    {
      title: 'Vehicle management',
      url: '/vehicle-management',
      icon: 'Vehicle Management-White.svg',
    },
    {
      title: 'Statistics',
      url: '/statistics',
      icon: 'Statistics-White.svg',
    },
    /* {
      title: 'Driver Account',
      url: '/account-driver',
      icon: 'car',
    },*/
    {
      title: 'Company Account',
      url: '/company-account',
      icon: 'Company Account-White.svg',
    },
    {
      title: 'Settings',
      url: '/options',
      icon: 'Settings-White.svg',
    },
  ];

  constructor(
    private statusBar: StatusBar,
    private plataform: Platform,
    private customTranslateService: CustomTranslateService,
    private router: Router,
    private authenticationService: AuthenticationService,
    private menuCtrl: MenuController
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.plataform.ready().then(() => {
      /*this.authenticationService.authState.subscribe((state) => {
        if (state) {
          this.router.navigate(['home']);
        } else {
          this.router.navigate(['login']);
        }
      });*/
      this.statusBar.styleDefault();
      this.init();
    });
  }

  public removeElement(title: string): void {
    this.pages.forEach((element, index) => {
      if (element.title == title) {
        this.pages.splice(index, 1);
      }
    });
  }

  public closeMenu() {
    console.log('deede');
    this.menuCtrl.close();
    //this.statusBar.hide();
  }

  private init(): void {
    if ('lang' in localStorage) {
      this.customTranslateService.currentLang.next(
        localStorage.getItem('lang')
      );
    } else {
      this.customTranslateService.currentLang.next('en');
    }
  }

  public logout() {
    this.authenticationService.logout();
  }
}
