import { Task, TaskType } from "@App/internal/app/task";
import { Application } from "@App/internal/application";
import { CssBtn, hookHttpRequest } from "./utils/utils";
import { createBtn, protocolPrompt } from "@App/internal/utils/utils";
import { NewChromeServerMessage } from "@App/internal/utils/message";
import { createStorageHandler } from "./utils/utils";
import { ZsglTask, ZsglTaskControlBar } from "./task";
import { TaskFactory } from "./factory";
import { Mooc, MoocTaskSet, MoocEvent } from "@App/internal/app/mooc";
import { EventListener } from "@App/internal/utils/event";
import { prototype } from "vue/types/umd";
import { AES, enc, mode, pad } from "crypto-js";

export class ZsglExam extends EventListener<MoocEvent> implements MoocTaskSet {
  protected questionList: Array<any> = [];
  public Init(): Promise<any> {
    return new Promise(async (resolve) => {
      await this.hookQuestionDetailRequests();
      console.log("初始化成功");
    });
  }
  protected hookQuestionDetailRequests(): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      await hookHttpRequest(
        "queryQuestionDetail.do",
        (response, self) => {
          Application.App.log.Debug("原始响应数据", response);
          if (response) {
            const decrypt = function(
              encryptedData: string,
              key: string,
              iv: string
            ): string {
              try {
                // 2. 配置解密参数
                const decryptionConfig = {
                  iv: enc.Utf8.parse(iv),
                  mode: mode.CBC,
                  padding: pad.Pkcs7,
                };

                // 3. 执行解密
                // CryptoJS.AES.decrypt 接受的第一个参数可以是 CipherParams 对象或 Base64 字符串
                // 第二个参数是经过 parse 的密钥 WordArray
                const decrypted = AES.decrypt(
                  encryptedData,
                  enc.Utf8.parse(key),
                  decryptionConfig
                );

                // 4. 将解密结果（WordArray）转换为 UTF-8 字符串
                return decrypted.toString(enc.Utf8);
              } catch (error) {
                console.error("解密失败，请检查密钥、IV或密文:", error);
                throw new Error("解密过程中发生错误"); // 重新抛出错误，让调用者处理
              }
            };
            const SECRET_KEY = "3c26d0badca24176";
            const IV = "39934fc88c73430e";
            const responseData = decrypt(response, SECRET_KEY, IV);
            this.questionList = JSON.parse(JSON.parse(responseData).body);
            Application.App.log.Debug("解密后的响应数据", this.questionList);
            console.log("解密后的响应数据", JSON.stringify(this.questionList));
          }
        },
        this
      );
      resolve();
    });
  }
  // 停止
  public Stop(): Promise<any> {
    return Promise.resolve();
  }

  // 返回下一个任务点
  public Next(): Promise<Task> {
    return;
  }

  // 设置任务点位置
  public SetTaskPointer(index: number): void {
    return;
  }
}
