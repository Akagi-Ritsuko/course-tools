/*
 * @Author: guotao
 * @Date: 2025-03-15
 * @Description: exam-utils 工具函数测试文件
 *
 * Copyright (c) 2025 by lzlj, All Rights Reserved.
 */

/**
 * 测试工具函数的功能
 * 注意：此文件仅供手动测试验证，不参与生产编译
 */

// 模拟浏览器环境
if (typeof window === 'undefined') {
  global.window = {
    location: {
      host: 'zsgl.lzlj.com',
      href: 'https://zsgl.lzlj.com/znWeb/znPortal/'
    }
  } as any;
}

if (typeof document === 'undefined') {
  global.document = {
    cookie: 'sessionInfo={"sid":"BD43D2FA8A544B948D91650FF7CFF42D","userId":"123456"}'
  } as any;
}

// 导入工具函数（在实际环境中需要正确的导入路径）
import {
  getSid,
  setMemorySid,
  clearMemorySid,
  generateHeaderMap,
  sendExamApiRequest
} from './exam-utils';

/**
 * 测试 getSid 函数
 */
function testGetSid() {
  console.log('=== 测试 getSid 函数 ===');

  // 测试 1: 从 Cookie 获取
  console.log('测试 1: 从 Cookie 获取 sid');
  const sid1 = getSid();
  console.log('获取到的 sid:', sid1);
  console.log('预期结果: BD43D2FA8A544B948D91650FF7CFF42D');
  console.log('测试结果:', sid1 === 'BD43D2FA8A544B948D91650FF7CFF42D' ? '✓ 通过' : '✗ 失败');

  // 测试 2: 从内存获取（优先级高于 Cookie）
  console.log('\n测试 2: 从内存获取 sid');
  setMemorySid('MEMORY_SID_TEST');
  const sid2 = getSid();
  console.log('获取到的 sid:', sid2);
  console.log('预期结果: MEMORY_SID_TEST');
  console.log('测试结果:', sid2 === 'MEMORY_SID_TEST' ? '✓ 通过' : '✗ 失败');

  // 测试 3: 清除内存后从 Cookie 获取
  console.log('\n测试 3: 清除内存后从 Cookie 获取');
  clearMemorySid();
  const sid3 = getSid();
  console.log('获取到的 sid:', sid3);
  console.log('预期结果: BD43D2FA8A544B948D91650FF7CFF42D');
  console.log('测试结果:', sid3 === 'BD43D2FA8A544B948D91650FF7CFF42D' ? '✓ 通过' : '✗ 失败');

  // 测试 4: Cookie 和内存都为空
  console.log('\n测试 4: Cookie 和内存都为空');
  (global.document as any).cookie = '';
  clearMemorySid();
  const sid4 = getSid();
  console.log('获取到的 sid:', sid4);
  console.log('预期结果: 空字符串');
  console.log('测试结果:', sid4 === '' ? '✓ 通过' : '✗ 失败');
}

/**
 * 测试 generateHeaderMap 函数
 */
function testGenerateHeaderMap() {
  console.log('\n=== 测试 generateHeaderMap 函数 ===');

  // 测试 1: GET 请求的 headerMap
  console.log('测试 1: GET 请求的 headerMap');
  const url1 = '/learn/app/clientapi/exam/new/queryQuestionAnswer.do?examId=1301471&attemptId=231130B0A46C4695A6CD587B7E568870&sid=BD43D2FA8A544B948D91650FF7CFF42D&os=99';
  const params1 = {
    examId: '1301471',
    attemptId: '231130B0A46C4695A6CD587B7E568870',
    sid: 'BD43D2FA8A544B948D91650FF7CFF42D',
    os: '99'
  };
  const headerMap1 = generateHeaderMap(url1, params1);
  console.log('生成的 headerMap:', headerMap1);

  const parsedHeaderMap1 = JSON.parse(headerMap1);
  console.log('解析后的 headerMap:', parsedHeaderMap1);

  // 验证结构
  console.log('验证 appId:', parsedHeaderMap1.appId === 'com.mlearning.paznluzhoulaojiao' ? '✓ 通过' : '✗ 失败');
  console.log('验证 appDevicePlatform:', parsedHeaderMap1.appDevicePlatform === '99' ? '✓ 通过' : '✗ 失败');
  console.log('验证 nonce (32位):', parsedHeaderMap1.nonce.length === 32 ? '✓ 通过' : '✗ 失败');
  console.log('验证 sign (32位MD5):', parsedHeaderMap1.sign.length === 32 ? '✓ 通过' : '✗ 失败');
  console.log('验证 timestamp (数字):', typeof parsedHeaderMap1.timestamp === 'number' ? '✓ 通过' : '✗ 失败');

  // 测试 2: POST 请求的 headerMap
  console.log('\n测试 2: POST 请求的 headerMap');
  const url2 = '/learn/app/clientapi/exam/new/submitQuestionAnswer.do?os=99&sid=BD43D2FA8A544B948D91650FF7CFF42D';
  const params2 = {
    os: '99',
    sid: 'BD43D2FA8A544B948D91650FF7CFF42D'
  };
  const requestBody2 = {
    attemptId: '231130B0A46C4695A6CD587B7E568870',
    examId: '1301471',
    testNo: '30307695',
    answerList: [],
    questionId: '8122189',
    questionNodesAnswer: [],
    images: []
  };
  const contentType2 = 'application/json;charset=UTF-8';
  const headerMap2 = generateHeaderMap(url2, params2, requestBody2, contentType2);
  console.log('生成的 headerMap:', headerMap2);

  const parsedHeaderMap2 = JSON.parse(headerMap2);
  console.log('解析后的 headerMap:', parsedHeaderMap2);

  // 验证结构
  console.log('验证 appId:', parsedHeaderMap2.appId === 'com.mlearning.paznluzhoulaojiao' ? '✓ 通过' : '✗ 失败');
  console.log('验证 appDevicePlatform:', parsedHeaderMap2.appDevicePlatform === '99' ? '✓ 通过' : '✗ 失败');
  console.log('验证 nonce (32位):', parsedHeaderMap2.nonce.length === 32 ? '✓ 通过' : '✗ 失败');
  console.log('验证 sign (32位MD5):', parsedHeaderMap2.sign.length === 32 ? '✓ 通过' : '✗ 失败');
  console.log('验证 timestamp (数字):', typeof parsedHeaderMap2.timestamp === 'number' ? '✓ 通过' : '✗ 失败');
}

/**
 * 测试 sendExamApiRequest 函数
 * 注意：此测试需要实际的网络环境，仅用于手动测试
 */
async function testSendExamApiRequest() {
  console.log('\n=== 测试 sendExamApiRequest 函数 ===');
  console.log('注意：此测试需要实际的网络环境，仅用于手动测试');

  // 恢复 Cookie
  (global.document as any).cookie = 'sessionInfo={"sid":"BD43D2FA8A544B948D91650FF7CFF42D","userId":"123456"}';

  // 测试 1: 查询题目答案
  console.log('\n测试 1: 查询题目答案 (需要实际网络环境)');
  console.log('测试代码:');
  console.log(`
    const response = await sendExamApiRequest({
      method: 'GET',
      apiPath: '/exam/new/queryQuestionAnswer.do',
      params: {
        examId: '1301471',
        attemptId: '231130B0A46C4695A6CD587B7E568870'
      }
    });
    console.log('响应:', response);
  `);

  // 测试 2: 查询考试试卷
  console.log('\n测试 2: 查询考试试卷 (需要实际网络环境)');
  console.log('测试代码:');
  console.log(`
    const response = await sendExamApiRequest({
      method: 'POST',
      apiPath: '/exam/new/queryNewExamPaper.do',
      body: {
        examId: '1301471'
      }
    });
    console.log('响应:', response);
  `);

  // 测试 3: 提交题目答案
  console.log('\n测试 3: 提交题目答案 (需要实际网络环境)');
  console.log('测试代码:');
  console.log(`
    const response = await sendExamApiRequest({
      method: 'POST',
      apiPath: '/exam/new/submitQuestionAnswer.do',
      body: [{
        attemptId: '231130B0A46C4695A6CD587B7E568870',
        examId: '1301471',
        testNo: '30307695',
        answerList: [],
        questionId: '8122189',
        questionNodesAnswer: [],
        images: []
      }]
    });
    console.log('响应:', response);
  `);
}

/**
 * 执行所有测试
 */
async function runAllTests() {
  console.log('========================================');
  console.log('开始执行 exam-utils 工具函数测试');
  console.log('========================================\n');

  testGetSid();
  testGenerateHeaderMap();
  await testSendExamApiRequest();

  console.log('\n========================================');
  console.log('测试完成');
  console.log('========================================');
}

// 导出测试函数
export {
  testGetSid,
  testGenerateHeaderMap,
  testSendExamApiRequest,
  runAllTests
};

// 如果直接运行此文件，执行所有测试
if (require.main === module) {
  runAllTests().catch(console.error);
}