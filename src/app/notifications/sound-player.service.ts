import { Injectable } from '@angular/core';

// eslint-disable-next-line no-shadow
export enum Sound {
  readyUp = 'ready_up.wav',
  fight = 'fight.wav',
  cmonToughGuy = 'cmon_tough_guy.wav',
}

@Injectable({
  providedIn: 'root'
})
export class SoundPlayerService {

  private sounds = new Map<string, HTMLAudioElement>();

  constructor() {
    Object.values(Sound).forEach(sound => {
      const soundFile = `/assets/sounds/${sound}`;
      const audio = new Audio(soundFile);
      this.sounds.set(sound, audio);
    });
  }

  playSound(sound: Sound) {
    const audio = this.sounds.get(sound);
    audio.play();
  }

}
