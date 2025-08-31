import { Component } from '@angular/core';
import { ModalService } from '../../../service/modal/modal-service';
import { NgIf } from '@angular/common';

interface ModalState {
  show: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
}

@Component({
  selector: 'app-modal-component',
  imports: [NgIf],
  templateUrl: './modal-component.html',
  styleUrls: ['./modal-component.css'],
})
export class ModalComponent {
  modalState: ModalState = {
    show: false,
    title: '',
    message: '',
    onConfirm: () => {}, // Default empty function
  };

  constructor(public modalService: ModalService) {
    this.modalService.modalState$.subscribe((state) => {
      // Provide default values for optional properties
      this.modalState = {
        show: state.show,
        title: state.title || '',
        message: state.message || '',
        onConfirm: state.onConfirm || (() => {}),
      };
    });
  }

  onConfirm() {
    this.modalState.onConfirm();
    this.modalService.hide();
  }

  onBackdropClick() {
    this.modalService.hide();
  }
}
