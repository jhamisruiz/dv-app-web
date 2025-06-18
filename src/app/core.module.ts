
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpConfig } from './shared/interceptors/http.interceptor';
import { AuthInterceptor } from './shared/interceptors/auth.interceptor';
import { ViewsModule } from '@views/views.module';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';
import { environment } from 'src/environments/environment';
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ViewsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    // cambio docker
    LoggerModule.forRoot({
      level: !environment.production ? NgxLoggerLevel.TRACE : NgxLoggerLevel.OFF,
      disableFileDetails: true,
      //colorScheme: ['purple', 'teal', 'deepskyblue', 'gray', 'orange', 'red', 'red'],
      timestampFormat: 'dd/MM/yyyy hh:mm',
    }),
  ],
  exports: [
    ViewsModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpConfig,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
})
export class CoreModule { }
