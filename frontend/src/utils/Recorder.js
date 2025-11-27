export class AudioRecorder {
  constructor() {
    this.mediaRecorder = null;
    this.chunks = [];
  }

  async start() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    this.mediaRecorder = new MediaRecorder(stream);

    this.mediaRecorder.ondataavailable = (e) => {
      this.chunks.push(e.data);
    };

    this.mediaRecorder.start();
    console.log("Recording started...");
  }

  stop() {
    return new Promise((resolve) => {
      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.chunks, { type: "audio/webm" });
        this.chunks = [];
        resolve(audioBlob);
      };

      this.mediaRecorder.stop();
      console.log("Recording stopped.");
    });
  }
}
