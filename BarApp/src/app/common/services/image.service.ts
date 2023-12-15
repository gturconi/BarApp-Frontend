import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";

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
}
