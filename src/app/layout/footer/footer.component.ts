import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  @Input() displayName: any;
  @Input() menuContentToggle: any;
  @Input() mouseIsOver: any;

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  // showInstitute(){

  // }

}
