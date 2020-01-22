import { Injectable } from '@angular/core';

export enum Sound {
  ReadyUp = 'ready_up.wav',
  Fight = 'fight.wav',
  CmonToughGuy = 'cmon_tough_guy.wav',
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
