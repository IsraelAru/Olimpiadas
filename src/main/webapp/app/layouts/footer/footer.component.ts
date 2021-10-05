import { Component } from '@angular/core';
import { faHeartBroken } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'jhi-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {
  faHeartBroken = faHeartBroken;
}
