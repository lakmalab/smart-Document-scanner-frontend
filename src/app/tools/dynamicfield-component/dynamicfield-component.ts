import { NgSwitch, NgSwitchCase } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-dynamicfield-component',
  imports: [NgSwitchCase,NgSwitch],
  templateUrl: './dynamicfield-component.html',
  styleUrl: './dynamicfield-component.css'
})
export class DynamicfieldComponent {
 @Input() config: any;
}
