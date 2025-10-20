import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet></router-outlet>`,
  styles: []
})
export class AppComponent implements OnInit {
  title = 'planning-poker';

  ngOnInit(): void {
    // Helpful diagnostics when the SPA loads (deep links / route hits)
    console.log('[APP] AppComponent initialized');
    console.log('[APP] window.location:', {
      href: window.location.href,
      origin: window.location.origin,
      pathname: window.location.pathname,
      hostname: window.location.hostname,
      protocol: window.location.protocol,
      port: window.location.port,
    });
    console.log('[APP] environment.wsUrl (build-time):', environment.wsUrl);
  }
}
