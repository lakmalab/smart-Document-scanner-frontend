
import { NgFor, NgIf } from '@angular/common';
import { Component, Input  } from '@angular/core';


@Component({
  selector: 'app-template-card',
  imports: [NgIf,NgFor],
  templateUrl: './template-card.html',
  styleUrl: './template-card.css'
})
export class TemplateCardComponent {
  @Input() template: any;
}
