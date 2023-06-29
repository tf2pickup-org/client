import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ConfigurationService } from '@app/configuration/configuration.service';
import { BehaviorSubject } from 'rxjs';
import { ConfigurationEntry } from '@app/configuration/models/configuration-entry';

@Component({
  selector: 'app-configuration-edit',
  templateUrl: './configuration-edit.component.html',
  styleUrls: ['./configuration-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfigurationEditComponent implements OnInit {
  readonly entries = new BehaviorSubject<ConfigurationEntry[]>([]);

  constructor(private readonly configurationService: ConfigurationService) {}

  ngOnInit() {
    this.configurationService
      .fetchValues()
      .subscribe(entries =>
        this.entries.next(entries.sort((a, b) => a.key.localeCompare(b.key))),
      );
  }

  // skipcq: JS-0105
  hasDefaultValue<T>(entry: { value?: T; defaultValue?: T }) {
    return JSON.stringify(entry.value) === JSON.stringify(entry.defaultValue);
  }

  saveEntry(key: string, value: string | number) {
    if (typeof value !== 'string') {
      throw new Error('invalid');
    }

    this.configurationService
      .storeValues({
        key,
        value: JSON.parse(value),
      })
      .subscribe(updated => {
        const entries = [
          ...this.entries.value.filter(
            entry => !updated.find(u => u.key === entry.key),
          ),
          ...updated,
        ].sort((a, b) => a.key.localeCompare(b.key));
        this.entries.next(entries);
      });
  }
}
