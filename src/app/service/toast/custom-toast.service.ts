// custom-toast.service.ts
import { Injectable, ComponentRef, ViewContainerRef } from '@angular/core';
import { CustomToastComponent } from '../../tools/CustomToastComponent/custom-toast-component/custom-toast-component';

@Injectable({
  providedIn: 'root',
})
export class CustomToastService {
  private rootViewContainer?: ViewContainerRef;
  private toasts: ComponentRef<CustomToastComponent>[] = [];

  setRootViewContainerRef(viewContainerRef: ViewContainerRef) {
    this.rootViewContainer = viewContainerRef;
  }

  show(
    message: string,
    type:
      | 'info'
      | 'success'
      | 'warning'
      | 'error'
      | 'happy'
      | 'sad'
      | 'save'
      | 'delete'
      | 'confuse' = 'info',
    icon?: string,
    duration: number = 5000
  ) {
    if (!this.rootViewContainer) {
      console.error('Root view container not set for CustomToastService');
      return;
    }

    const componentRef =
      this.rootViewContainer.createComponent(CustomToastComponent);
    componentRef.instance.message = message;
    componentRef.instance.type = type;
    componentRef.instance.icon = icon || '';
    componentRef.instance.duration = duration;

    componentRef.instance.close = () => {
      this.removeToast(componentRef);
    };

    this.toasts.push(componentRef);

    if (duration > 0) {
      setTimeout(() => {
        this.removeToast(componentRef);
      }, duration);
    }
  }

  private removeToast(toastRef: ComponentRef<CustomToastComponent>) {
    const index = this.toasts.indexOf(toastRef);
    if (index >= 0) {
      this.toasts.splice(index, 1);
      toastRef.destroy();
    }
  }
}
