import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ModalService {
  private modalState = new BehaviorSubject<{
    show: boolean;
    title: string;
    message: string;
    onConfirm?: () => void;
  }>({ show: false, title: '', message: '' });
  modalState$ = this.modalState.asObservable();

  show(title: string, message: string, onConfirm?: () => void) {
    this.modalState.next({ show: true, title, message, onConfirm });
  }

  hide() {
    this.modalState.next({ show: false, title: '', message: '' });
  }
}
