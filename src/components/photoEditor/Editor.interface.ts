export interface IPhotoEditor{

  onBrightness(data: any, brightness: number): any;
  onContrast(data: any, contrast: number): any;
  onSharpen(data: any, sharpen: number, imageWidth: number, imageHeight: number): any;
  onGrayEffect(data: any): any;
  onVintageEffect(ctx: any, imageWidth: number, imageHeight: number): void;
  onSepiaEffect(data: any): any;
}
