import GradientBorderCard from "@/components/GradientBorderCard";
import { PT12Wrapper } from "@/components/Wrappers";
import { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Checkbox,
  cn,
  Divider,
  Input,
  Spinner,
  Tooltip,
} from "@nextui-org/react";
import Button from "@/components/Button";
import { mediasLink } from "@/config";
import { generateQueryString } from "@/utils/tools";
import { ArrowDownToLineIcon, ArrowUpRight, Check } from "lucide-react";
import useKrActivity from "@/models/kr";
import { taskApi, userApi } from "./krApi";
import { toast } from "react-toastify";
import { LoginPage } from "./components/LoginPage";
import Copy from "@/components/Copy";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import i18n from "i18next";

const retweetUrl = 'https://x.com/Cysic_KR/status/1987807782519873717'
const ConnectUs = () => {
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [tgClick, setTgClick] = useState(false);
  const [twitterClick, setTwitterClick] = useState(false);
  const [twitterKRClick, setTwitterKRClick] = useState(false);
  const [retweetClick, setRetweetClick] = useState(false);
  const { t } = useTranslation();
  const [hasConnected, setHasConnected] = useState(false);
  const handleClick = () => {
    dispatchEvent(new CustomEvent("cysic_kr_next_step", { detail: 2 }));
  };

  return (
    <>
      <>
        <Card className="mt-8 rounded-[8px] mx-auto">
          <CardHeader className="flex items-center gap-1 text-black">
            <>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="12"
                  fill="white"
                  className="group-hover/item:fill-black transition-colors duration-200"
                />
                <path
                  d="M17.9615 7.77392L15.9243 17.3209C15.7704 17.9946 15.3697 18.1623 14.8003 17.8451L11.6959 15.572L10.1982 17.0037C10.0323 17.1686 9.89394 17.3061 9.57424 17.3061L9.7975 14.1648L15.5506 8.9991C15.8008 8.77773 15.4961 8.65459 15.1619 8.87644L8.04954 13.3268L4.98761 12.3742C4.3217 12.1677 4.30965 11.7125 5.12648 11.3948L17.1027 6.80988C17.6573 6.60336 18.1423 6.93206 17.9615 7.77392Z"
                  fill="currentColor"
                />
              </svg>

              <div className="text-left ml-1">
                <p className="text-white teachers-16-200 !normal-case">
                  {t("joinTelegramGroup")}
                </p>
                <p className="mt-1 text-sub/40 teachers-14-200 !normal-case">
                  {t("connectWithCommunity")}
                </p>
              </div>
            </>
          </CardHeader>
          <CardBody>
            <a
              href={mediasLink.telegramKR}
              target="_blank"
              className="mx-auto w-full"
              onClick={() => { setTooltipOpen(false); setTgClick(true) }}
            >
              <Button className="w-full " type="light">
                {t("openTelegram")}
              </Button>
            </a>
          </CardBody>
        </Card>

        <Card className="mt-4 rounded-[8px] mx-auto">
          <CardHeader className="flex items-center gap-1 text-black">
            <>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="12"
                  fill="white"
                  className="group-hover/item:fill-black transition-colors duration-200"
                />
                <path
                  d="M12.9989 11.3988L16.9078 6H15.9815L12.5874 10.6877L9.87662 6H6.75L10.8493 13.0886L6.75 18.75H7.67633L11.2605 13.7997L14.1234 18.75H17.25L12.9987 11.3988H12.9989ZM11.7302 13.151L11.3148 12.4452L8.0101 6.82855H9.43288L12.0999 11.3613L12.5152 12.0672L15.9819 17.9591H14.5592L11.7302 13.1513V13.151Z"
                  fill="currentColor"
                />
              </svg>

              <div className="text-left ml-1">
                <p className="text-white teachers-16-200 !normal-case">
                  {t("followOnTwitter")}
                </p>
                <p className="mt-1 text-sub/40 teachers-14-200 !normal-case">
                  {t("stayUpdated")}
                </p>
              </div>
            </>
          </CardHeader>
          <CardBody>
          <div className="flex items-center justify-center gap-2">
              <a
                href={mediasLink.twitter}
                target="_blank"
                className="mx-auto w-full"
                onClick={() => { setTooltipOpen(false); setTwitterClick(true) }}
              >
                <Button className="w-full " type="light">
                  {t("followX", { handler: "@Cysic_xyz" })}
                </Button>
              </a>
              <a
                href={mediasLink.twitterKR}
                target="_blank"
                className="mx-auto w-full"
                onClick={() => { setTooltipOpen(false); setTwitterKRClick(true) }}
              >
                <Button className="w-full " type="light">
                  {t("followX", { handler: "@Cysic_KR" })}
                </Button>
              </a>
            </div>


            <a
                href={retweetUrl}
                target="_blank"
                className="mx-auto w-full mt-2"
                onClick={() => { setTooltipOpen(false); setRetweetClick(true) }}
              >
                <Button className="w-full " type="light">
                  Like And Retweet
                </Button>
              </a>
          </CardBody>
        </Card>


        <div className="mt-8 flex flex-col gap-2 mx-auto justify-center items-center">
          <Tooltip
            isOpen={tooltipOpen}
            content={<>{t("pleaseFollowAllTheMedias")}</>}
            placement="top"
          >
            <Checkbox
              isSelected={hasConnected}
              onValueChange={(v) => {
                if (!tgClick || !twitterClick || !twitterKRClick || !retweetClick) {
                  setTooltipOpen(true);
                  return;
                }
                setHasConnected(v);
              }}
              size="sm"
            >
              {t("iHaveAlreadyFollowed")}
            </Checkbox>
          </Tooltip>
          <Button disabled={!hasConnected} type="light" onClick={handleClick}>
            {t("verifyContinue")}
          </Button>
        </div>
      </>
    </>
  );
};

const Post = () => {
  const { t } = useTranslation();
  const [postLink, setPostLink] = useState("");
  const { firstTask, inviteCodes, systemSetting } = useKrActivity();
  const isInviteCodeEnabled = systemSetting?.enableInviteCode;

  const [pendingVisible, setPendingVisible] = useState(false);

  const handleClick = async () => {
    if (
      !postLink ||
      !postLink.includes("https") ||
      !postLink.includes("x.com/")
    ) {
      toast.error(t("pleaseEnterValidTwitterPostLink"));
      return;
    }

    if (!firstTask?.id) {
      toast.error(t("taskInformationNotAvailable"));
      return;
    }

    try {
      const response = await taskApi.submitTask(firstTask.id, postLink);
      if (response.code === "200" || response.code == "501") {
        toast.success(t("taskSubmittedSuccessfully"));
        setPendingVisible(true);
      } else {
        toast.error(response.msg || t("failedToSubmitTask"));
      }
    } catch (error) {
      toast.error(t("failedToSubmitTask"));
    }
  };

  const handleOpenPost = () => {
    if (!firstTask?.postTwitterTaskConfig?.content) return;

    const codes = inviteCodes?.map((inviteCode: any) => inviteCode.code) || [];

    const link = `https://x.com/intent/post?${generateQueryString({
      text: firstTask?.postTwitterTaskConfig?.content?.replace('{{code}}', `?_c=${codes?.[0]}`) || "",
    })}`;

    window.open(link, "_blank");
  };

  const downloadImage = async (url: string, filename: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      window.open(url, "_blank");
    }
  };

  const handleNextStep = () => {
    dispatchEvent(new CustomEvent("cysic_kr_next_step", { detail: 3 }));
  };

  return (
    <>
      {pendingVisible ? (
        <>
          <div className="mt-8 teachers-18-200 !normal-case mb-8">
            {t("twitterPostBeingVerified")}
          </div>

          <div className="mb-4 text-green-500 bg-green-500/10 p-4 rounded-[8px] flex items-center justify-center">
            <div className="rounded-full inline-flex items-center justify-center p-[2px] border border-green-500 mr-2">
              <Check className="size-3" />
            </div>
            {t("inviteCodeVerified")}
          </div>
          <div className="mb-4 text-green-500 bg-green-500/10 p-4 rounded-[8px] flex items-center justify-center">
            <div className="rounded-full inline-flex items-center justify-center p-[2px] border border-green-500 mr-2">
              <Check className="size-3" />
            </div>
            {t("socialConnectionsCompleted")}
          </div>
          <div className="mb-4 text-orange-500 bg-orange-500/10 p-4 rounded-[8px] flex items-center justify-center">
            <div className="rounded-full inline-flex items-center justify-center p-[2px] border border-orange-500 mr-2 size-5"></div>
            {t("twitterPostVerificationInProgress")}
          </div>

          <Button className="mt-4 w-fit" type="light" onClick={handleNextStep}>
            {t("nextStep")}
          </Button>
        </>
      ) : (
        <div className="mt-8 flex justify-center gap-4">
          <div className="relative border rounded-[8px] bg-white p-1 flex-1">
            <div
              className="absolute top-4 right-4 p-1 border rounded-[6px] hover:bg-white hover:text-black cursor-pointer"
              onClick={handleOpenPost}
            >
              <ArrowUpRight className="size-3" />
            </div>

            <div
              onClick={() =>
                downloadImage(firstTask?.imgUrl, "cysic_x_poster.png")
              }
              className="absolute top-4 right-12 p-1 border rounded-[6px] hover:bg-white hover:text-black cursor-pointer"
            >
              <ArrowDownToLineIcon className="size-3" />
            </div>

            <div className="rounded-[8px] size-full overflow-hidden">
              <img
                className="object-cover size-full"
                src={firstTask?.imgUrl}
                alt={firstTask?.title || "Task Image"}
              />
            </div>
          </div>
          <div className="text-left flex-1">
            <p className="mb-2 text-lg">작업 가이드</p>
            <ul className="list-decimal list-inside text-sub/60 [&_li]:mb-2">
              <li>오른쪽 상단 저장 버튼을 클릭하여, 이미지를 저장해주세요</li>
              <li>저장 옆 버튼을 클릭해서 트위터로 이동해주세요</li>
              <li>해당 스크립트에서 이미지를 첨부해서 포스팅을 진행해주세요</li>
              <li>포스팅된 링크를 아래 넣고 제출해주세요</li>
              {/* <li>{t('copyPostLinkAndPasteBelow')}</li> */}
            </ul>

            <div className="mt-4 mb-2">{t("twitterPostLink")}</div>
            <Input
              classNames={{ input: "text-center" }}
              placeholder="https://x.com/..."
              variant="bordered"
              value={postLink}
              onValueChange={setPostLink}
              isInvalid={
                !!postLink &&
                (!postLink?.includes("https") || !postLink?.includes("x.com/"))
              }
            />
            <Button
              disabled={
                !postLink ||
                !postLink?.includes("https") ||
                !postLink?.includes("x.com/")
              }
              className="mt-4 w-full"
              type="light"
              onClick={handleClick}
            >
              {t("verifyContinue")}
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

const Guidlines = () => {
  const { t } = useTranslation();
  const [userList, setUserList] = useState<
    { avatar: string; username: string; relatedUrl: string }[]
  >([]);

  //   /socialtask/api/v1/user/list?num=123
  useEffect(() => {
    userApi.getUserList(50).then((res) => {
      setUserList(res.list);
    });
  }, []);

  const { inviteCodes: _inviteCodes, systemSetting } = useKrActivity();
  const isInviteCodeEnabled = systemSetting?.enableInviteCode;

  const inviteCodes =
    _inviteCodes?.filter((i: any) => i?.available)?.map((i: any) => i?.code) ||
    [];

  const totalUserList = userList;
  return (
    <>
      <div className="flex flex-col gap-8 w-fit mx-auto">
        <p className="teachers-18-200 !normal-case">
          {t("cysicCommunityMembers")}
        </p>

        <div
          className={cn("grid justify-center items-center")}
          style={{
            gridTemplateColumns: `repeat(${Math.min(
              10,
              totalUserList?.length
            )}, minmax(0, 1fr))`,
          }}
        >
          {totalUserList.map((user, idx) => (
            <Tooltip content={<>{user.username}</>}>
              <a
                href={user.relatedUrl}
                target="_blank"
                key={idx}
                className="flex flex-col items-center justify-center p-2"
              >
                <img
                  src={user.avatar}
                  alt={user.username}
                  className="w-10 h-10 rounded-full"
                />
              </a>
            </Tooltip>
          ))}
        </div>
      </div>

      {isInviteCodeEnabled && (
        <>
          <Divider className="my-8" />
          <div className="flex flex-col gap-8 w-fit mx-auto">
            <p className="teachers-18-200 !normal-case">
              {t("shareInviteCodesWithFriends")}
            </p>

            {inviteCodes?.length > 0 ? (
              <div className="grid grid-cols-3 gap-3 ">
                {inviteCodes?.map((inviteCode: string) => (
                  <Copy
                    key={inviteCode}
                    value={window.location.origin + "/kr?_c=" + inviteCode}
                    className="[&_svg]:size-3 text-sm"
                  >
                    <span className="text-white">{inviteCode}</span>
                  </Copy>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-white/50">
                {t("noInviteCodesAvailable")}
              </div>
            )}
          </div>
        </>
      )}

      <Divider className="my-8" />
      <div className="flex flex-col gap-8 w-fit mx-auto">
        <p className="teachers-18-200 !normal-case">
          {t("campaignDescriptionAndGuidelines")}
        </p>

        <ul className="max-w-[400px] text-left text-sm list-disc list-inside [&_li]:mb-2">
          <li>{t("campaignOnlyOpenToKoreanUsers")}</li>
          <li>{t("preregisteredUsersReceiveExclusiveStamp")}</li>
          <li>{t("onceCountdownEnds")}</li>
          <li>{t("byParticipatingInCampaignMissions")}</li>
        </ul>
      </div>

      <a href="/kr/dashboard">
        <Button className="mt-8" type="light">
          {t("welcomeToDashboard")}
        </Button>
      </a>
    </>
  );
};

const BindAddress = () => {
  const { t } = useTranslation();
  const re = /^0x[a-f0-9]{40}$/i;
  const [address, setAddress] = useState("");

  const handleClick = async () => {
    const response = await userApi.bindAddress(address);
    if (
      response.code === "200" ||
      response.msg == "Address has already been bound and cannot be updated"
    ) {
      toast.success(t("addressBoundSuccessfully"));
      dispatchEvent(new CustomEvent("cysic_kr_next_step", { detail: 4 }));
    } else {
      toast.error(response.msg || t("failedToBindAddress"));
    }
  };

  const isValid =
    address && address.trim().startsWith("0x") && re.test(address.trim());

  return (
    <>
      <div className="flex flex-col gap-8 w-full">
        <p className="teachers-18-200 !normal-case">
          {t("bindYourEVMAddress")}
        </p>

        <Input
          classNames={{ base: "!bg-default-100 rounded-[8px] overflow-hidden" }}
          placeholder={t("enterYourEVMAddress")}
          value={address}
          onValueChange={setAddress}
          isInvalid={!isValid}
        />
        <div className="text-left mx-auto w-fit">
          <p className="mb-2">{t("notice")}</p>
          <ul className="list-decimal list-inside text-sub/60 [&_li]:mb-2">
            <li>거래소 지갑이 아닌 개인 EVM 지갑 주소를 제출해주세요.</li>
            <li>보상이 지급될 지갑이므로, 반드시 사용 가능한 주소를 제출해주세요.</li>
            <li>지갑 분실로 인한 보상 미수령에 대해서는 팀이 책임질 수 없습니다.</li>
          </ul>
        </div>
      </div>

      <Button
        className="mt-8"
        type="light"
        onClick={handleClick}
        disabled={!isValid}
      >
        {t("nextStep")}
      </Button>
    </>
  );
};

// 主组件：根据认证状态显示a模块或b模块
export const KRActivity = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const lng = searchParams.get("lng") || "kr";

  // 监听URL参数变化，切换语言
  useEffect(() => {
    if (lng === "en") {
      i18n.changeLanguage("kr_en");
    } else {
      i18n.changeLanguage("kr");
    }
  }, [lng]);

  const { showLogin, step, loading, systemSetting } = useKrActivity();

  if (showLogin) {
    return <LoginPage />;
  }

  const currentStep = step;

  const EStepName: Record<string, string> = {
    Step1: t("step1"),
    Step2: t("step2"),
    Step3: t("step3"),
    Step4: t("step4"),
  };

  if (loading) {
    return (
      <PT12Wrapper className="w-full">
        <GradientBorderCard borderRadius={8} className="py-8 px-8 text-center">
          <div className="flex justify-center">
            <Spinner size="lg" />
          </div>
        </GradientBorderCard>
      </PT12Wrapper>
    );
  }

  return (
    <>
      <PT12Wrapper className="w-full">
        <GradientBorderCard borderRadius={8} className="py-8 px-8 text-center">
          <h1 className="unbounded-40-300">{t("welcomeTitle")}</h1>
          <h3 className="mt-4 unbounded-18-200 text-sub">
            {t("welcomeSubtitle")}
          </h3>

          <div className="max-w-[800px] mx-auto">
            <div className="flex items-center gap-2 mt-12">
              <div
                className={cn(
                  "flex-1 flex items-center justify-center",
                  currentStep == 1 ? "opacity-100" : "opacity-60"
                )}
              >
                <div className="flex flex-col items-center gap-1">
                  <div
                    className={cn(
                      "border size-6 rounded-full p-[2px]",
                      currentStep > 1 && "border-green-500/40"
                    )}
                  >
                    {currentStep > 1 ? (
                      <div className="rounded-full font-semibold size-full bg-green-500/40 text-green-500 flex items-center justify-center ">
                        <Check className="size-3" />
                      </div>
                    ) : (
                      <div className="rounded-full font-semibold size-full bg-white text-black flex items-center justify-center ">
                        1
                      </div>
                    )}
                  </div>
                  <span className="md:whitespace-nowrap">{t("step1")}</span>
                </div>
              </div>

              <div className="h-px flex-1 bg-sub"></div>

              <div
                className={cn(
                  "flex-1 flex items-center justify-center",
                  currentStep == 2 ? "opacity-100" : "opacity-60"
                )}
              >
                <div className="flex flex-col items-center gap-1">
                  <div
                    className={cn(
                      "border size-6 rounded-full p-[2px]",
                      currentStep > 2 && "border-green-500/40"
                    )}
                  >
                    {currentStep > 2 ? (
                      <div className="rounded-full font-semibold size-full bg-green-500/40 text-green-500 flex items-center justify-center ">
                        <Check className="size-3" />
                      </div>
                    ) : (
                      <div className="rounded-full font-semibold size-full bg-white text-black flex items-center justify-center ">
                        2
                      </div>
                    )}
                  </div>
                  <span className="md:whitespace-nowrap">{t("step2")}</span>
                </div>
              </div>

              <div className="h-px flex-1 bg-sub"></div>

              <div
                className={cn(
                  "flex-1 flex items-center justify-center",
                  currentStep == 3 ? "opacity-100" : "opacity-60"
                )}
              >
                <div className="flex flex-col items-center gap-1">
                  <div
                    className={cn(
                      "border size-6 rounded-full p-[2px]",
                      currentStep > 3 && "border-green-500/40"
                    )}
                  >
                    {currentStep > 3 ? (
                      <div className="rounded-full font-semibold size-full bg-green-500/40 text-green-500 flex items-center justify-center ">
                        <Check className="size-3" />
                      </div>
                    ) : (
                      <div className="rounded-full font-semibold size-full bg-white text-black flex items-center justify-center ">
                        3
                      </div>
                    )}
                  </div>
                  <span className={cn("")}>{t("step3")}</span>
                </div>
              </div>

              <div className="h-px flex-1 bg-sub"></div>

              <div
                className={cn(
                  "flex-1 flex items-center justify-center",
                  currentStep == 4 ? "opacity-100" : "opacity-60"
                )}
              >
                <div className="flex flex-col items-center gap-1">
                  <div
                    className={cn(
                      "border size-6 rounded-full p-[2px]",
                      currentStep > 4 && "border-green-500/40"
                    )}
                  >
                    {currentStep > 4 ? (
                      <div className="rounded-full font-semibold size-full bg-green-500/40 text-green-500 flex items-center justify-center ">
                        <Check className="size-3" />
                      </div>
                    ) : (
                      <div className="rounded-full font-semibold size-full bg-white text-black flex items-center justify-center ">
                        4
                      </div>
                    )}
                  </div>
                  <span className={cn("")}>{t("step4")}</span>
                </div>
              </div>
            </div>
            {systemSetting?.enableInviteCode && (
              <div className="mt-8 rounded-[8px] bg-white text-black py-3 px-6 mx-auto teachers-14-400 !normal-case">
                🎉{" "}
                <span className="text-[#9D47FF]">
                  {t("preRegistrationPeriod")}
                </span>{" "}
                {t("first72HoursGetExclusiveStamp")}
              </div>
            )}
            <div className="text-left mb-2 mt-8">
              Step {currentStep}: {EStepName[`Step${currentStep}`]}
            </div>
            {currentStep == 1 ? (
              <ConnectUs />
            ) : currentStep == 2 ? (
              <Post />
            ) : currentStep == 3 ? (
              <BindAddress />
            ) : (
              <Guidlines />
            )}
          </div>
        </GradientBorderCard>
      </PT12Wrapper>
    </>
  );
};
