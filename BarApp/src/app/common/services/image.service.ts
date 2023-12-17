import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";

@Injectable({
  providedIn: "root",
})
export class ImageService {
  constructor() {}

  getImage(imageBuffer: number[], imageFormat: string): Observable<string> {
    const blob = new Blob([new Uint8Array(imageBuffer)], {
      type: `image/${imageFormat}`,
    });
    const blobUrl = URL.createObjectURL(blob);
    return of(blobUrl);
  }

  async takePicture(promptLabelHeader: string) {
    return await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Prompt,
      promptLabelHeader,
      promptLabelPhoto: "Selecciona una imagen",
      promptLabelPicture: "Toma una foto",
    });
  }

  convertBase64ToAvatar(base64String: string) {
    const base64WithoutHeader = base64String.replace(
      /^data:image\/[a-z]+;base64,/,
      ""
    );

    const decodedBytes = atob(base64WithoutHeader);

    const byteArray = new Uint8Array(decodedBytes.length);
    for (let i = 0; i < decodedBytes.length; i++) {
      byteArray[i] = decodedBytes.charCodeAt(i);
    }

    const avatar = {
      data: Array.from(byteArray),
      type: base64String.split(";")[0].split("/")[1],
    };

    return avatar;
  }

  base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binaryString = window.atob(base64);
    const length = binaryString.length;
    const bytes = new Uint8Array(length);

    for (let i = 0; i < length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    return bytes.buffer;
  }
}
