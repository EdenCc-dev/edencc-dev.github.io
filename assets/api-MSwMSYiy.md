Cysic API 接口文档

基础信息
- 响应格式: JSON
- 通用响应结构:
{
    "msg": "string",
    "code": "integer",
    "data": "object"
}

1. 系统接口

1.1 健康检查
- 路径: /health
- 方法: GET
- 描述: 检查系统健康状态
- 响应: 200 OK

1.2 文件上传
- 路径: /api/v1/upload
- 方法: POST
- 描述: 上传图片文件
- 请求参数:
  - file: 文件（仅支持图片格式，最大8MB）
- 响应数据:
{
    "msg": "success",
    "code": 0,
    "data": "/images/filename"
}

1.3 地址转换
- 路径: /api/v1/convertAddr
- 方法: GET
- 描述: 转换以太坊地址和Cosmos地址
- 请求参数:
  - addr: 地址字符串（必填）
- 响应数据:
{
    "msg": "success",
    "code": 0,
    "data": {
        "eth_addr": "string",
        "cosmos_addr": "string"
    }
}

2. 用户相关接口

2.1 更新用户信息
- 路径: /api/v1/user/updateProfile
- 方法: POST
- 描述: 更新用户个人信息
- 请求体:
{
    "name": "string",
    "avatarUrl": "string"
}
- 响应数据:
{
    "msg": "success",
    "code": 0
}

2.2 获取用户信息
- 路径: /api/v1/user/profile
- 方法: GET
- 描述: 获取用户个人信息
- 响应数据:
{
    "msg": "success",
    "code": 0,
    "data": {
        "name": "test",
        "avatarUrl": "https://test.com/test.png"
    }
}

2.3 获取用户概览
- 路径: /api/v1/user/overview
- 方法: GET
- 描述: 获取用户首页统计信息
- 响应数据:
{
    "msg": "success",
    "code": 0,
    "data": {
        "name": "test",
        "avatarUrl": "https://test.com/test.png",
        "inviteCode": "test",
        "balance": {
            "amount": "100.1234",
            "symbol": "test"
        },
        "voucherCnt": 100,
        "rewardList": [
            {
                "amount": "100.1234",
                "symbol": "CGT"
            },
            {
                "amount": "999.1234",
                "symbol": "CYS"
            }
        ],
        "socialAccountList": {
            "google": {"name": "gg@gmail.com"},
            "x": {"name": "@ppii"},
            "discord": {"name": "test"}
        },
        "nftCnt": 100
    }
}

3. 社交媒体相关接口

3.1 获取任务分组列表
- 路径: /api/v1/social/task/group/list
- 方法: GET
- 描述: 获取社交媒体任务分组列表
- 响应数据:
{
    "msg": "success",
    "code": 0,
    "data": {
        "taskGroupList": [
            {
                "id": 1,
                "name": "EARN CGT REWARDS",
                "sort": 1
            },
            {
                "id": 2,
                "name": "DIGITAL HARVESTER",
                "sort": 2
            },
            {
                "id": 3,
                "name": "ZK MULTIPLIER",
                "sort": 3
            }
        ]
    }
}

3.2 获取任务列表
- 路径: /api/v1/social/task/list
- 方法: GET
- 描述: 获取社交媒体任务列表
- 请求参数:
  - groupId: 分组ID（必填，整数）
  - pageNum: 页码（必填，整数）
  - pageSize: 每页数量（必填，整数）
- 响应数据:
{
    "msg": "success",
    "code": 0,
    "data": {
        "taskList": [
            {
                "id": 1,
                "title": "taskTitle1",
                "description": "task in group: 1, pageNum: 1, pageSize: 10",
                "status": "0"
            },
            {
                "id": 2,
                "title": "taskTitle2",
                "description": "task in group: 1, pageNum: 1, pageSize: 10",
                "status": "1"
            },
            {
                "id": 3,
                "title": "taskTitle3",
                "description": "task in group: 1, pageNum: 1, pageSize: 10",
                "status": "2"
            }
        ]
    }
}

3.3 绑定Google账号
- 路径: /api/v1/social/bind/google
- 方法: POST
- 描述: 绑定Google社交媒体账号

4. 邀请相关接口

4.1 绑定邀请码
- 路径: /api/v1/referral/bind
- 方法: POST
- 描述: 绑定邀请码
- 请求体:
{
    "code": "string"
}
- 响应数据:
{
    "msg": "success",
    "code": 0
}

4.2 获取邀请概览
- 路径: /api/v1/referral/overview
- 方法: GET
- 描述: 获取邀请系统概览信息
- 响应数据:
{
    "msg": "success",
    "code": 0,
    "data": {
        "inviteCode": "test",
        "referralEaringList": [
            {
                "amount": "222",
                "symbol": "CYS"
            },
            {
                "amount": "111",
                "symbol": "CGT"
            }
        ],
        "upgradeEaring": {
            "amount": "123.456",
            "symbol": "CGT"
        },
        "currentLevelID": 2
    }
}

4.3 获取等级列表
- 路径: /api/v1/referral/levelList
- 方法: GET
- 描述: 获取邀请等级列表
- 响应数据:
{
    "msg": "success",
    "code": 0,
    "data": {
        "levelList": [
            {
                "id": 1,
                "level": 1,
                "name": "Bronze",
                "reward": {
                    "amount": "100",
                    "symbol": "CYS"
                },
                "needInviteCnt": 0,
                "poolFee": "1%"
            },
            {
                "id": 2,
                "level": 2,
                "name": "Silver",
                "reward": {
                    "amount": "10",
                    "symbol": "CYS"
                },
                "needInviteCnt": 10,
                "poolFee": "2%"
            },
            {
                "id": 3,
                "level": 3,
                "name": "Gold",
                "reward": {
                    "amount": "100",
                    "symbol": "CYS"
                },
                "needInviteCnt": 20,
                "poolFee": "3%"
            },
            {
                "id": 4,
                "level": 4,
                "name": "Platinum",
                "reward": {
                    "amount": "1000",
                    "symbol": "CYS"
                },
                "needInviteCnt": 30,
                "poolFee": "4%"
            },
            {
                "id": 5,
                "level": 5,
                "name": "Diamond",
                "reward": {
                    "amount": "10000",
                    "symbol": "CYS"
                },
                "needInviteCnt": 100,
                "poolFee": "5%"
            }
        ]
    }
}

4.4 获取团队列表
- 路径: /api/v1/referral/teamList
- 方法: GET
- 描述: 获取邀请团队列表
- 响应数据:
{
    "msg": "success",
    "code": 0,
    "data": {
        "leaderInfo": {
            "address": "0x1111111111111111111111111111111111111111",
            "status": 1,
            "joinAt": "2021-01-01 01:01:01",
            "referralRewardList": []
        },
        "teamList": [
            {
                "address": "0x2222222222222222222222222222222222222222",
                "status": 1,
                "joinAt": "2021-02-02 02:02:02",
                "referralRewardList": [
                    {
                        "amount": "100",
                        "symbol": "CYS"
                    },
                    {
                        "amount": "100",
                        "symbol": "CGT"
                    }
                ]
            },
            {
                "address": "0x3333333333333333333333333333333333333333",
                "status": 0,
                "joinAt": "2021-03-03 03:03:03",
                "referralRewardList": [
                    {
                        "amount": "100",
                        "symbol": "CYS"
                    },
                    {
                        "amount": "50",
                        "symbol": "CGT"
                    }
                ]
            }
        ]
    }
}

5. ZK任务相关接口

5.1 获取ZK任务概览
- 路径: /api/v1/zkTask/overview
- 方法: GET
- 描述: 获取ZK任务概览信息
- 响应数据:
{
    "msg": "success",
    "code": 0,
    "data": {
        "rewardList": [
            {
                "amount": "100",
                "symbol": "CYS"
            },
            {
                "amount": "100",
                "symbol": "CGT"
            }
        ],
        "voucherCnt": 10,
        "inviteCode": "123456",
        "successInviteCnt": 76,
        "multiplierPercent": 78,
        "proverTaskCompletedCnt": 10,
        "verifierTaskCompletedCnt": 30,
        "proverStatus": {
            "nftActive": 1,
            "selfActive": 0
        },
        "verifierStatus": {
            "standardActive": 0,
            "mobileActive": 1
        },
        "projectStatus": {
            "ongoingCnt": 100,
            "underReviewCnt": 9
        }
    }
}

5.2 获取阶段1奖励详情
- 路径: /api/v1/zkTask/reward/phase1
- 方法: GET
- 描述: 获取ZK任务阶段1奖励详情
- 响应数据:
{
    "msg": "success",
    "code": 0,
    "data": {
        "activity": "8200",
        "staking": "100"
    }
}

5.3 获取阶段2奖励详情
- 路径: /api/v1/zkTask/reward/phase2
- 方法: GET
- 描述: 获取ZK任务阶段2奖励详情
- 响应数据:
{
    "msg": "success",
    "code": 0,
    "data": {
        "claimable": "100",
        "cys": {
            "total": "10000",
            "prover": "1000",
            "verifier": "2000",
            "activity": "3000",
            "staking": "4000"
        },
        "cgt": {
            "total": "10000",
            "prover": "1000",
            "verifier": "2000",
            "activity": "3000",
            "staking": "4000"
        }
    }
}

5.4 获取阶段3奖励详情
- 路径: /api/v1/zkTask/reward/phase3
- 方法: GET
- 描述: 获取ZK任务阶段3奖励详情
- 响应数据:
{
    "msg": "success",
    "code": 0,
    "data": {
        "CYS": {
            "total": "15000",
            "income": {
                "prover": "1000",
                "verifier": "2000",
                "activity": "3000",
                "staking": "4000",
                "others": "5000"
            },
            "information": {
                "convertable": "1000",
                "stakedAmount": "",
                "reservedAmount": ""
            },
            "cost": {
                "maintenanceFee": ""
            }
        },
        "CGT": {
            "total": "15000",
            "income": {
                "prover": "1000",
                "verifier": "2000",
                "activity": "3000",
                "staking": "4000",
                "others": "5000"
            },
            "information": {
                "convertable": "1000",
                "stakedAmount": "2000",
                "reservedAmount": "3000"
            },
            "cost": {
                "maintenanceFee": "4000"
            }
        }
    }
}

5.5 获取代币转换历史
- 路径: /api/v1/zkTask/convertHistory
- 方法: GET
- 描述: 获取代币转换历史记录
- 请求参数:
  - page: 页码（必填，整数）
  - pageSize: 每页数量（必填，整数）
- 响应数据:
{
    "msg": "success, page: 1, pageSize: 10",
    "code": 0,
    "data": {
        "historyList": [
            {
                "fromCoin": "CYS",
                "toCoin": "CGT",
                "amount": "1000",
                "convertTime": "2021-01-01 12:00:00"
            },
            {
                "fromCoin": "CGT",
                "toCoin": "CYS",
                "amount": "9",
                "convertTime": "2021-02-02 12:00:00"
            }
        ]
    }
}

6. 质押相关接口

6.1 获取质押验证者列表
- 路径: /api/v1/stake/list
- 方法: GET
- 描述: 获取质押验证者列表
- 响应数据:
{
    "msg": "success",
    "code": 0,
    "data": {
        "validatorList": [
            {
                "validatorName": "validator1",
                "stake": {
                    "amount": "100",
                    "symbol": "CYS"
                },
                "votingPower": {
                    "amount": "100",
                    "symbol": "CYS"
                },
                "votingPowerPercent": "9.87%",
                "commissionRate": "10%",
                "apr": "5%"
            }
        ]
    }
}

7. 验证者相关接口

7.1 获取活跃验证者列表
- 路径: /api/v1/validator/activeList
- 方法: GET
- 描述: 获取当前活跃的验证者列表
- 响应数据:
{
    "msg": "success",
    "code": 0,
    "data": {
        "validatorList": [
            {
                "validatorName": "validator1",
                "votingPower": {
                    "amount": "100",
                    "symbol": "CYS"
                },
                "votingPowerPercent": "9.87%",
                "commissionRate": "10%"
            }
        ]
    }
}
