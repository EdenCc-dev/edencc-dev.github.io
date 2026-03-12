import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

import axios from "@/service";
import { responseSuccessCode } from "@/config";

export interface IUserProileResponseInSocialTask{
    currentRebateRate: number,
    inviteLevelId: number,
    multiplierFire: number,
    multiplierFireInTotal: number,
    multiplierLevel: number,
    voucherCnt: number,
}

export interface IUserProfile {
  id: number;
  name: string;
  avatarUrl: string;
  hasMatchedWithCosmos: boolean;
}

export interface IBalance {
  symbol: string;
  amount: string;
}

export interface IRewardList {
  symbol: string;
  amount: string;
}

export interface ISocialAccount {
  google: {
    name: string;
  };
  x: {
    name: string;
  };
  discord: {
    name: string;
  };
}


export interface IZkPart {
  successInviteCnt: number;
  multiplierLevel: number; // 当前等级
  multiplierFireInTotal: number; // 总fire
  multiplierFire: number; // 当前等级fire
  proverTaskCompletedCnt: number;
  verifierTaskCompletedCnt: number;
  proverStatus: {
    nftActive: number;
    selfActive: number;
  };
  verifierStatus: {
    standardActive: number;
    mobileActive: number;
  };
  projectStatus: {
    ongoingCnt: number;
    underReviewCnt: number;
  };
}
export interface IRawUserInfo {
  "userProfile": IUserProfile,
  "inviteCode": string,
  "inviteLevelId": number,
  "currentRebateRate": number,
  "balance": IBalance,
  "voucherCnt": number,
  // voucherValidCnt: number,
  "rewardList": IRewardList[],
  "socialAccount": ISocialAccount,
  "nftCnt": number,
  "zkPart": IZkPart
}

export interface IUserInfo extends IRawUserInfo {
  address: string; // 钱包地址
  signature?: string; // 签名
  isSigned?: boolean; // 签名状态
  isRegistered?: boolean; // 注册状态
  isBinded?: boolean; // 新增绑定状态 
  name: string;
  avatarUrl: string;

}

// 用户状态管理接口
interface UserState {
  // 多地址支持
  overviewLoading: boolean;
  addressMap: Record<string, IUserInfo>;
  activeAddress?: string;

  // 管理方法
  setActiveAddress: (address?: string) => void;
  getActiveUser: () => IUserInfo | undefined;
  getUserByAddress: (address: string) => IUserInfo | undefined;
  getAllAddresses: () => string[];

  // 状态更新
  setState: (address: string, newValues: Partial<IUserInfo>) => void;
  setUserInfo: (address: string, info: IUserInfo) => void;
  setSignature: (address: string, signature?: string) => void;
  reset: (address?: string) => void;

  // API相关方法
  verifyInviteCode: (code: string, address: string) => Promise<boolean>;
  fetchUserInfo: (address: string) => Promise<IUserInfo | null>;
  checkBindStatus: (address: string) => Promise<boolean>; // 新增检查绑定状态
  registerUser: (address: string, userData: Partial<IUserInfo>) => Promise<boolean>;

  // 更新hasMatchedWithCosmos
  updateHasMatchedWithCosmos: (address: string, hasMatchedWithCosmos: boolean) => void;
  updateUserProfile: (address: string, userProfile: IUserProileResponseInSocialTask) => void;
}

// 默认初始状态
const defaultInitState = {
  addressMap: {} as Record<string, IUserInfo>,
  activeAddress: undefined as string | undefined,
  overviewLoading: false,
};

const useUser = create<UserState>()(
  persist(
    immer(
      (set, get) =>
      ({
        ...defaultInitState,

        updateUserProfile: (address: string, userProfile?: IUserProileResponseInSocialTask) =>
          set((draft) => {
            if(draft.addressMap[address]){
              if(userProfile?.inviteLevelId){
                draft.addressMap[address].inviteLevelId = userProfile.inviteLevelId
              }
              if(userProfile?.currentRebateRate){
                draft.addressMap[address].currentRebateRate = userProfile.currentRebateRate
              }
              if(userProfile?.voucherCnt){
                draft.addressMap[address].voucherCnt = userProfile.voucherCnt
              }
              if(userProfile?.multiplierFire){
                draft.addressMap[address].zkPart.multiplierFire = userProfile.multiplierFire
              }
              if(userProfile?.multiplierFireInTotal){
                draft.addressMap[address].zkPart.multiplierFireInTotal = userProfile.multiplierFireInTotal
              }
              if(userProfile?.multiplierLevel){
                draft.addressMap[address].zkPart.multiplierLevel = userProfile.multiplierLevel
              }
            }
          }),

        updateHasMatchedWithCosmos: (address: string, hasMatchedWithCosmos: boolean) =>
          set((draft) => {
            if(draft.addressMap[address]?.userProfile){
              draft.addressMap[address].userProfile.hasMatchedWithCosmos = hasMatchedWithCosmos;
            }
          }),
        // 设置当前活跃地址
        setActiveAddress: (address?: string) =>
          set((draft) => {
            draft.activeAddress = address;
          }),

        // 获取当前活跃用户信息
        getActiveUser: () => {
          const { activeAddress, addressMap } = get();
          if (!activeAddress) return undefined;
          return addressMap[activeAddress];
        },

        // 根据地址获取用户信息
        getUserByAddress: (address: string) => {
          return get().addressMap[address];
        },

        // 获取所有已保存的地址
        getAllAddresses: () => {
          return Object.keys(get().addressMap);
        },

        // 更新指定地址的状态
        setState: (address: string, newValues: Partial<IUserInfo>) =>
          set((draft) => {
            // 确保地址记录存在
            if (!draft.addressMap[address]) {
              draft.addressMap[address] = { address };
            }

            // 更新地址对应的状态
            for (const key in newValues) {
              if (Object.prototype.hasOwnProperty.call(newValues, key)) {
                (draft.addressMap[address] as any)[key] = newValues[key as keyof IUserInfo];
              }
            }

            // 签名特殊处理，更新签名状态
            if (newValues.signature !== undefined) {
              draft.addressMap[address].isSigned = !!newValues.signature;
            }
          }),

        // 设置签名
        setSignature: (address: string, signature?: string) =>
          set((draft) => {
            // 确保地址记录存在
            if (!draft.addressMap[address]) {
              draft.addressMap[address] = { address };
            }

            draft.addressMap[address].signature = signature;
            draft.addressMap[address].isSigned = !!signature;
          }),

        // 设置完整用户信息
        setUserInfo: (address: string, info: IUserInfo) =>
          set((draft) => {
            draft.addressMap[address] = { ...info, address };
          }),

        // 重置状态 - 可选择清除特定地址或全部
        reset: (address?: string) =>
          set((draft) => {
            if (address) {
              // 只重置特定地址
              delete draft.addressMap[address];
              // 如果是当前活跃地址，清除活跃地址
              if (draft.activeAddress === address) {
                draft.activeAddress = undefined;
              }
            } else {
              // 重置所有
              draft.addressMap = {};
              draft.activeAddress = undefined;
            }
          }),

        // 验证邀请码 - 实际API调用
        verifyInviteCode: async (code: string, address: string) => {
          try {
            const data: any = await axios.post("/api/v1/referral/bind", {
              code,
            });

            console.log('bind data', data)
            if (data.code == responseSuccessCode) {
              // 绑定成功，更新状态
              set((draft) => {
                if (!draft.addressMap[address]) {
                  draft.addressMap[address] = { address };
                }
                draft.addressMap[address].inviteCode = code;
                draft.addressMap[address].isRegistered = true;
                draft.addressMap[address].isBinded = true; // 设置绑定状态
              });

              return true;
            }
            if (data.code == 10024) {
              set((draft) => {
                if (!draft.addressMap[address]) {
                  draft.addressMap[address] = { address };
                }
                draft.addressMap[address].isRegistered = true;
              });
              return true;
            }
            return false;
          } catch (error) {
            console.error("绑定邀请码失败", error);
            return false;
          }
        },

        // 检查绑定状态 - 新增
        checkBindStatus: async (address: string) => {
          try {
            // 调用绑定状态API
            const data: any = await axios.get("/api/v1/referral/isBound");

            if (data.code == responseSuccessCode) {
              const isBinded = !!data.data.isBound;

              // 更新状态
              set((draft) => {
                if (!draft.addressMap[address]) {
                  draft.addressMap[address] = { address };
                }
                draft.addressMap[address].isBinded = isBinded;
              });

              return isBinded;
            }

            return false;
          } catch (error) {
            console.error("检查绑定状态失败", error);
            return false;
          }
        },

        // 获取用户信息 - 实际API调用
        fetchUserInfo: async (address: string) => {
          try {
            // 获取用户概览信息
            set((draft) => {
              draft.addressMap[address].overviewLoading = true;
            })
            const data: any = await axios.get("/api/v1/user/overview");

            if (data.code == responseSuccessCode) {
              const userInfo = data.data as IRawUserInfo;

              // 直接更新状态，保留原有处理方式
              set((draft) => {
                if (!draft.addressMap[address]) {
                  draft.addressMap[address] = { address };
                }

                // 直接复制API返回的所有字段
                for (const key in userInfo) {
                  if (Object.prototype.hasOwnProperty.call(userInfo, key)) {
                    draft.addressMap[address][key as keyof IUserInfo] = userInfo[key] as any;
                  }
                }

                // 接口结构更新兼容
                draft.addressMap[address].name = userInfo.userProfile.name;
                draft.addressMap[address].avatarUrl = userInfo.userProfile.avatarUrl;
                draft.addressMap[address].isRegistered = true;
              });

              // 返回当前用户信息
              return {
                ...userInfo,
                name: userInfo.userProfile.name,
                avatarUrl: userInfo.userProfile.avatarUrl,
                address,
                isRegistered: true,
              };
            }

            return null;
          } catch (error) {
            console.error("获取用户信息失败", error);

            // 更新本地状态，标记未注册
            set((draft) => {
              if (!draft.addressMap[address]) {
                draft.addressMap[address] = { address };
              }
              draft.addressMap[address].isRegistered = false;
            });

            return {
              address,
              isRegistered: false,
            };
          } finally {
            set((draft) => {
              draft.addressMap[address].overviewLoading = false;
            })
          }
        },

        // 用户注册/更新资料 - 实际API调用
        registerUser: async (address: string, userData: Partial<IUserInfo>) => {
          try {
            // 准备API请求数据
            const apiData: Record<string, string | undefined> = {};

            // 仅当有值时添加到请求数据
            if (userData.name) apiData.name = userData.name;
            if (userData.avatarUrl) apiData.avatarUrl = userData.avatarUrl;

            // 调用API更新资料
            const data: any = await axios.post(
              "/api/v1/user/updateProfile",
              apiData
            );

            if (data.code == responseSuccessCode) {
              // 更新本地状态
              set((draft) => {
                if (!draft.addressMap[address]) {
                  draft.addressMap[address] = { address };
                }

                // 只更新提交的字段
                if (userData.name) draft.addressMap[address].name = userData.name;
                if (userData.avatarUrl) draft.addressMap[address].avatarUrl = userData.avatarUrl;
              });

              // 更新成功后，获取完整用户信息以保持状态一致
              try {
                await get().fetchUserInfo(address);
              } catch (error) {
                console.error("更新资料后获取用户信息失败", error);
              }

              return true;
            }

            return false;
          } catch (error) {
            console.error("更新用户资料失败", error);
            return false;
          }
        },
      } as unknown as UserState)
    ),
    {
      name: "user",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => {
        return {
          addressMap: state.addressMap,
          activeAddress: state.activeAddress,
        };
      },
    }
  )
);

export default useUser;