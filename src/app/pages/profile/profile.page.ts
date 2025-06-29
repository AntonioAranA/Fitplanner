import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: false
})
export class ProfilePage implements OnInit {
  user: { name: string; email: string; isLoggedIn?: boolean } = { name: '', email: '' };
  photo: string | null = null;  // Base64 string para mostrar en <img>

  constructor(private router: Router) {}

  ngOnInit() {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      if (user.isLoggedIn) {
        this.user = user;
      } else {
        this.router.navigateByUrl('/login', { replaceUrl: true });
      }
    } else {
      this.router.navigateByUrl('/login', { replaceUrl: true });
    }

    this.loadPhoto();
  }

  logout() {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      user.isLoggedIn = false;
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.removeItem('ingresado');
    }
    this.router.navigateByUrl('/login', { replaceUrl: true });
  }

  async takePhoto() {
    try {
      const photo = await Camera.getPhoto({
        quality: 90,
        resultType: CameraResultType.Base64,
        source: CameraSource.Prompt
      });

      if (photo.base64String) {
        await this.savePhoto(photo.base64String);
      }
    } catch (error) {
      console.error('Error tomando la foto:', error);
    }
  }

  private async savePhoto(base64Data: string) {
    try {
      await Filesystem.writeFile({
        path: 'profile_photo.jpeg',
        data: base64Data,
        directory: Directory.Data
      });

      // Prepara el base64 para mostrarlo en <img>
      this.photo = 'data:image/jpeg;base64,' + base64Data;

      localStorage.setItem('profile_photo_base64', this.photo);
    } catch (error) {
      console.error('Error guardando la foto:', error);
    }
  }

  private async loadPhoto() {
    const photoBase64 = localStorage.getItem('profile_photo_base64');
    if (photoBase64) {
      this.photo = photoBase64;
    }
  }
}
