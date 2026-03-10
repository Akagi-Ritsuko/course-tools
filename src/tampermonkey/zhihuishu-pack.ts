import { ChromeConfigItems, NewFrontendGetConfig } from "@App/internal/utils/config";
import { ConsoleLog, Logger, PageLog } from "@App/internal/utils/log";
import { Application, Frontend } from "@App/internal/application";
import { MoocLauncher } from "@App/mooc/mooc";
import { ZhsPlatform } from "@App/mooc/zhihuishu/platform";


let logger: Logger;
if (top == self) {
    logger = new PageLog();
} else {
    logger = new ConsoleLog();
}

Application.GlobalContext = (<any>window).unsafeWindow;
let component = new Map<string, any>().
    set("config", new ChromeConfigItems(NewFrontendGetConfig())).
    set("logger", logger);

let app = new Application(Frontend, new MoocLauncher(new ZhsPlatform()), component);
app.run();
