import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { LocalNotifications } from '@capacitor/local-notifications';
import { ToastController, ModalController } from '@ionic/angular';
import { HoraSelectorComponent } from 'src/app/components/hora-selector.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: false
})
export class ProfilePage implements OnInit {
  user: { name: string; email: string; isLoggedIn?: boolean } = { name: '', email: '' };
  photo: string | null = null;
  horaNotificacion: string = new Date().toISOString();

  constructor(
    private router: Router,
    private toastCtrl: ToastController,
    private modalCtrl: ModalController
  ) {}

  async ngOnInit() {
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

    await this.loadPhoto();

    const horaGuardada = localStorage.getItem('horaNotificacion');
    if (horaGuardada) {
      const hoy = new Date();
      const [h, m] = horaGuardada.split(':').map(Number);
      hoy.setHours(h, m, 0, 0);
      this.horaNotificacion = hoy.toISOString();
    }

    await this.solicitarPermisoNotificaciones();

    // --- Aquí agregamos la creación del canal de notificaciones ---
    await LocalNotifications.createChannel({
      id: 'fitplanner-channel',
      name: 'Notificaciones FitPlanner',
      importance: 5,
      description: 'Canal para notificaciones diarias de rutinas',
    });
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

  async mostrarSelectorHora() {
    const modal = await this.modalCtrl.create({
      component: HoraSelectorComponent,
      componentProps: {
        horaActual: this.horaNotificacion
      }
    });

    await modal.present();
  }

  private async solicitarPermisoNotificaciones() {
    try {
      const permission = await LocalNotifications.requestPermissions();
      if (permission.display !== 'granted') {
        console.warn('Permiso de notificaciones denegado');
      }
    } catch (error) {
      console.error('Error solicitando permisos de notificación:', error);
    }
  }
}
