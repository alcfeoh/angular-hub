import { Component, inject } from '@angular/core';
import { RouteMeta } from '@analogjs/router';
import { SupabaseService } from '../../services/supabase.service';
import { ButtonModule } from 'primeng/button';

export const routeMeta: RouteMeta = {
  meta: [
    {
      name: 'description',
      content: 'Curated list of Angular Talks',
    },
  ],
};

@Component({
  selector: 'app-talks',
  standalone: true,
  template: `
    <aside
      class="h-36 w-full flex flex-col justify-center items-center mb-4 md:mb-8 bg-no-repeat bg-auto md:bg-cover px-4"
      style="background-image: url(/assets/images/hero.webp);"
    >
      <h1 class="title text-4xl sm:text-5xl">ANGULAR HUB</h1>
      <h2 class="text-2xl text-center">Curated list of Call for Papers</h2>
    </aside>
    <p-button label="Sign in with GitHub" (click)="signIn()"></p-button>
  `,
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
        align-items: center;
      }
    `,
  ],
  imports: [ButtonModule],
})
export default class CallForPapersComponent {
  readonly #supabaseService = inject(SupabaseService);

  signIn() {
    this.#supabaseService.signInWithGithub();
  }
}
