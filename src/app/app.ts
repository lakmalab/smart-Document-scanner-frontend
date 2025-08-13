import { AfterViewInit, Component, ViewChild, ViewContainerRef } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './pages/header/header';
import { Footer } from './pages/footer/footer';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { CustomToastService } from './service/toast/custom-toast.service';
import { ModalComponent } from "./tools/modal/modal-component/modal-component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer, NgxSkeletonLoaderModule, ModalComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements AfterViewInit{
  protected title = 'SDS-Frontend';
  @ViewChild('toastContainer', { read: ViewContainerRef }) toastVCR!: ViewContainerRef;

  constructor(private toastService: CustomToastService) {}

  ngAfterViewInit() {
    this.toastService.setRootViewContainerRef(this.toastVCR);
  }
}
