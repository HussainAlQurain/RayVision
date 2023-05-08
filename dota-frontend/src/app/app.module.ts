import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './components/header/header.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NbThemeModule, NbLayoutModule } from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
<<<<<<< HEAD
=======
import { HeaderComponent } from './components/header/header.component';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule} from '@angular/material/icon';
>>>>>>> bug-free

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    NbThemeModule.forRoot({ name: 'dark' }),
    NbLayoutModule,
<<<<<<< HEAD
    NbEvaIconsModule
    
=======
    NbEvaIconsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,

  ],
  providers: [
  
>>>>>>> bug-free
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
