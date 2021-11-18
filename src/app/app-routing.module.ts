import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PhotoGalleryComponent } from './photo-gallery/photo-gallery.component';


const routes: Routes = [
  {path: '', redirectTo: '/gallery', pathMatch: 'full'},
  {path: 'gallery', component: PhotoGalleryComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
