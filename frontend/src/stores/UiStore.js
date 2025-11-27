import { makeAutoObservable } from "mobx";

class UIStore {
  isRecording = false;
  isLoading = false;
  theme = "dark";

  constructor() {
    makeAutoObservable(this);
  }

  setRecording(val) {
    this.isRecording = val;
  }

  setLoading(val) {
    this.isLoading = val;
  }

  toggleTheme() {
    this.theme = this.theme === "dark" ? "light" : "dark";
  }
}

const uiStore = new UIStore();
export default uiStore;
