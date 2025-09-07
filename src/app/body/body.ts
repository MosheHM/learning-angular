import { Component } from '@angular/core';
import { Left } from './left/left';
import { Right } from './right/right';

@Component({
  selector: 'app-body',
  imports: [Left, Right],
  templateUrl: './body.html',
  styleUrl: './body.scss'
})
export class Body {

}
