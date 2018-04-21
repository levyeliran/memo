import {IPhotoEditor} from "./Editor.interface";

export class Editor implements IPhotoEditor{
  constructor(){

  }

  /////////////////////////////////////////////////////////
  //https://vintagejs.com/
  onBrightness(data: any, brightness: number) :any{
    //https://www.html5rocks.com/en/tutorials/canvas/imagefilters/
    //Range is -100 to 100. Values < 0 will darken image while values > 0 will brighten.
    for (let i = 0; i < data.length; i += 4) {
      data[i] += brightness;
      data[i + 1] += brightness;
      data[i + 2] += brightness;
    }
    return data;
  }

  onContrast(data: any, contrast: number) :any{
    //https://www.html5rocks.com/en/tutorials/canvas/imagefilters/
    //https://en.wikipedia.org/wiki/Convolution
    //Range is -10 to 30. Values < 0 will decrease contrast while values > 0 will increase contrast.
    //The contrast adjustment values are a bit sensitive. While unrestricted, sane adjustment values are usually around 5-10.
    //calculate the adjustment value
    const adjust = Math.pow((contrast + 100) / 100, 2);
    for (let i = 0; i < data.length; i += 4) {
      //loop over r, g,b colors (without alpha)
      for (let y = 0; y < 3; y++) {
        let n = data[i + y];
        n /= 255;
        n -= 0.5;
        n *= adjust;
        n += 0.5;
        n *= 255;
        data[i + y] = n;
      }
    }
    return data;
  }

  onSharpen(data: any, sharpen: number, imageWidth: number, imageHeight: number) :any{
    //https://www.html5rocks.com/en/tutorials/canvas/imagefilters/
    //https://en.wikipedia.org/wiki/Convolution
    let src = data.slice(0);//clone the array
    const mixFactor = sharpen / 50; //mixFactor: [0.0, 2.0]
    const negW = 0 - mixFactor;
    const posW = 1 + (mixFactor * 4);
    const weights = // 3*3 convolution matrix in a range of (from 0 (no-effect) to -2 (max sharpen factor))
      [0, negW, 0,
        negW, posW, negW,
        0, negW, 0];
    const convDim = 3;
    const w = imageWidth;
    const h = imageHeight;
    var halfSide = Math.floor(convDim / 2);
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        let r = 0;
        let g = 0;
        let b = 0;
        const dstOff = (y * w + x) * 4;
        let srcOff = 0;
        for (let cy = 0; cy < convDim; cy++) {
          for (let cx = 0; cx < convDim; cx++) {
            const scy = y + cy - halfSide;
            const scx = x + cx - halfSide;
            if (scy >= 0 && scy < h && scx >= 0 && scx < w) {
              srcOff = (scy * w + scx) * 4;
              const wt = weights[cy * convDim + cx];
              r += src[srcOff] * wt;
              g += src[srcOff + 1] * wt;
              b += src[srcOff + 2] * wt;
            }
          }
        }

        //set the calculated values in the image destination array
        data[dstOff] = r;
        data[dstOff + 1] = g;
        data[dstOff + 2] = b;
      }
    }
    return data;
  }

  onGrayEffect(data: any){
    //http://spyrestudios.com/html5-canvas-image-effects-black-white/
    for (let i = 0; i < data.length; i += 4) {
      const grayScale = data[i] * .3 + data[i + 1] * .59 + data[i + 2] * .11;
      data[i] = grayScale; // red
      data[i + 1] = grayScale; // green
      data[i + 2] = grayScale; // blue
    }
    return data;
  }

  onVintageEffect(ctx: any, imageWidth: number, imageHeight: number){
    const w = imageWidth;
    const h = imageHeight;
    const outerRadius = Math.sqrt(Math.pow(w / 2, 2) + Math.pow(h / 2, 2));
    const vintageGradient = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, outerRadius);
    const lightenGradient = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, outerRadius);


    // Adds outer darkened blur effect
    ctx.globalCompositeOperation = 'source-over';
    vintageGradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
    vintageGradient.addColorStop(0.65, 'rgba(0, 0, 0, 0)');
    vintageGradient.addColorStop(1, 'rgba(0, 0, 0, 0.6)');
    ctx.fillStyle = vintageGradient;
    ctx.fillRect(0, 0, w, h);

    // Adds central lighten effect
    ctx.globalCompositeOperation = 'lighter';
    lightenGradient.addColorStop(0, 'rgba(255, 255, 255, 0.1)');
    lightenGradient.addColorStop(0.65, 'rgba(255, 255, 255, 0)');
    lightenGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = lightenGradient;
    ctx.fillRect(0, 0, w, h);
  }

  onSepiaEffect(data: any){
    //http://camanjs.com/docs/
    //All three color channels have special conversion factors that
    //define what sepia is. Here we adjust each channel individually,
    //with the twist that you can partially apply the sepia filter.
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      data[i] = Math.min(255, (r * (1 - 0.607)) + (g * 0.769) + (b * 0.189)); // red
      data[i + 1] = Math.min(255, (r * 0.349) + (g * (1 - 0.314)) + (b * 0.168));// green
      data[i + 2] = Math.min(255, (r * 0.272) + (g * 0.534) + (b * (1 - 0.869)));// blue
    }
    return data;
  }

}
