import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app.routing';
import { AppComponent } from './app.component';
import { CoreModule } from './core.module';
import { SharedModule } from './shared/shared.module';
import { StoreModule } from '@ngrx/store';
import { environment } from 'src/environments/environment';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { ROOT_REDUCERS } from './store/app.state';
import { EffectsModule } from '@ngrx/effects';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { ROOT_EFFECTS } from '@store/app.root.effects';
registerLocaleData(localeEs, 'es');
@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    AppRoutingModule,
    StoreModule.forRoot(ROOT_REDUCERS),
    //StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: !isDevMode() }),
    // Effectos
    !environment.production ? StoreDevtoolsModule.instrument() : [],
    EffectsModule.forRoot(ROOT_EFFECTS),
    CoreModule,
    SharedModule,
  ],
  providers: [{ provide: LOCALE_ID, useValue: 'es' }],
  bootstrap: [AppComponent],
})
export class AppModule { }
