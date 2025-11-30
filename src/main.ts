import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { provideHttpClient } from '@angular/common/http'; // ✅ Nuevo import
import { addIcons } from 'ionicons';
import { cartOutline, bookOutline, removeOutline, addOutline, trashOutline} from 'ionicons/icons';

addIcons({ cartOutline, bookOutline, removeOutline, addOutline, trashOutline });

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideHttpClient(), // ✅ Así se usa ahora en proyectos standalone
  ],
});
