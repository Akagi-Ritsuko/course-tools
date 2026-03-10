/*
 * @Author: guotao
 * @Date: 2025-03-15 10:21:49
 * @LastEditors: guotao
 * @LastEditTime: 2026-03-09 22:38:46
 * @FilePath: \course-tools1\src\mooc.ts
 * @Description: 
 * 
 * Copyright (c) 2026 by lzlj, All Rights Reserved. 
 */
import {RemoveInjected} from "./internal/utils/utils";
import {Application, Frontend, Launcher} from "./internal/application";
import {ChromeConfigItems, NewFrontendGetConfig} from "./internal/utils/config";
import {PageLog, Logger, ConsoleLog} from "./internal/utils/log";
import {MoocLauncher} from "./mooc/mooc";
import {DefaultMoocFactory} from "@App/internal/app/mooc";


let logger: Logger;
if (top == self) {
    logger = new PageLog();
} else {
    logger = new ConsoleLog();
}

let component = new Map<string, any>()
    .set("config", new ChromeConfigItems(NewFrontendGetConfig()))
    .set("logger", logger);

Application.GlobalContext = window;
let app = new Application(Frontend, new MoocLauncher(new DefaultMoocFactory()), component);
app.run();

RemoveInjected(document);
