import { Component, Input } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { LocalNotifications } from '@capacitor/local-notifications';

@Component({
  selector: 'app-hora-selector',
  template: `
    <ion-header>
      <ion-toolbar color="primary" class="animated-header">
        <ion-title>Configurar Notificación</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding ion-text-center fade-slide-up">
      <p class="subtitle">Selecciona la hora para la notificación diaria:</p>

      <ion-datetime
        [value]="horaTemporal"
        presentation="time"
        (ionChange)="onHoraSeleccionada($event)"
        size="cover"
        class="custom-datetime fade-slide-up delay-1"
      ></ion-datetime>

      <ion-button expand="block" color="secondary" (click)="guardar()" class="save-btn fade-slide-up delay-2">
        <ion-icon name="save-outline" slot="start"></ion-icon>
        Guardar Hora
      </ion-button>
    </ion-content>
  `,
  styleUrls: ['./hora-selector.component.scss'],
  standalone: false,
})
export class HoraSelectorComponent {
  @Input() horaActual!: string;
  horaTemporal: string = new Date().toISOString();

  constructor(
    private modalCtrl: ModalController,
    private toastCtrl: ToastController
  ) {}

  onHoraSeleccionada(event: any) {
    this.horaTemporal = event.detail.value;
  }

  async guardar() {
    const horaMinutos = this.horaTemporal?.substring(11, 16) ?? '08:00';
    localStorage.setItem('horaNotificacion', horaMinutos);

    const [hour, minute] = horaMinutos.split(':').map(Number);

    await LocalNotifications.cancel({ notifications: [{ id: 1 }] });
    await LocalNotifications.schedule({
      notifications: [
        {
          id: 1,
          title: '¡Hora de entrenar!',
          body: 'Recuerda completar tu rutina de hoy 💪',
          schedule: {
            on: { hour, minute },
            repeats: true,
          },
          channelId: 'fitplanner-channel',
        },
      ],
    });

    const toast = await this.toastCtrl.create({
      message: `Notificación programada a las ${horaMinutos}`,
      duration: 3000,
      color: 'success',
    });
    toast.present();

    this.modalCtrl.dismiss();
  }
}
