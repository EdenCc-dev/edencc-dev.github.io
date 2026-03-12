Cysic Server API 文档

基本信息

- 标题: Cysic Server API
- 版本: 1.0.0
- 描述: Cysic Server API 文档
- 基础路径: `/api/v1`
- 协议: HTTP, HTTPS

目录

- [用户相关接口](#用户相关接口)
- [社交任务相关接口](#社交任务相关接口)
- [邀请相关接口](#邀请相关接口)
- [ZK任务相关接口](#zk任务相关接口)
- [质押相关接口](#质押相关接口)
- [验证者相关接口](#验证者相关接口)
- [数据模型](#数据模型)

用户相关接口

更新用户信息

- URL: `/user/updateProfile`
- 方法: POST
- 描述: 更新用户信息

请求参数

参数名
类型
必填
描述
name
string
是
用户名
avatarUrl
string
是
头像URL

响应

{
  "code": 0,
  "msg": "success"
}

获取用户信息

- URL: `/user/profile`
- 方法: GET
- 描述: 获取用户信息

响应

{
  "code": 0,
  "msg": "success",
  "name": "用户名",
  "avatarUrl": "头像URL"
}

获取用户概览信息

- URL: `/user/overview`
- 方法: GET
- 描述: 获取用户概览信息

响应

{
  "code": 0,
  "msg": "success",
  "userProfile": {
    "name": "用户名",
    "avatarUrl": "头像URL"
  },
  "inviteCode": "邀请码",
  "balance": {
    "symbol": "币种符号",
    "amount": "数量"
  },
  "voucherCnt": 0,
  "rewardList": [
    {
      "symbol": "币种符号",
      "amount": "数量"
    }
  ],
  "socialAccount": {
    "google": {
      "name": "Google账号名称"
    },
    "x": {
      "name": "X账号名称"
    },
    "discord": {
      "name": "Discord账号名称"
    }
  },
  "nftCnt": 0
}

领取测试币

- URL: `/user/faucet`
- 方法: GET
- 描述: 领取测试币

响应

{
  "code": 0,
  "msg": "success"
}

获取上次领水信息

- URL: `/user/faucet/last`
- 方法: GET
- 描述: 获取上次领水信息

响应

{
  "code": 0,
  "msg": "success",
  "lastClaimAt": "2023-01-01T00:00:00Z",
  "amount": "数量"
}

社交任务相关接口

获取社交任务分组列表

- URL: `/social/task/group/list`
- 方法: GET
- 描述: 获取社交任务分组列表

请求参数

参数名
类型
必填
描述
page
integer
否
页码
pageSize
integer
否
每页数量

响应

{
  "code": 0,
  "msg": "success",
  "taskGroupList": [
    {
      "id": 1,
      "sort": 1,
      "name": "分组名称"
    }
  ]
}

获取社交任务列表

- URL: `/social/task/list`
- 方法: GET
- 描述: 获取社交任务列表

请求参数

参数名
类型
必填
描述
groupId
integer
是
分组ID
pageNum
integer
否
页码
pageSize
integer
否
每页数量

响应

{
  "code": 0,
  "msg": "success",
  "taskList": [
    {
      "id": 1,
      "group_id": 1,
      "title": "任务标题",
      "description": "任务描述",
      "status": "任务状态"
    }
  ]
}

邀请相关接口

绑定邀请码

- URL: `/referral/bind`
- 方法: POST
- 描述: 绑定邀请码

请求参数

参数名
类型
必填
描述
code
string
是
邀请码

响应

{
  "code": 0,
  "msg": "success"
}

获取邀请等级列表

- URL: `/referral/levelList`
- 方法: GET
- 描述: 获取邀请等级列表

响应

{
  "code": 0,
  "msg": "success",
  "levelList": [
    {
      "id": 1,
      "level": 1,
      "name": "等级名称",
      "needInviteCnt": 10,
      "reward": {
        "symbol": "币种符号",
        "amount": "数量"
      },
      "poolFee": "池子费用"
    }
  ]
}

获取邀请概览信息

- URL: `/referral/overview`
- 方法: GET
- 描述: 获取邀请概览信息

响应

{
  "code": 0,
  "msg": "success",
  "inviteCode": "邀请码",
  "referralEaringList": [
    {
      "symbol": "币种符号",
      "amount": "数量"
    }
  ],
  "upgradeEaring": {
    "symbol": "币种符号",
    "amount": "数量"
  },
  "currentLevelID": 1
}

获取团队信息

- URL: `/referral/teamList`
- 方法: GET
- 描述: 获取团队信息

请求参数

参数名
类型
必填
描述
pageNum
integer
否
页码
pageSize
integer
否
每页数量

响应

{
  "code": 0,
  "msg": "success",
  "leaderInfo": {
    "address": "地址",
    "status": 1,
    "joinAt": "加入时间",
    "referralRewardList": [
      {
        "symbol": "币种符号",
        "amount": "数量"
      }
    ]
  },
  "teamList": [
    {
      "address": "地址",
      "status": 1,
      "joinAt": "加入时间",
      "referralRewardList": [
        {
          "symbol": "币种符号",
          "amount": "数量"
        }
      ]
    }
  ],
  "totalCnt": 10
}

ZK任务相关接口

获取ZK任务概览

- URL: `/zkTask/overview`
- 方法: GET
- 描述: 获取ZK任务概览

响应

{
  "code": 0,
  "msg": "success",
  "rewardList": [
    {
      "symbol": "币种符号",
      "amount": "数量"
    }
  ],
  "voucherCnt": 0,
  "inviteCode": "邀请码",
  "successInviteCnt": 0,
  "multiplierPercent": 0,
  "proverTaskCompletedCnt": 0,
  "verifierTaskCompletedCnt": 0,
  "proverStatus": {
    "nftActive": 0,
    "selfActive": 0
  },
  "verifierStatus": {
    "standardActive": 0,
    "mobileActive": 0
  },
  "projectStatus": {
    "ongoingCnt": 0,
    "underReviewCnt": 0
  }
}

获取ZK任务Phase1奖励详情

- URL: `/zkTask/reward/phase1`
- 方法: GET
- 描述: 获取ZK任务Phase1奖励详情

响应

{
  "code": 0,
  "msg": "success",
  "activity": "活动名称",
  "staking": "质押"
}

获取ZK任务Phase2奖励详情

- URL: `/zkTask/reward/phase2`
- 方法: GET
- 描述: 获取ZK任务Phase2奖励详情

响应

{
  "code": 0,
  "msg": "success",
  "claimable": "可领取数量",
  "cys": {
    "total": "总量",
    "prover": "prover获得的奖励",
    "verifier": "verifier获得的奖励",
    "activity": "活动获得的奖励",
    "staking": "质押获得的奖励"
  },
  "cgt": {
    "total": "总量",
    "prover": "prover获得的奖励",
    "verifier": "verifier获得的奖励",
    "activity": "活动获得的奖励",
    "staking": "质押获得的奖励"
  }
}

获取ZK任务Phase3奖励详情

- URL: `/zkTask/reward/phase3`
- 方法: GET
- 描述: 获取ZK任务Phase3奖励详情

响应

{
  "code": 0,
  "msg": "success",
  "cysIncomeDetail": {
    "total": "总量",
    "income": {
      "prover": "prover获得的奖励",
      "verifier": "verifier获得的奖励",
      "activity": "活动获得的奖励",
      "staking": "质押获得的奖励",
      "others": "其他获得的奖励"
    },
    "information": {
      "convertable": "可转换数量",
      "stakedAmount": "质押数量",
      "reservedAmount": "预留数量"
    },
    "cost": {
      "maintenanceFee": "维护费"
    }
  },
  "cgtIncomeDetail": {
    "total": "总量",
    "income": {
      "prover": "prover获得的奖励",
      "verifier": "verifier获得的奖励",
      "activity": "活动获得的奖励",
      "staking": "质押获得的奖励",
      "others": "其他获得的奖励"
    },
    "information": {
      "convertable": "可转换数量",
      "stakedAmount": "质押数量",
      "reservedAmount": "预留数量"
    },
    "cost": {
      "maintenanceFee": "维护费"
    }
  }
}

获取代币转换历史

- URL: `/zkTask/convertHistory`
- 方法: GET
- 描述: 获取代币转换历史

响应

{
  "code": 0,
  "msg": "success",
  "historyList": [
    {
      "fromCoin": "从哪个币种转换",
      "toCoin": "转换到哪个币种",
      "amount": "转换数量",
      "convertTime": "转换时间"
    }
  ]
}

质押相关接口

获取质押列表

- URL: `/stake/list`
- 方法: GET
- 描述: 获取质押列表

响应

{
  "code": 0,
  "msg": "success",
  "validatorList": [
    {
      "validatorName": "验证者名称",
      "stake": {
        "symbol": "币种符号",
        "amount": "数量"
      },
      "votingPower": {
        "symbol": "币种符号",
        "amount": "数量"
      },
      "votingPowerPercent": "投票权重百分比",
      "commissionRate": "佣金率",
      "apr": "年化收益率"
    }
  ]
}

验证者相关接口

获取活跃验证者列表

- URL: `/validator/activeList`
- 方法: GET
- 描述: 获取活跃验证者列表

响应

{
  "code": 0,
  "msg": "success",
  "validatorList": [
    {
      "validatorName": "验证者名称",
      "votingPower": {
        "symbol": "币种符号",
        "amount": "数量"
      },
      "votingPowerPercent": "投票权重百分比",
      "commissionRate": "佣金率"
    }
  ]
}

数据模型

Base

字段名
类型
描述
code
integer
响应码
msg
string
响应消息

Coin

字段名
类型
描述
symbol
string
币种符号
amount
string
数量

UserProfile

字段名
类型
描述
name
string
用户名
avatarUrl
string
头像URL

SocialAccountInfo

字段名
类型
描述
google
SocialAccountGoogle
Google账号信息
x
SocialAccountX
X账号信息
discord
SocialAccountDiscord
Discord账号信息

SocialAccountGoogle

字段名
类型
描述
name
string
Google账号名称

SocialAccountX

字段名
类型
描述
name
string
X账号名称

SocialAccountDiscord

字段名
类型
描述
name
string
Discord账号名称

SocialTaskGroup

字段名
类型
描述
id
integer
分组ID
sort
integer
排序
name
string
分组名称

SocialTask

字段名
类型
描述
id
integer
任务ID
group_id
integer
分组ID
title
string
任务标题
description
string
任务描述
status
string
任务状态

ReferralLevel

字段名
类型
描述
id
integer
等级ID
level
integer
等级
name
string
等级名称
needInviteCnt
integer
所需邀请人数
reward
Coin
奖励
poolFee
string
池子费用

ReferralTeamMemberInfo

字段名
类型
描述
address
string
地址
status
integer
状态
joinAt
string
加入时间
referralRewardList
Coin[]
邀请奖励列表

ProverStatus

字段名
类型
描述
nftActive
integer
NFT状态
selfActive
integer
客户端状态

VerifierStatus

字段名
类型
描述
standardActive
integer
PC客户端状态
mobileActive
integer
手机客户端状态

ProjectStatus

字段名
类型
描述
ongoingCnt
integer
进行中数量
underReviewCnt
integer
审核中数量

ZKTaskPhase2RewardCoinDetail

字段名
类型
描述
total
string
总量
prover
string
prover获得的奖励
verifier
string
verifier获得的奖励
activity
string
活动获得的奖励
staking
string
质押获得的奖励

ZKTaskPhase3RewardCoinDetail

字段名
类型
描述
total
string
总量
income
ZKTaskPhase3RewardIncomeDetail
收入详情
information
ZKTaskPhase3RewardInformationDetail
信息详情
cost
ZKTaskPhase3RewardCostDetail
成本详情

ZKTaskPhase3RewardIncomeDetail

字段名
类型
描述
prover
string
prover获得的奖励
verifier
string
verifier获得的奖励
activity
string
活动获得的奖励
staking
string
质押获得的奖励
others
string
其他获得的奖励

ZKTaskPhase3RewardInformationDetail

字段名
类型
描述
convertable
string
可转换数量
stakedAmount
string
质押数量
reservedAmount
string
预留数量

ZKTaskPhase3RewardCostDetail

字段名
类型
描述
maintenanceFee
string
维护费

ZKTaskCoinConvertHistoryDetail

字段名
类型
描述
fromCoin
string
从哪个币种转换
toCoin
string
转换到哪个币种
amount
string
转换数量
convertTime
string
转换时间

StakeValidatorDetail

字段名
类型
描述
validatorName
string
验证者名称
stake
Coin
质押
votingPower
Coin
投票权重
votingPowerPercent
string
投票权重百分比
commissionRate
string
佣金率
apr
string
年化收益率

ValidatorDetail

字段名
类型
描述
validatorName
string
验证者名称
votingPower
Coin
投票权重
votingPowerPercent
string
投票权重百分比
commissionRate
string
佣金率
