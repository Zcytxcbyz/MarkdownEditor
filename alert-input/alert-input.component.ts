import {AfterViewInit, Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-alert-input',
  templateUrl: './alert-input.component.html',
  styleUrls: ['./alert-input.component.css']
})
export class AlertInputComponent implements OnInit, AfterViewInit {
  @Input() enable = '';
  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
  }

  SetAlertLeft(alertContent: HTMLDivElement): string{
    return `${(window.innerWidth - alertContent.clientWidth) / 2}px`;
  }
  SetAlertTop(alertContent: HTMLDivElement): string{
    return `${(window.innerHeight - alertContent.clientHeight) / 2}px`;
  }
  EnabledAlert(): boolean{
    return this.enable.toLocaleLowerCase() === 'true';
  }
}
