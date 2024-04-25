import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  Barcode,
  BarcodeFormat,
  BarcodeScanner,
  LensFacing,
  StartScanOptions,
} from '@capacitor-mlkit/barcode-scanning';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-barcode-scanning',
  template: `
    <ion-buttons slot="end">
      <ion-button (click)="closeModal()">
        <ion-icon name="close"></ion-icon>
      </ion-button>
    </ion-buttons>

    <div #square class="square"></div>
    <ion-fab
      *ngIf="isTorchAvailable"
      slot="fixed"
      horizontal="end"
      vertical="bottom"
    >
      <ion-fab-button (click)="toggleTorch()">
        <ion-icon name="flashlight"></ion-icon>
      </ion-fab-button>
    </ion-fab>
  `,
  styles: [
    `
      .square {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        border-radius: 16px;
        width: 200px;
        height: 200px;
        border: 6px solid white;
        box-shadow: 0 0 0 4000px rgba(0, 0, 0, 0.3);
      }

      // Hide all elements
      body.barcode-scanner-active {
        visibility: hidden;
        --background: transparent;
        --ion-background-color: transparent;
      }

      // Show only the barcode scanner modal
      .barcode-scanner-modal {
        visibility: visible;
      }

      @media (prefers-color-scheme: dark) {
        .barcode-scanner-modal {
          --background: transparent;
          --ion-background-color: transparent;
        }
      }
    `,
  ],
})
export class BarcodeScanningModalComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @Input()
  public formats: BarcodeFormat[] = [];
  @Input()
  public lensFacing: LensFacing = LensFacing.Back;

  @ViewChild('square')
  public squareElement: ElementRef<HTMLDivElement> | undefined;

  public isTorchAvailable = false;

  constructor(
    private readonly ngZone: NgZone,
    private modalController: ModalController
  ) {}

  public ngOnInit(): void {
    BarcodeScanner.isTorchAvailable().then(result => {
      this.isTorchAvailable = result.available;
    });
  }

  public ngAfterViewInit(): void {
    setTimeout(() => {
      this.startScan();
    }, 250);
  }

  public ngOnDestroy(): void {
    this.stopScan();
  }

  public async closeModal(barcode?: Barcode): Promise<void> {
    this.modalController.dismiss({ barcode });
  }

  public async toggleTorch(): Promise<void> {
    await BarcodeScanner.toggleTorch();
  }

  private async startScan(): Promise<void> {
    // Hide everything behind the modal (see `src/theme/variables.scss`)
    document.querySelector('body')?.classList.add('barcode-scanning-active');

    const options: StartScanOptions = {
      formats: this.formats,
      lensFacing: this.lensFacing,
    };

    const squareElementBoundingClientRect =
      this.squareElement?.nativeElement.getBoundingClientRect();
    const scaledRect = squareElementBoundingClientRect
      ? {
          left: squareElementBoundingClientRect.left * window.devicePixelRatio,
          right:
            squareElementBoundingClientRect.right * window.devicePixelRatio,
          top: squareElementBoundingClientRect.top * window.devicePixelRatio,
          bottom:
            squareElementBoundingClientRect.bottom * window.devicePixelRatio,
          width:
            squareElementBoundingClientRect.width * window.devicePixelRatio,
          height:
            squareElementBoundingClientRect.height * window.devicePixelRatio,
        }
      : undefined;
    const detectionCornerPoints = scaledRect
      ? [
          [scaledRect.left, scaledRect.top],
          [scaledRect.left + scaledRect.width, scaledRect.top],
          [
            scaledRect.left + scaledRect.width,
            scaledRect.top + scaledRect.height,
          ],
          [scaledRect.left, scaledRect.top + scaledRect.height],
        ]
      : undefined;
    const listener = await BarcodeScanner.addListener(
      'barcodeScanned',
      async event => {
        this.ngZone.run(() => {
          const cornerPoints = event.barcode.cornerPoints;
          if (detectionCornerPoints && cornerPoints) {
            if (
              detectionCornerPoints[0][0] > cornerPoints[0][0] ||
              detectionCornerPoints[0][1] > cornerPoints[0][1] ||
              detectionCornerPoints[1][0] < cornerPoints[1][0] ||
              detectionCornerPoints[1][1] > cornerPoints[1][1] ||
              detectionCornerPoints[2][0] < cornerPoints[2][0] ||
              detectionCornerPoints[2][1] < cornerPoints[2][1] ||
              detectionCornerPoints[3][0] > cornerPoints[3][0] ||
              detectionCornerPoints[3][1] < cornerPoints[3][1]
            ) {
              return;
            }
          }
          listener.remove();
          this.closeModal(event.barcode);
        });
      }
    );
    await BarcodeScanner.startScan(options);
  }

  private async stopScan(): Promise<void> {
    // Show everything behind the modal again
    document.querySelector('body')?.classList.remove('barcode-scanning-active');

    await BarcodeScanner.stopScan();
  }
}
