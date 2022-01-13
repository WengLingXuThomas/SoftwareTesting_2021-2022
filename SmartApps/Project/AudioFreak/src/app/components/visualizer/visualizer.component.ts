import {AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

import { Subscription } from 'rxjs';
import { AudioService } from 'src/app/services/component/audio.service';
import { UiService } from 'src/app/services/component/ui.service';

import p5 from 'p5';
import "p5/lib/addons/p5.sound"

@Component({
  selector: 'app-visualizer',
  templateUrl: './visualizer.component.html',
  styleUrls: ['./visualizer.component.css']
})
export class VisualizerComponent {

  @ViewChild('canvasContainer') parentDiv:ElementRef
  prefDimensions:any;

  audioEL:ElementRef;
  audioElSubscription:Subscription

  sketch2Show:string = 'wave';
  sketch2ShowSubscription:Subscription;

  invokeTogglePlaySubscription:Subscription;
  viEnabled:boolean = false;
  viEnabledSubscription:Subscription;

  invokeInitP5AudioCtxSubscription:Subscription;

  constructor(private audioService:AudioService, private uiService:UiService) {
    this.audioElSubscription = audioService.onUpdateAudioEl().subscribe(audioEl => {
      this.audioEL = audioEl;
    });
    this.audioEL = this.audioService.audioEl != undefined ? this.audioService.audioEl : null;
    this.viEnabledSubscription = this.uiService.onToggleVisualizer().subscribe(bool => {
      this.viEnabled = bool;
      if (this.viEnabled == true) {
        this.prefDimensions = this.uiService.getVisCanvasPrefDims();
        this.main();
      }else if(this.viEnabled == false){
        this.removeP5Canvas();
      }    
    })
/*     this.invokeTogglePlaySubscription = this.audioService.onInvokeTogglePlay().subscribe(() => {

    }) */

    this.sketch2ShowSubscription = this.uiService.onChangeVis2Show().subscribe(value => {
      this.sketch2Show = value;
      if (this.viEnabled == true) {
        this.main();
      }
    });
 
    this.sketch2Show = this.uiService.vis2Show;

    this.invokeInitP5AudioCtxSubscription = this.audioService.onInvokeInitP5AudioCtx().subscribe((data) => {
      this.audioEL = data.audioEL;
      this.initP5AudioCtx();
    })

    this.uiService.onChangeVisCanvasPrefDims().subscribe((dims) => {
      this.prefDimensions = dims;
    })
  }

  myP5:any;
  song:any;
  fft:any;
  particles: any[] = [];
  curAudioContext:any;
  curMediaSource:any;
  myCanvas:any;
  soundObject:any;

  main(){
    if (this.myP5) {
      this.myP5.remove();
    }

    this.initP5AudioCtx();

    switch (this.sketch2Show) {
      case 'wave':
      this.myP5 = new p5(this.waveSketch);
      break;
      case 'circular':
      this.myP5 = new p5(this.circleSketch);
      break;
      case 'transform':
        this.myP5 = new p5(this.transformSketch);
      break;
      case 'spectrum':
        this.myP5 = new p5(this.spectrumSketch);
      break;
    }
  }

  initP5AudioCtx(){
    if (this.curAudioContext == undefined) {
      this.myP5 = new p5((p) => {
        this.curAudioContext = p.getAudioContext()
        this.curMediaSource = this.curMediaSource || this.curAudioContext.createMediaElementSource(this.audioEL.nativeElement);
        this.audioService.updateMainAudioSource(this.curMediaSource, p, this.curAudioContext);

        //this.curMediaSource.connect(p.soundOut);
      });
      this.myP5.remove();
    }
  }

  removeP5Canvas(){
    if (this.myP5) {
      this.myP5.remove();
      console.log("canvas removed")
    }
  }

  spectrum:any;
  amp:any;
  w:any;
  x:any;
  y:any;
  spectrumSketch:any = (p: any) =>  {
    p.preload = () => {   
      // this.curAudioContext = p.getAudioContext();
      // this.curMediaSource = this.curMediaSource || this.curAudioContext.createMediaElementSource(this.audioEL.nativeElement);
      // //this.curMediaSource = this.curAudioContext.createMediaStreamSource(this.audioEL.nativeElement.captureStream());
      // this.curMediaSource.connect(p.soundOut);
    }

    p.setup = () => {
      this.myCanvas = p.createCanvas(this.prefDimensions.width, this.prefDimensions.height*0.9);
      this.myCanvas.parent("canvasContainer");
      this.fft = new p5.FFT()
      p.colorMode(p.HSB);
      p.userStartAudio();
    };
    
    p.draw = () => {
      p.background(0);
      this.spectrum = this.fft.analyze();
      this.w = p.width / this.spectrum.length;
      for (let i = 0; i < this.spectrum.length; i++) {
        this.amp = this.spectrum[i]
        p.fill(i,255,255)
        p.stroke(i,255,255)
        this.x = i*this.w;
        this.y = p.map(this.amp,0,256, p.height,0)
        p.rect(this.x*3, this.y, this.w - 2, p.height - this.y);
      }
    };

    p.windowResized = () => {
      p.resizeCanvas(this.prefDimensions.width, this.prefDimensions.height*0.9)
    }
  };

  waveSketch:any = (p: any) =>  {
    p.preload = () => {   
      //this.curAudioContext = p.getAudioContext();
      //this.curMediaSource = this.curMediaSource || this.curAudioContext.createMediaElementSource(this.audioEL.nativeElement);
      //this.curMediaSource = this.curAudioContext.createMediaStreamSource(this.audioEL.nativeElement.captureStream());
      //this.curMediaSource.connect(p.soundOut);
    }

    p.setup = () => {
      this.myCanvas = p.createCanvas(this.prefDimensions.width, this.prefDimensions.height*0.9);
      this.myCanvas.parent("canvasContainer");
      this.fft = new p5.FFT()
      p.userStartAudio();
    };
    
    p.draw = () => {
      p.background(0)
      p.stroke(255)
      p.noFill()
      var wave = this.fft.waveform()
      p.beginShape()
      for(var i = 0; i < p.width; i++){
        var index = p.floor(p.map(i,0,p.width,0,wave.length))
        var x = i
        var y = wave[index] * 200 + p.height / 2
        p.vertex(x,y)
      }
      p.endShape()
    };

    p.windowResized = () => {
      p.resizeCanvas(this.prefDimensions.width, this.prefDimensions.height*0.9)
      console.log("canvas resized");
    }

  /*   p.mouseClicked = () => {
 
    }; */
  };
  
  circleSketch:any = (p: any) =>  {
    p.preload = () => {      
      // this.curAudioContext = p.getAudioContext();
      // this.curMediaSource = this.curMediaSource || this.curAudioContext.createMediaElementSource(this.audioEL.nativeElement);
      // this.curMediaSource.connect(p.soundOut);
    }

    p.setup = () => {
      this.myCanvas = p.createCanvas(this.prefDimensions.width, this.prefDimensions.height*0.9);
      this.myCanvas.parent("canvasContainer");
      p.angleMode(p.DEGREES)
      this.fft = new p5.FFT()
      p.userStartAudio();
    };

    p.draw = () => {
      p.background(0)
      p.stroke(255)
      p.strokeWeight(3)
      p.noFill()

      p.translate(p.width / 2, p.height / 2)
      this.fft.analyze()
      p.amp = this.fft.getEnergy(20, 200)
      var wave = this.fft.waveform()

      for (var t = -1; t <= 1; t += 2) {
        p.beginShape()
        for (var i = 0; i <= 180; i += 0.5) {
          var index = p.floor(p.map(i, 0, 180, 0, wave.length - 1))
          var r = p.map(wave[index], -1, 1, 150, 350)
          var x = r * p.sin(i) * t
          var y = r * p.cos(i)
          p.vertex(x, y)
        }
        p.endShape()
      }

      var par = new Particles(p)
      this.particles.push(par);

      for(var i = this.particles.length -1; i >= 0; i--){
        if(!this.particles[i].edges()){
          this.particles[i].update(p.amp > 220)
          this.particles[i].show()  
        }else{
          this.particles.splice(i,1)
        }
      }

    };

    p.windowResized = () => {
      p.resizeCanvas(this.prefDimensions.width, this.prefDimensions.height*0.9)
    }
  };

  transformSketch:any = (p: any) =>  {
    p.preload = () => {      
/*       this.curAudioContext = p.getAudioContext();
      this.curMediaSource = this.curMediaSource || this.curAudioContext.createMediaElementSource(this.audioEL.nativeElement);
      this.curMediaSource.connect(p.soundOut); */
    }

    p.setup = () => {
      this.myCanvas = p.createCanvas(this.prefDimensions.width, this.prefDimensions.height*0.9);
      this.myCanvas.parent("canvasContainer");

      p.angleMode(p.DEGREES);
      this.soundObject = new Wave(p);
      this.fft = new p5.FFT(0.3,512)
      p.colorMode(p.HSB, 360, 100, 100, 100);
      p.strokeWeight(5);
      p.stroke(255);
      //fill(210, 0, 100, 10);
      p.noFill();
      p.userStartAudio();
    };

    p.draw = () => {
      p.background(0)
      p.translate(p.width/2, p.height/2);
      let spectrum = this.fft.analyze();
      this.soundObject.display(spectrum);
    };

    p.windowResized = () => {
      p.resizeCanvas(this.prefDimensions.width, this.prefDimensions.height*0.9)
    }
  };
}

class Particles{
  pos:any;
  vel:any;
  acc:any;
  color:any;
  w:any;
  song:any;
  p:any;

  constructor(p:any){
    this.p = p;
    this.pos = p5.Vector.random2D().mult(250)
    this.vel = new p.createVector(0,0)
    this.acc = this.pos.copy().mult(p.random(0.0001,0.00001))

    this.w = p.random(3,5)
    this.color = [p.random(125,255),p.random(125,255),p.random(125,255),]
  }
  
  update(cond:any){
    this.vel.add(this.acc)
    this.pos.add(this.vel)
    if(cond){
      this.pos.add(this.vel)
      this.pos.add(this.vel)
    }
  }

  edges(){
    if(this.pos.x < -this.p.width/2 || this.pos.x > this.p.width / 2 || this.pos.y < -this.p.width/2 || this.pos.y > this.p.width / 2){
      return true
    }else{
      return false
    }
  }

  show(){
    this.p.noStroke()
    this.p.fill(this.color)
    this.p.ellipse(this.pos.x,this.pos.y,this.w)
  }
}
class Wave{
  p:any;
  
  oscTheta:any;
  thetaMult:any;
  xrThetaMult:any;
  yrThetaMult:any;
  exponent:any;
  r:any;
  mappedR:any;
  rOffset:any;
  ripple:any;
  frame:any;
  currentFrame:any;

  constructor(p:any){
    this.p = p;
    this.oscTheta = -90;
    this.thetaMult = 1;
    this.xrThetaMult = 6;
    this.yrThetaMult = 6;
    this.exponent = 1;
    this.r = p.width/5;
    this.mappedR = 0;
    this.rOffset = p.width/5;
    this.ripple = 0;

    this.frame = 0;
    this.currentFrame = 0;
  }

  display(spectrum:any){

    this.p.beginShape();
    for(let i = 0; i < spectrum.length*2; i++){
      let theta = this.p.map(i, 0, spectrum.length*2-1, 0, 360);

      let amp = 0;
      if (i < spectrum.length) {
        amp = spectrum[i];
      }else if (i >= spectrum.length && i < spectrum.length*2) {
        let index = this.p.int(this.p.map(i, spectrum.length, spectrum.length*2-1, spectrum.length-1, 0));
        amp = spectrum[index];
      }

      this.ripple = this.p.map(amp, 0, 360, 0, this.p.width/30);
      this.mappedR = this.r - this.rOffset;

      let x = (this.mappedR*this.p.cos(theta*this.xrThetaMult)+this.rOffset+this.ripple) * this.p.pow(this.p.cos(theta*this.thetaMult), this.exponent);
      let y = (this.mappedR*this.p.cos(theta*this.yrThetaMult)+this.rOffset+this.ripple) * this.p.pow(this.p.sin(theta*this.thetaMult), this.exponent);

      this.p.vertex(x, y);
    }
    this.p.endShape();

    if(true){
      this.rOffset = this.animation(
        [this.r, this.r, this.r, this.r*3/4, this.r/2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, this.r],
        -80,
        160,
        true
      );

      this.xrThetaMult = this.animation(
        [6, 6, 6, 6, 6, 6, 6, 5, 4, 6, 6, 6, 12, 11,  9,  6,  4,  7, 10, 13, 8, 7, 7, 7, 6],
        -80,
        160,
        true
      );

      this.yrThetaMult = this.animation(
        [6, 6, 6, 6, 6, 6, 6, 5, 4, 6, 5, 4, 11, 13, 13, 12, 11,  9,  6,  4, 4, 2, 4, 6, 6],
        -80,
        160,
        true
      );
    }
    // console.log(this.yrThetaMult);

    this.oscTheta+=0.1;
  }

  animation(keyFrames:any, startOffset:any, aOffset:any, isLoop:any){ //e.g. : ([100, -50, 100], 0, 80, 1)
    let sequenceLength = -startOffset+aOffset*keyFrames.length;
    if(isLoop == true){
      this.currentFrame = this.frame % sequenceLength;
    }else if (isLoop == false) {
      this.currentFrame = this.frame;
    }

    let value = 0;
    for(let i=0; i<keyFrames.length; i++){
      if(i==0){
        value += keyFrames[i] / (1 + this.p.pow(Math.E-1.64, (startOffset+(-1*this.currentFrame))));
        startOffset += -startOffset;
      }else{
        value += (keyFrames[i]-keyFrames[i-1]) / (1 + this.p.pow(Math.E-1.64, (startOffset+(-1*this.currentFrame))));
        startOffset += aOffset;
      }
    }

    this.frame+=0.33;
    return value;
  }
}

