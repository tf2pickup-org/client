import {
  Component,
  ChangeDetectionStrategy,
  Input,
  ViewChild,
  ElementRef,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import {
  Chart,
  ArcElement,
  PieController,
  Legend,
  Title,
  Tooltip,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

interface Data {
  label: string;
  value: number;
}

Chart.register(
  Legend,
  Title,
  Tooltip,
  ArcElement,
  PieController,
  ChartDataLabels,
);

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PieChartComponent implements OnChanges {
  private chart: Chart;
  private colors: string[] = [
    '#ff4b4e',
    '#46c4ff',
    '#47ff63',
    '#fff346',
    '#da46ff',
    '#46ffff',
    '#45ff8f',
    '#ff4a98',
    '#ff8d4b',
  ];

  @Input()
  data: Data[];

  @Input()
  width = 500;

  @Input()
  height = 500;

  @ViewChild('chart')
  chartContainer: ElementRef;

  ngOnChanges(changes: SimpleChanges) {
    if (!!changes.data?.currentValue) {
      this.drawChart();
    }
  }

  private drawChart() {
    this.chart = new Chart(this.chartContainer.nativeElement, {
      type: 'pie',
      data: {
        labels: this.data.map(d => d.label),
        datasets: [
          {
            label: 'most played maps',
            data: this.data.map(d => d.value),
            backgroundColor: this.colors,
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false,
          },
          title: {
            display: false,
          },
          datalabels: {
            display: true,
            color: 'white',
            font: {
              weight: 'bold',
            },
            // labels: {
            //   title: {
            //     color: 'white',
            //     font: {
            //       weight: 'bold',
            //     },
            //   },
            //   value: {
            //     color: 'gray',
            //   },
            // },
          },
        },
      },
    });
  }
}
