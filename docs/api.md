### 获取知识阅读也就是贡献积分接口

```powershell
curl --location --request GET 'https://zsgl.lzlj.com/learn/app/clientapi/knowledgecloud/page/details.do?pageId=6d424ae30d064ae38560868164bbdec4&sid=73518BBDEDAC441487A6B73AB69A8D77&os=99' \
--header 'Pragma: no-cache' \
--header 'headerMap: {"appId":"com.pingan.zhiniao","nonce":"3b9bd3a32e6a944a3e29a23f2a75a186","sign":"74f7215bc093959c20f64ce6842fae36","timestamp":1773283571624,"appDevicePlatform":"99"}' \
--header 'Cookie: linktokenprod=crm_54654173-aed4-4bb1-accc-0e5b49e02362; acw_tc=781bad4817732830176275208e60200a0f3498b83a62e308bb2f6b8db8bc8b'
```

响应值

```JSON
{
    "code": 0,
    "body": {
        "auditStatus": null,
        "businessId": "",
        "canEdit": 1,
        "canView": 1,
        "content": "<p data-elementId=\"d6a03dd70853455eaef29ad603ef4011\"><br></p>",
        "contributionDraft": 0,
        "copyDownloadAuth": true,
        "createUserImg": "https://zsglcdn.lzlj.com/learn/app/default1",
        "createdBy": "51A0C28038F643F59B89D714776508D3",
        "createdDate": "2026-03-11 10:25:00",
        "createdName": "郭涛",
        "empId": "840596",
        "enterpriseId": "4CBD2DCF150D4D7CAED987527777E5C5",
        "firstMaterialUrl": "",
        "id": "6d424ae30d064ae38560868164bbdec4",
        "isContribute": false,
        "isDel": 0,
        "isDraft": true,
        "isExtendsSpaceAuth": 1,
        "isSpaceOperate": 0,
        "isSubmitter": false,
        "isUse": 0,
        "knowledgeSpaceId": "ZSKJ20240909141677",
        "lastUpdateDate": "2026-03-11 10:26:01",
        "linkId": "",
        "memberInfo": null,
        "name": "新页面",
        "operateLinkId": "",
        "orgId": "bf8d01be6aeb11edbb37fa163eb221bd",
        "pageFullPath": "国窖武汉24级大学生知识空间 / 新页面",
        "pageLevel": "1",
        "pageRole": null,
        "pageType": 2,
        "parentPageId": "",
        "pointList": [
            {
                "attrLabelAndValues": [],
                "attributeId": "",
                "attributeLabelValue": [],
                "attributeName": "",
                "attributeType": null,
                "content": "<p data-elementId=\"d6a03dd70853455eaef29ad603ef4011\"><br></p>",
                "id": "d6a03dd70853455eaef29ad603ef4011",
                "isHideParagraph": null,
                "isOpenTimeQuantum": null,
                "pointList": [],
                "quoteNum": 0,
                "relateList": [
                    {
                        "className": "",
                        "content": "",
                        "docType": null,
                        "headLevel": "",
                        "indent": "",
                        "isDel": null,
                        "isEncryption": null,
                        "pageId": "",
                        "pointId": "",
                        "resourcesDesc": "",
                        "resourcesFileType": "",
                        "resourcesHeight": null,
                        "resourcesId": "",
                        "resourcesName": "",
                        "resourcesSize": null,
                        "resourcesStatus": null,
                        "resourcesType": null,
                        "resourcesUrl": "",
                        "resourcesWidth": null,
                        "text": "",
                        "type": 0
                    }
                ],
                "storehouseAttribute": null,
                "text": "",
                "timeFormat": ""
            }
        ],
        "primaryAuthorList": [
            {
                "authorType": 1,
                "avatar": "https://zsglcdn.lzlj.com/learn/app/default1",
                "createdBy": "51A0C28038F643F59B89D714776508D3",
                "createdDate": "2026-03-12 11:46",
                "createdName": "",
                "empName": "郭涛",
                "empNo": "840596",
                "enterpriseId": "4CBD2DCF150D4D7CAED987527777E5C5",
                "id": "9b86b7e4242945e4b91ca2ff79f4b258",
                "idMlnEmp": "815FDE3440E24A7EB633649838D54D32",
                "knowledgePageId": "6d424ae30d064ae38560868164bbdec4",
                "knowledgePageIdList": [],
                "moduleKey": 1,
                "sex": "M",
                "status": 0,
                "updatedBy": "51A0C28038F643F59B89D714776508D3",
                "updatedDate": "2026-03-12 11:46",
                "updatedName": "",
                "userId": "51A0C28038F643F59B89D714776508D3"
            }
        ],
        "processId": "",
        "shareLinkId": "",
        "spaceName": "国窖武汉24级大学生知识空间",
        "status": 1,
        "storeHouseName": "",
        "storehouseId": "",
        "storehouseList": [],
        "supportingAuthorList": [],
        "tagList": [],
        "updateUserImg": "https://zsglcdn.lzlj.com/learn/app/default1",
        "updatedBy": "51A0C28038F643F59B89D714776508D3",
        "updatedName": "郭涛",
        "version": 1
    },
    "message": "成功"
}
```

### 获取知识分享积分也就是互动积分接口

```PowerShell
curl --location --request GET 'https://zsgl.lzlj.com/learn/app/clientapi/knowledge/cloud/page/like/isShareOut.do?pageId=6d424ae30d064ae38560868164bbdec4&shareOutType=&sid=73518BBDEDAC441487A6B73AB69A8D77&os=99' \
--header 'Pragma: no-cache' \
--header 'headerMap: {"appId":"com.pingan.zhiniao","nonce":"7a6f94b278da9f18a955ca23b3c45980","sign":"b31cb48a9046b8b77cecb74fcfab4808","timestamp":1773283681462,"appDevicePlatform":"99"}' \
--header 'Cookie: linktokenprod=crm_54654173-aed4-4bb1-accc-0e5b49e02362; acw_tc=781bad4817732830176275208e60200a0f3498b83a62e308bb2f6b8db8bc8b'
```

响应值

```JSON
{
    "body": {
        "body": null,
        "code": 200,
        "message": "ok"
    },
    "code": "0",
    "file": null,
    "message": "成功",
    "user": null
}
```

### 获取积分详情接口

```PowerShell
curl --location --request POST 'https://zsgl.lzlj.com/learn/app/clientapi/personal/statistics/queryUserPointPercent.do?os=99&sid=73518BBDEDAC441487A6B73AB69A8D77' \
--header 'Language: zh' \
--header 'Pragma: no-cache' \
--header 'headerMap: {"appId":"com.mlearning.paznluzhoulaojiao","nonce":"3ed5c22b659e4eca4c60df33cfb93237","sign":"2082da99e966c87f6a6767dc8832aed9","timestamp":1773284387917,"appDevicePlatform":"99"}' \
--header 'sid: 73518BBDEDAC441487A6B73AB69A8D77' \
--header 'Cookie: linktokenprod=crm_54654173-aed4-4bb1-accc-0e5b49e02362; acw_tc=781bad4817732830176275208e60200a0f3498b83a62e308bb2f6b8db8bc8b' \
--header 'Content-Type: application/json;charset=UTF-8' \
--data-raw '{"startTime":"2026-01-01","endTime":"2026-12-31"}'
```

响应值

```JSON
{
    "body": [
        {
            "rate": 55.0,
            "ruleId": "46EA49C2D06E49BD9C59F21B94687D59",
            "ruleName": "参加培训班",
            "userPoint": 100
        },
        {
            "rate": 14.0,
            "ruleId": "knowledge_shared",
            "ruleName": "知识被分享",
            "userPoint": 25
        },
        {
            "rate": 9.0,
            "ruleId": "24E2D4D119E74B76AC349FA12A0B646C",
            "ruleName": "学习课程",
            "userPoint": 16
        },
        {
            "rate": 8.0,
            "ruleId": "knowledge_read_point",
            "ruleName": "知识被阅读",
            "userPoint": 15
        },
        {
            "rate": 14.0,
            "ruleId": "other",
            "ruleName": "其他",
            "userPoint": 25
        }
    ],
    "code": "0",
    "file": null,
    "message": "成功",
    "user": null
}
```

