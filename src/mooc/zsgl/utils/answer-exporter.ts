/*
 * @Author: guotao
 * @Date: 2026-09-16
 * @LastEditors: guotao
 * @LastEditTime: 2026-09-16
 * @FilePath: \course-tools\src\mooc\zsgl\utils\answer-exporter.ts
 * @Description: 考试答案导出工具，将题目与答案汇总为Markdown文件下载到浏览器默认下载目录
 *
 * Copyright (c) 2026 by lzlj, All Rights Reserved.
 */
import { Application } from "@App/internal/application";
import { QuestionInfo, QuestionSection } from "../types";

/** 导出开关的配置键 */
const EXPORT_SWITCH_KEY = "answer_export_enabled";

/** 题型标签 */
const TYPE_LABEL: { [key: string]: string } = {
  S: "单选",
  M: "多选",
  T: "判断",
};

/**
 * 去除字符串中的HTML标签
 * @param html 含HTML的文本
 * @returns 纯文本
 */
export function stripHtml(html: string): string {
  return (html || "")
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * 转义Markdown特殊字符，避免题干/选项中的符号破坏导出文件结构
 * @param text 纯文本
 * @returns 转义后的文本
 */
function escapeMarkdown(text: string): string {
  return (text || "").replace(/([\\`*_[\]{}()#+\-.!|>])/g, "\\$1");
}

/**
 * 导出考试答案为Markdown文件
 * 开关通过配置 answer_export_enabled 控制，运行时读取，无需重新打包
 * @param examId 考试ID
 * @param testNo 考试编号
 * @param questionList 题目列表（含答案）
 */
export function exportExamAnswers(
  examId: string,
  testNo: string,
  questionList: QuestionInfo[],
): void {
  // 仅显式配置为 false 时关闭，默认开启
  const enabled = String(
    Application.App.config.GetConfig(EXPORT_SWITCH_KEY, "true"),
  );

  if (enabled.toLowerCase() === "false") {
    Application.App.log.Debug("考试答案导出已关闭，跳过导出");
    return;
  }

  if (!questionList || questionList.length === 0) {
    Application.App.log.Warn("考试答案导出：题目列表为空，跳过");
    return;
  }

  const markdown = buildMarkdown(examId, testNo, questionList);
  const filename = `考试答案_${examId || "unknown"}_${formatTimestamp()}.md`;
  downloadTextFile(filename, markdown);

  Application.App.log.Info(`考试答案已导出: ${filename}`);
}

/**
 * 构建Markdown内容
 * @param examId 考试ID
 * @param testNo 考试编号
 * @param questionList 题目列表
 * @returns Markdown文本
 */
function buildMarkdown(
  examId: string,
  testNo: string,
  questionList: QuestionInfo[],
): string {
  const lines: string[] = [];

  // 统计各题型数量
  const counts: { [key: string]: number } = {};
  for (const q of questionList) {
    counts[q.questionType] = (counts[q.questionType] || 0) + 1;
  }
  const typeSummary = Object.keys(TYPE_LABEL)
    .map((type) => `${TYPE_LABEL[type]} ${counts[type] || 0}`)
    .join(" | ");

  lines.push(`# 考试答案导出`);
  lines.push("");
  lines.push(`- 考试ID: ${examId || "-"}`);
  lines.push(`- 考试编号: ${testNo || "-"}`);
  lines.push(`- 导出时间: ${new Date().toLocaleString("zh-CN")}`);
  lines.push(`- 题目总数: ${questionList.length}（${typeSummary}）`);
  lines.push("");
  lines.push("---");
  lines.push("");

  questionList.forEach((question, index) => {
    const typeLabel =
      TYPE_LABEL[question.questionType] || question.questionType || "未知";
    lines.push(
      `## ${index + 1}. [${typeLabel}] ${escapeMarkdown(
        stripHtml(question.questionText),
      )}`,
    );
    lines.push("");

    const correctIds = question.sectionRespList
      .filter((section: QuestionSection) => section.isCorrect === "Y")
      .map((section: QuestionSection) => section.sectionId);

    question.sectionRespList.forEach((section, sectionIndex) => {
      const letter = String.fromCharCode(65 + sectionIndex); // A, B, C, D...
      const isCorrect = section.isCorrect === "Y";
      const mark = isCorrect ? "✅" : "⬜";
      const optionText = escapeMarkdown(stripHtml(section.sectionText));
      lines.push(
        `- ${mark} **${letter}.** ${
          isCorrect ? `**${optionText}**` : optionText
        }`,
      );
    });

    if (correctIds.length === 0) {
      lines.push("");
      lines.push(`> ⚠️ 未获取到该题答案`);
    }

    lines.push("");
  });

  return lines.join("\n");
}

/**
 * 格式化时间戳用于文件名
 * @returns 形如 20260916-1536 的时间串
 */
function formatTimestamp(): string {
  const now = new Date();
  const pad = (n: number): string => String(n).padStart(2, "0");
  return (
    `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}` +
    `-${pad(now.getHours())}${pad(now.getMinutes())}`
  );
}

/**
 * 触发浏览器下载文本文件（保存到浏览器默认下载目录）
 * @param filename 文件名
 * @param content 文件内容
 */
function downloadTextFile(filename: string, content: string): void {
  // 加BOM保证Windows下编辑器正确识别UTF-8
  const blob = new Blob(["\ufeff" + content], {
    type: "text/markdown;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
