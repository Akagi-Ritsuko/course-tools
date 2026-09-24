import { createApp } from "vue";
import "../styles/globals.css";
import PopupApp from "./PopupApp.vue";
import { NewBackendConfig, ChromeConfigItems } from "../internal/utils/config";
import { Application, Backend, Launcher } from "../internal/application";

class popup implements Launcher {
    protected vm: ReturnType<typeof createApp>;

    constructor() {
    }

    public start() {
        this.vm = createApp(PopupApp);
        this.vm.mount("#app");
    }
}

window.onload = async () => {
    let config = new ChromeConfigItems(await NewBackendConfig());
    let component = new Map<string, any>().set("config", config);
    let app = new Application(Backend, new popup(), component);
    app.run();
}
