import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from "../../shared/components/footer/footer";
import { NavbarComponent } from "../../shared/components/navbar/navbar";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FooterComponent, NavbarComponent],
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})
export class HomeComponent {


}