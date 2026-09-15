/*
 * @Author: guotao
 * @Date: 2025-03-15
 * @LastEditors: guotao
 * @LastEditTime: 2026-03-15
 * @FilePath: \course-tools\src\mooc\zsgl\utils\exam-utils.ts
 * @Description: zsgl 考试模块请求工具函数
 *
 * Copyright (c) 2025 by lzlj, All Rights Reserved.
 */
import md5 from "md5";
import { Application } from "@App/internal/application";

/**
 * Cookie 操作工具类
 */
class CookieUtil {
  /**
   * 获取 Cookie 值
   * @param name Cookie 名称
   * @returns Cookie 值对象或 null
   */
  static get(name: string): any {
    const cookies = document.cookie.split(";");
    for (const cookie of cookies) {
      const [key, value] = cookie.trim().split("=");
      if (key === name) {
        try {
          return JSON.parse(decodeURIComponent(value));
        } catch {
          return decodeURIComponent(value);
        }
      }
    }
    return null;
  }

  /**
   * 设置 Cookie 值
   * @param name Cookie 名称
   * @param value Cookie 值
   * @param days 过期天数
   */
  static set(name: string, value: any, days?: number): void {
    let cookieStr = `${name}=${encodeURIComponent(JSON.stringify(value))}`;
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      cookieStr += `;expires=${date.toUTCString()}`;
    }
    document.cookie = cookieStr;
  }

  /**
   * 删除 Cookie
   * @param name Cookie 名称
   */
  static remove(name: string): void {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  }
}

/**
 * 内存中的 sid 存储（模拟 _.Z.sid）
 */
let memorySid: string | null = null;

/**
 * 设置内存中的 sid
 * @param sid 会话ID
 */
export function setMemorySid(sid: string): void {
  memorySid = sid;
}

/**
 * 清除内存中的 sid
 */
export function clearMemorySid(): void {
  memorySid = null;
}

/**
 * 获取 sid（会话ID）
 * 优先级：内存 → Cookie → 空字符串
 * 参考：queryQuestionAnswer.md 第84-114行
 * @returns sid 字符串
 */
export function getSid(): string {
  // 优先从内存获取
  if (memorySid) {
    Application.App.log.Debug("从内存获取 sid:", memorySid);
    return memorySid;
  }

  // 从 Cookie 获取
  const sessionInfo = CookieUtil.get("sessionInfo");
  if (sessionInfo && sessionInfo.sid) {
    Application.App.log.Debug("从 Cookie 获取 sid:", sessionInfo.sid);
    return sessionInfo.sid;
  }

  // 都不存在，返回空字符串
  Application.App.log.Warn("未找到 sid，返回空字符串");
  return "";
}

/**
 * 解析 URL 参数
 * @param url URL 字符串
 * @returns 参数对象
 */
function parseUrlParams(url: string): Record<string, string> {
  if (typeof url !== "string") {
    return {};
  }

  const parts = url.split("?");
  if (parts.length === 1) {
    return {};
  }

  const params: Record<string, string> = {};
  const paramPairs = parts[1].split("&");

  for (const pair of paramPairs) {
    const [key, value] = pair.split("=");
    if (key) {
      params[key] = value ? decodeURIComponent(value) : "";
    }
  }

  return params;
}

/**
 * 生成随机 nonce（32位随机字符串）
 * @returns nonce 字符串
 */
function generateNonce(): string {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substring(2, 15);
  const nonceStr = timestamp + random;
  return md5(nonceStr);
}

/**
 * 获取签名密钥
 * 根据环境判断使用哪个密钥
 * 参考：main.6777c334.deobfuscated.js 第24704-24706行
 * @returns 签名密钥
 */
function getSignKey(): string {
  const host = window.location.host;

  // 测试环境判断
  const isTestEnv =
    host.includes("api-stg") ||
    host.includes("test") ||
    host.includes("stg") ||
    host.includes("localhost") ||
    host.includes("zsgltest") ||
    host.includes("127.0.0.1") ||
    host.includes(".w-stg1.zhi-niao.com") ||
    host.includes("custom-stg1.zhi-niao.com");

  // 测试环境使用 appId 作为密钥，正式环境使用固定密钥
  return isTestEnv ? "com.mlearning.paznluzhoulaojiao" : "ERZF2pSLHBxyZE6t";
}

/**
 * 构建签名字符串
 * 参考：main.6777c334.deobfuscated.js 第24645-24680行
 * @param url URL 字符串
 * @param params URL 参数
 * @param requestBody 请求体（POST请求时使用）
 * @param contentType Content-Type
 * @returns 签名字符串
 */
function buildSignString(
  url: string,
  params: Record<string, any>,
  requestBody?: Record<string, any>,
  contentType?: string
): string {
  const nonce = generateNonce();
  const timestamp = Date.now();
  const signKey = getSignKey();
  const appDevicePlatform = "99";

  // 解析 URL 中的参数
  const urlParams = parseUrlParams(url);

  // 判断是否是 JSON 或 multipart 请求
  const isJson = contentType && contentType.includes("application/json");
  const isMultipart = contentType && contentType.includes("multipart/form-data");

  // 合并参数
  let allParams: Record<string, any>;
  if (isMultipart || isJson) {
    // multipart 或 json 请求，使用 URL 参数和额外参数
    allParams = { ...urlParams, ...params };
  } else {
    // 其他请求，使用 URL 参数和 requestBody
    allParams = { ...urlParams, ...requestBody };
  }

  // 排序参数键
  const sortedKeys = Object.keys(allParams).sort();

  // 构建签名字符串：signKey + appDevicePlatform + nonce + timestamp + sortedParams
  let signStr = signKey + appDevicePlatform + nonce + timestamp.toString();

  // 添加排序后的参数
  for (const key of sortedKeys) {
    const value = allParams[key];
    if (Array.isArray(value)) {
      // 数组类型：拼接所有元素的 JSON 字符串
      let arrayStr = "";
      for (const item of value) {
        const itemStr = item === null || item === undefined ? "" : JSON.stringify(item);
        arrayStr += itemStr;
      }
      signStr += key + arrayStr;
    } else {
      // 非数组类型：拼接键和值
      const valueStr = value === null || value === undefined ? "" : value.toString();
      signStr += key + valueStr;
    }
  }

  return signStr;
}

/**
 * 生成 headerMap
 * 参考：sumbitQuestion.md 第16、48行
 * 参考：main.6777c334.deobfuscated.js 第24645-24680行
 * @param url URL 字符串
 * @param params URL 参数
 * @param requestBody 请求体（POST请求时使用）
 * @param contentType Content-Type
 * @returns headerMap JSON 字符串
 */
export function generateHeaderMap(
  url: string,
  params: Record<string, any> = {},
  requestBody?: Record<string, any>,
  contentType?: string
): string {
  const nonce = generateNonce();
  const timestamp = Date.now();
  const signKey = getSignKey();

  // 构建签名字符串
  const signStr = buildSignString(url, params, requestBody, contentType);

  // MD5 加密签名
  const sign = md5(signStr);

  // 构建 headerMap 对象
  const headerMap = {
    appId: "com.mlearning.paznluzhoulaojiao",
    nonce: nonce,
    sign: sign,
    timestamp: timestamp,
    appDevicePlatform: "99"
  };

  Application.App.log.Debug("生成 headerMap:", headerMap);

  return JSON.stringify(headerMap);
}

/**
 * 考试 API 响应接口
 */
export interface ExamApiResponse<T = any> {
  code: string | number;
  message: string;
  body: T | null;
  file: any | null;
  user: any | null;
}

/**
 * 考试 API 请求配置
 */
export interface ExamApiRequestConfig {
  /** 请求方法 */
  method: "GET" | "POST";
  /** API 路径（不含基础路径） */
  apiPath: string;
  /** URL 参数 */
  params?: Record<string, string | number>;
  /** 请求体（POST请求时使用） */
  body?: Record<string, any> | any[];
  /** 额外请求头 */
  headers?: Record<string, string>;
  /** 超时时间（毫秒） */
  timeout?: number;
}

/**
 * 发送考试 API 请求
 * 参考：queryQuestionAnswer.md 第137-155行
 * 参考：sumbitQuestion.md 第1-52行
 * @param config 请求配置
 * @returns Promise<ExamApiResponse<T>>
 */
export async function sendExamApiRequest<T = any>(
  config: ExamApiRequestConfig
): Promise<ExamApiResponse<T>> {
  const {
    method,
    apiPath,
    params = {},
    body,
    headers = {},
    timeout = 30000
  } = config;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    // 获取 sid
    const sid = getSid();

    // 构建完整 URL
    const baseUrl = "/learn/app/clientapi";
    let url = `${baseUrl}${apiPath}`;

    // 添加基础参数：sid 和 os
    const baseParams: Record<string, string | number> = {
      ...params,
      os: "99"
    };

    if (sid) {
      baseParams.sid = sid;
    }

    // 构建查询字符串
    const queryString = Object.entries(baseParams)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
      .join("&");

    url = `${url}?${queryString}`;

    // 准备请求配置
    const fetchOptions: RequestInit = {
      method,
      signal: controller.signal,
      credentials: "include"
    };

    // 构建请求头
    const contentType = method === "POST" ? "application/json;charset=UTF-8" : "application/json";
    const defaultHeaders: Record<string, string> = {
      Accept: "application/json, text/plain, */*",
      "Accept-Language": "zh,zh-CN;q=0.9,en;q=0.8",
      "Cache-Control": "no-cache",
      "Content-Type": contentType,
      Language: "zh",
      Pragma: "no-cache",
      Referer: window.location.href,
      appDevicePlatform: "99"
    };

    // 添加 sid 到请求头
    if (sid) {
      defaultHeaders.sid = sid;
    }

    // 生成 headerMap
    const requestBody = method === "POST" ? body : undefined;
    const headerMap = generateHeaderMap(url, baseParams, requestBody, contentType);
    defaultHeaders.headerMap = headerMap;

    // 合并额外请求头
    fetchOptions.headers = {
      ...defaultHeaders,
      ...headers
    };

    // POST 请求添加请求体
    if (method === "POST" && body) {
      fetchOptions.body = JSON.stringify(body);
    }

    Application.App.log.Debug(`发送考试 API 请求: ${method} ${url}`);
    Application.App.log.Debug("请求配置:", fetchOptions);

    // 发送请求
    const response = await fetch(url, fetchOptions);
    clearTimeout(timeoutId);

    if (!response.ok) {
      Application.App.log.Error(
        `考试 API 请求失败: ${response.status} ${response.statusText}`
      );
      return {
        code: response.status,
        message: `HTTP错误: ${response.status} ${response.statusText}`,
        body: null,
        file: null,
        user: null
      };
    }

    // 解析响应
    const data = await response.json();
    Application.App.log.Debug(`考试 API 响应成功:`, data);

    // 检查响应状态
    const code = typeof data.code === "string" ? data.code : data.code.toString();

    if (code === "-4") {
      Application.App.log.Warn("会话已过期，需要重新登录");
      // 清除 sid
      clearMemorySid();
      CookieUtil.remove("sessionInfo");
    }

    return data as ExamApiResponse<T>;
  } catch (error) {
    clearTimeout(timeoutId);

    if ((error as Error).name === "AbortError") {
      Application.App.log.Error(`考试 API 请求超时: ${apiPath}`);
      return {
        code: -1,
        message: "请求超时",
        body: null,
        file: null,
        user: null
      };
    }

    Application.App.log.Error(`考试 API 请求异常:`, error);
    return {
      code: -1,
      message: (error as Error).message || "未知错误",
      body: null,
      file: null,
      user: null
    };
  }
}

/**
 * 查询题目答案
 * 参考：queryQuestionAnswer.md 第12-18行
 * @param examId 考试ID
 * @param attemptId 考试尝试ID
 * @returns Promise<ExamApiResponse>
 */
export async function queryQuestionAnswer(
  examId: string | number,
  attemptId: string | number
): Promise<ExamApiResponse> {
  return sendExamApiRequest({
    method: "GET",
    apiPath: "/exam/new/queryQuestionAnswer.do",
    params: {
      examId,
      attemptId
    }
  });
}

/**
 * 提交题目答案
 * 参考：sumbitQuestion.md 第1-21行
 * @param answerData 答题数据
 * @returns Promise<ExamApiResponse>
 */
export async function submitQuestionAnswer(
  answerData: any | any[]
): Promise<ExamApiResponse> {
  return sendExamApiRequest({
    method: "POST",
    apiPath: "/exam/new/submitQuestionAnswer.do",
    body: answerData
  });
}

/**
 * 查询考试试卷
 * 参考：sumbitQuestion.md 第96-116行
 * @param examId 考试ID
 * @returns Promise<ExamApiResponse>
 */
export async function queryNewExamPaper(
  examId: string | number
): Promise<ExamApiResponse> {
  return sendExamApiRequest({
    method: "POST",
    apiPath: "/exam/new/queryNewExamPaper.do",
    body: {
      examId
    }
  });
}