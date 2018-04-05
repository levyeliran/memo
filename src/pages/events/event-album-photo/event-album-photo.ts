import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Loading, LoadingController, NavController, NavParams} from 'ionic-angular';
import {BaseComponent} from "../../../api/common/baseComponent/baseComponent";
import {EventDispatcherService} from "../../../api/dispatcher/appEventDispathcer.service";
import {Event, HeaderButton, Photo} from "../../../api/common/appTypes";
import {PhotoActions} from "../../../api/store/photos/photoActions";

@Component({
  selector: 'page-event-album-photo',
  templateUrl: 'event-album-photo.html',
})
export class EventAlbumPhotoPage extends BaseComponent implements OnInit, OnDestroy {

  event: Event;
  photo: Photo;
  emojis: any[];
  taggedEmojis: any[];
  selectedEmoji: any;
  photoCanvas: any;
  orgCanvas: any;
  isNewPhoto: boolean;
  headerButtons: HeaderButton[];
  brightness: number = 0;
  contrast: number = 0;
  sharpen: number = 0;
  activeTool: any;
  selectedEffects: any = [];
  loader:Loading;

  //get reference to photo canvas view
  @ViewChild('photoPreviewCanvas') canvasPreviewRef: any;
  @ViewChild('orgCanvas') orgHiddenCanvasRef: any;
  @ViewChild('photoPreview') imgRef: any;
  @ViewChild('toolsBar') toolsBarRef: any;
  @ViewChild('pageWrapper') pageWrapperRef: any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public eventDispatcherService: EventDispatcherService,
              public loadingCtrl: LoadingController) {
    super(eventDispatcherService);
    this.event = this.navParams.get('event');
    this.photo = this.navParams.get('photo');
    //this.screenHeight = window.screen.height * 0.6;
    //extract params

    this.isNewPhoto = !this.photo.key;
    //set photo events
    this.registerToEvents();
  }

  getEmojis() {

    //select the own emoji

    let emojis = [
      {imagePath: 'assets/images/emoji/2.png', key: '2'},
      {imagePath: 'assets/images/emoji/3.png', key: '3'},
      {imagePath: 'assets/images/emoji/5.png', key: '5'},
      {imagePath: 'assets/images/emoji/6.png', key: '6'},
      {imagePath: 'assets/images/emoji/7.png', key: '7'},
      {imagePath: 'assets/images/emoji/9.png', key: '9'},
      {imagePath: 'assets/images/emoji/10.png', key: '10'},
      {imagePath: 'assets/images/emoji/11.png', key: '11'},
      {imagePath: 'assets/images/emoji/12.png', key: '12'},
      {imagePath: 'assets/images/emoji/13.png', key: '13'},
      {imagePath: 'assets/images/emoji/14.png', key: '14'},
      {imagePath: 'assets/images/emoji/15.png', key: '15'},
      {imagePath: 'assets/images/emoji/18.png', key: '18'},
      {imagePath: 'assets/images/emoji/20.png', key: '20'},
      {imagePath: 'assets/images/emoji/23.png', key: '23'}
    ];

    const photoTagKey = this.photo.myEmojiTagKey;
    if (photoTagKey) {
      emojis = emojis.map(e => {
        if (e.key === photoTagKey) {
          e = Object.assign(e, {selected: true});
          this.selectedEmoji = e;
        }
        return e;
      });
    }

    return emojis;
  }

  getTaggedEmojis() {
    const taggedEmojis = [];
    if (this.photo && this.photo.tagsMetaData) {
      this.photo.tagsMetaData.emojiTags.reduce((acc, tmd) => {
        if (!acc.find(t => t.key === tmd.emojiTagKey)) {
          acc.push(
            {imagePath: `assets/images/emoji/${tmd.emojiTagKey}.png`, key: tmd.emojiTagKey}
          );
        }
        return acc;
      }, []);
    }
    return taggedEmojis;
  }

  ngOnInit() {

    this.loader = this.loadingCtrl.create({
      spinner: 'hide',
      content: `
        <div class="add-photo-loader-container">
          <div class="loader-text">Uploading photo to album</div>
          <ion-spinner name="bubbles"></ion-spinner>
        </div>`
    });
    this.emojis = this.getEmojis();
    this.taggedEmojis = this.getTaggedEmojis();
    const imageWidth = window.screen.width;
    const imageHeight = window.screen.width * 0.8;
    //calculate the
    const toolsHeight =
      this.pageWrapperRef
        .getElementRef()
        .nativeElement
        .clientHeight - imageHeight - this.appConst.appTopMenuHeight;

    //tag photo
    if (this.photo.key) {
      const img = this.imgRef.nativeElement;
      img.width = imageWidth;
      img.height = imageHeight;
    }
    //design photo
    else {
      //init the default active tool
      this.activeTool = this.appConst.photoEditingTools.brightness;
      const addPhotoBtn = new HeaderButton('checkmark', this.onAddPhoto.bind(this), false);
      this.headerButtons = [
        addPhotoBtn
      ];

      //https://stackoverflow.com/questions/4409445/base64-png-data-to-html5-canvas
      //https://stackoverflow.com/questions/37873043/how-to-draw-on-image-angular2-ionic2
      this.photoCanvas = this.canvasPreviewRef.nativeElement;
      this.photoCanvas.width = imageWidth;
      this.photoCanvas.height = imageHeight;

      this.orgCanvas = this.orgHiddenCanvasRef.nativeElement;
      this.orgCanvas.width = imageWidth;
      this.orgCanvas.height = imageHeight;

      const ctx = this.photoCanvas.getContext("2d");
      this.photo.photoImage = new Image();
      const img = this.photo.photoImage;
      img.onload = () => {
        //spread the image on the canvas
        ctx.drawImage(img,
          0, 0, img.width, img.height,// source rectangle (to keep the image resolutoin)
          0, 0, imageWidth, imageHeight); // destination rectangle (to fit in the canvas)

        //keep an original canvas image for manipulation
        const orgCanvasCtx = this.orgCanvas.getContext("2d");
        orgCanvasCtx.drawImage(img,
          0, 0, img.width, img.height,// source rectangle (to keep the image resolutoin)
          0, 0, imageWidth, imageHeight); // destination rectangle (to fit in the canvas)
      };
      this.photo.photoImage.src = this.photo.base64ImageData;
    }


    //set tolls bar styling
    const toolsBar = this.toolsBarRef.nativeElement;
    toolsBar.setAttribute("style", `width:${imageWidth}px; height:${toolsHeight}px;`);
  }

  ionViewDidLeave() {
    //set the selected emoji tag to the photo on page leave.
    if (this.selectedEmoji) {
      this.eventDispatcherService.emit({
        type: PhotoActions.tagPhoto, payload: {
          photo: this.photo,
          emojiKey: this.selectedEmoji.key
        }
      });
    }

    //reset the selected emoji
    this.selectedEmoji = null;

  }

  ngOnDestroy() {
    //unregister to events
    this.unregisterToEvent(PhotoActions.photoUploadedToStorage);
    this.unregisterToEvent(PhotoActions.photoUploadToStorageFailed);
    this.unregisterToEvent(PhotoActions.eventPhotoSaved);
  }

  registerToEvents() {
    const self = this
    this.registerToEvent(PhotoActions.photoUploadedToStorage).subscribe(() => {
      self.loader.dismiss();
      //navigate back to the album
      if (self.navCtrl.length() > 1) {
        self.navCtrl.pop();
      }
    });

    this.registerToEvent(PhotoActions.photoUploadToStorageFailed).subscribe(() => {
      //display error
    });

    this.registerToEvent(PhotoActions.eventPhotoSaved).subscribe((photo) => {
      //convert the canvas back to base64 image
      photo.base64ImageData = this.photoCanvas.toDataURL();

      //save the photo to the storage
      this.eventDispatcherService.emit({type: PhotoActions.savePhotoToStorage, payload: photo});
    });
  }

  onAddPhoto() {
    this.loader.present();
    this.photo.eventKey = this.event.key;
    this.eventDispatcherService.emit({type: PhotoActions.addPhotoToAlbum, payload: this.photo});
  }

  onEmojiClick(emoji: any) {
    if (this.selectedEmoji) {
      this.selectedEmoji.selected = false;
    }
    this.selectedEmoji = emoji;
    emoji.selected = !emoji.selected;
    this.logger.log(`Emoji ${JSON.stringify(emoji)}} was ${emoji.selected ? 'selected' : 'unSelected'}`);
  }

  onSelectTool(tool: any) {
    this.activeTool = tool;
  }

  /////////////////////////////////////////////////////////
  //https://vintagejs.com/
  onCanvasBrightness(data: any) {
    //https://www.html5rocks.com/en/tutorials/canvas/imagefilters/
    //Range is -100 to 100. Values < 0 will darken image while values > 0 will brighten.
    for (let i = 0; i < data.length; i += 4) {
      data[i] += this.brightness;
      data[i + 1] += this.brightness;
      data[i + 2] += this.brightness;
    }
    return data;
  }

  onCanvasContrast(data: any) {
    //https://www.html5rocks.com/en/tutorials/canvas/imagefilters/
    //https://en.wikipedia.org/wiki/Convolution
    //Range is -10 to 30. Values < 0 will decrease contrast while values > 0 will increase contrast.
    //The contrast adjustment values are a bit sensitive. While unrestricted, sane adjustment values are usually around 5-10.
    //calculate the adjustment value
    const adjust = Math.pow((this.contrast + 100) / 100, 2);
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

  onCanvasSharpen(data: any) {
    //https://www.html5rocks.com/en/tutorials/canvas/imagefilters/
    //https://en.wikipedia.org/wiki/Convolution
    let src = data.slice(0);//clone the array
    const mixFactor = this.sharpen / 50; //mixFactor: [0.0, 2.0]
    const negW = 0 - mixFactor;
    const posW = 1 + (mixFactor * 4);
    const weights = // 3*3 convolution matrix in a range of (from 0 (no-effect) to -2 (max sharpen factor))
      [0, negW, 0,
        negW, posW, negW,
        0, negW, 0];
    const convDim = 3;
    const w = this.photoCanvas.width;
    const h = this.photoCanvas.height;
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

  onGrayEffect(data: any) {
    //http://spyrestudios.com/html5-canvas-image-effects-black-white/
    for (let i = 0; i < data.length; i += 4) {
      const grayScale = data[i] * .3 + data[i + 1] * .59 + data[i + 2] * .11;
      data[i] = grayScale; // red
      data[i + 1] = grayScale; // green
      data[i + 2] = grayScale; // blue
    }
    return data;
  }

  onVintageEffect(ctx: any) {
    const w = this.photoCanvas.width;
    const h = this.photoCanvas.height;
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

  onSepiaEffect(data: any) {
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

  isEffectActivated(effect: string) {
    return Object.keys(this.selectedEffects).find(k => k === effect);
  }

  manipulateCanvas() {
    //get cloned data from the ORG canvas
    const dataImage = this.cloneCanvasCtxDataImage();
    //create an instance of the preview canvas
    const ctx = this.photoCanvas.getContext("2d");
    Object.keys(this.selectedEffects).forEach(effect => {
      switch (effect) {
        case this.appConst.photoEditingTools.brightness:
          dataImage.data.set(this.onCanvasBrightness(dataImage.data));
          break;
        case this.appConst.photoEditingTools.contrast:
          dataImage.data.set(this.onCanvasContrast(dataImage.data));
          break;
        case this.appConst.photoEditingTools.sharpen:
          dataImage.data.set(this.onCanvasSharpen(dataImage.data));
          break;
        case this.appConst.photoEditingTools.effectTypes.grayEffect:
          dataImage.data.set(this.onGrayEffect(dataImage.data));
          break;
        case this.appConst.photoEditingTools.effectTypes.sepiaEffect:
          dataImage.data.set(this.onSepiaEffect(dataImage.data));
          break;
        default:
      }
    });

    //re-write the manipulated data on the preview canvas
    ctx.putImageData(dataImage, 0, 0);

    //in case of vintage effect - we apply it on the ctx itself
    if (this.selectedEffects[this.appConst.photoEditingTools.effectTypes.vintageEffect]) {
      this.onVintageEffect(ctx);
    }
  }

  onEffectSelected(effect: string, hasToggleBehavior = false) {
    if (hasToggleBehavior && this.isEffectActivated(effect)) {
      this.onCancelEffect(effect);
    }
    else {
      //clear selected effects (gray, vintage, sepia) if selected
      if (hasToggleBehavior) {
        Object.keys(this.appConst.photoEditingTools.effectTypes).forEach(e => {
          delete this.selectedEffects[e];
        });
      }
      this.selectedEffects[effect] = true;
      this.manipulateCanvas();
    }
  }

  onCancelEffect(effect: string) {
    switch (effect) {
      case this.appConst.photoEditingTools.brightness:
        this.brightness = 0;
        delete this.selectedEffects[effect];
        break;
      case this.appConst.photoEditingTools.contrast:
        this.contrast = 0;
        delete this.selectedEffects[effect];
        break;
      case this.appConst.photoEditingTools.sharpen:
        this.sharpen = 0;
        delete this.selectedEffects[effect];
        break;
      case this.appConst.photoEditingTools.effectTypes.grayEffect:
      case this.appConst.photoEditingTools.effectTypes.vintageEffect:
      case this.appConst.photoEditingTools.effectTypes.sepiaEffect:
        delete this.selectedEffects[effect];
        break;
      default:
        return;
    }
    this.manipulateCanvas();
  }

  cloneCanvasCtxDataImage() {
    const ctx = this.orgCanvas.getContext("2d");
    const dataImage = ctx
      .getImageData(0, 0, this.photoCanvas.width, this.photoCanvas.height);
    const newImageData = ctx.createImageData(this.photoCanvas.width, this.photoCanvas.height);
    newImageData.data.set(dataImage.data);
    return newImageData;
  }

}
