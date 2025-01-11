import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HousingLocation } from '../housing-location';
import { HousingService } from '../housing.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <article>
      <img
        class="listing-photo"
        [src]="housingLocation?.photo"
        alt="Photo of {{housingLocation?.name}}"
      >
      <section class="listing-description">
        <h2 class="listing-heading">{{housingLocation?.name}}</h2>
        <p class="listing-location">
          {{housingLocation?.city}}, {{housingLocation?.state}}
        </p>
      </section>
      <section class="listing-features">
        <h2 class="section-heading">About this housing Location</h2>
        <ul>
          <li>Units available: {{housingLocation?.availableUnits}}</li>
          <li>Does this location have WiFi: {{housingLocation?.wifi}}</li>
          <li>Does this location have laundry: {{housingLocation?.laundry}}</li>
        </ul>
      </section>
      <section class="listing-apply">
        <h2 class="section-heading">Apply now to live here</h2>
        <form [formGroup]="formApply" (submit)="submitApplication()">
          <label for="first-name">First name</label>
          <input type="text" id="first-name" formControlName="firstName">
          <label for="last-name">Last name</label>
          <input type="text" id="last-name" formControlName="lastName">
          <label for="email">Email</label>
          <input type="email" id="email" formControlName="email">
          <button type="submit" class="primary">Apply now</button>
        </form>
      </section>
    </article>
  `,
  styleUrls: ['./details.component.css']
})
export class DetailsComponent {
  route: ActivatedRoute = inject(ActivatedRoute);
  housingService = inject(HousingService);
  housingLocation: HousingLocation | undefined;
  formApply = new FormGroup({
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    email: new FormControl(''),
  });
  constructor() {
    const housingLocationId = Number(this.route.snapshot.params['id']);
    this.housingService.getHousingLocationById(housingLocationId)
      .then((housingLocation) => {
        this.housingLocation = housingLocation;
      });
  }

  submitApplication() {
    this.housingService.submitApplication(
      this.formApply.value.firstName ?? '',
      this.formApply.value.lastName ?? '',
      this.formApply.value.email ?? ''
    );
  }
}
