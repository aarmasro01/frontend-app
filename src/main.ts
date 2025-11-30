import { bootstrapApplication } from '@angular/platform-browser';
// Cambios aquí: Añadimos 'withHashLocation' a la importación
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules, withHashLocation } from '@angular/router'; 
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { provideHttpClient } from '@angular/common/http'; 
import { addIcons } from 'ionicons';
import { cartOutline, bookOutline, removeOutline, addOutline, trashOutline} from 'ionicons/icons';

addIcons({ cartOutline, bookOutline, removeOutline, addOutline, trashOutline });

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    // CORRECCIÓN CLAVE: Agregamos withHashLocation()
    provideRouter(routes, withHashLocation(), withPreloading(PreloadAllModules)), 
    provideHttpClient(),
  ],
});