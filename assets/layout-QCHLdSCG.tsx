import Modal from "@/components/Modal";
import useKrActivity from "@/models/kr";
import Quizs from "@/routes/pages/Kr/components/quiz";
import { useEventListener } from "ahooks";
import { useCallback, useEffect, useRef, useState } from "react";
import { Outlet, useNavigate, useSearchParams } from "react-router-dom";
import { inviteCodeApi, signInApi, stampApi, Task, taskApi } from "./krApi";
import { uploadApi } from "@/routes/pages/Admin/adminApi";
import { toast } from "react-toastify";
import { ETaskType, EUserTaskStatus } from "@/routes/pages/Admin/interface";
import { FIRST_TASK_ID } from "@/routes/pages/Kr/config";
import dayjs from "dayjs";
import { generateQueryString, sleep } from "@/utils/tools";
import Copy from "@/components/Copy";
import { Card, Input } from "@nextui-org/react";
import Button from "@/components/Button";
import i18n from "i18next";
import { useTranslation } from "react-i18next";

export const KrLayout = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const lng = searchParams.get('lng') || 'kr';

  // 监听URL参数变化，切换语言
  useEffect(() => {
    if (lng === 'en') {
      i18n.changeLanguage('kr_en');
    } else {
      i18n.changeLanguage('kr');
    }
  }, [lng]);

  const taskId = useRef<number>(0);
  const quizId = useRef<number>(0);
  const quizRef = useRef<any>(null);
  const retweetAndLikeTwitterContentRef = useRef<any>("");
  const postTwitterContentRef = useRef<any>("");
  const interactionNicknameContentRef = useRef<any>("");
  const quoteTwitterIdRef = useRef<any>("");
  const inviteCodesRef = useRef<string[]>([]);
  const [quizVisible, setQuizVisible] = useState<boolean>(false);
  const [inviteVisible, setInviteVisible] = useState<boolean>(false);
  const [retweetAndLikeTwitterVisible, setRetweetAndLikeTwitterVisible] =
    useState(false);
  const [quoteTwitterVisible, setQuoteTwitterVisible] = useState(false);
  const [postTwitterVisible, setPostTwitterVisible] = useState(false);
  const [interactionNicknameVisible, setInteractionNicknameVisible] = useState(false);
  const [postTwitterUrl, setPostTwitterUrl] = useState("");
  const [quoteTwitterUrl, setQuoteTwitterUrl] = useState("");
  const [retweetAndLikeTwitterUrl, setRetweetAndLikeTwitterUrl] = useState("");
  const [interactionNicknameUrl, setInteractionNicknameUrl] = useState("");
  const [interactionNicknameImageUrl, setInteractionNicknameImageUrl] = useState("");
  const [interactionNicknameUploading, setInteractionNicknameUploading] = useState(false);
  const interactionImageInputRef = useRef<HTMLInputElement | null>(null);

  const {
    user,
    step,
    firstTask,
    inviteCodes,
    authToken,
    setState,
    initUserOverview,
    initSystemSetting,
    setAuthToken,
    initTaskList,
    initTaskListByGroup,
    systemSetting,
    inviterId,
  } = useKrActivity();
  const navigate = useNavigate();

  useEventListener("cysic_kr_next_step", (e: Event) => {
    const customEvent = e as CustomEvent;

    setState({ step: customEvent?.detail });
  });

  useEventListener("cysic_kr_tasks_action", async (e: Event) => {
    const customEvent = e as CustomEvent;
    const state = customEvent?.detail as Task;

    if (
      state.currentStatus === EUserTaskStatus.UserTaskCompletionStatusCompleted && state.taskType != ETaskType.TaskTypeQuiz
    ) {
      return;
    }

    if (
      state.currentStatus === EUserTaskStatus.UserTaskCompletionStatusWaitClaim
    ) {
      await taskApi.claimTask(state.id);
      dispatchEvent(new CustomEvent("cysic_kr_tasks_refresh"));
      return;
    }

    if (
      state.currentStatus === EUserTaskStatus.UserTaskCompletionStatusPending
    ) {
      return;
    }

    taskId.current = state.id;
    switch (state.taskType) {
      case "interaction.nickname": {
        interactionNicknameContentRef.current = state.interactionNicknameTwitterTaskConfig?.content;
        setInteractionNicknameVisible(true);
        break;
      }
      case "postTwitter": {
        postTwitterContentRef.current = state.postTwitterTaskConfig?.content;
        setPostTwitterVisible(true);
        break;
      }
      case "quoteTwitter": {
        quoteTwitterIdRef.current = state.quoteTwitterTaskConfig?.content;
        setQuoteTwitterVisible(true);
        break;
      }
      case "retweetAndLike": {
        retweetAndLikeTwitterContentRef.current =
          state.retweetAndLikeTwitterTaskConfig?.content;
        setRetweetAndLikeTwitterVisible(true);
        break;
      }
      case "quiz":
        try {
          const quizStr = state.quizTaskConfig?.quiz || "";
          const answerStr = state.quizTaskConfig?.answer || "";
          const taskResultStr = state.taskResult || ""

          let questions: unknown[] = [];
          let answer: unknown[] = [];
          let taskResult: unknown[] = [];

          try {
            questions = quizStr ? JSON.parse(quizStr) : [];
            answer = answerStr ? JSON.parse(answerStr) : [];
            taskResult = taskResultStr ? JSON.parse(taskResultStr) : [];
          } catch (parseError) {
            console.error("JSON parse error:", parseError);
            const cleanedQuiz = quizStr.trim().replace(/^"(.*)"$/, "$1");
            questions = cleanedQuiz ? JSON.parse(cleanedQuiz) : [];

            const cleanedAnswer = answerStr.trim().replace(/^"(.*)"$/, "$1");
            answer = cleanedAnswer ? JSON.parse(cleanedAnswer) : [];

            const cleanedTaskResult = taskResultStr.trim().replace(/^"(.*)"$/, "$1");
            taskResult = cleanedTaskResult ? JSON.parse(cleanedTaskResult) : [];

          }

          quizId.current = state.id;
          quizRef.current = questions?.map((raw, index) => {
            const question = raw as { q?: string; question?: string; choice?: string[]; options?: string[] };
            return {
              q: question.q || question.question,
              choice: question.choice || question.options,
              a: answer?.[index] || "",
              taskResult: taskResult?.[index] || ""
            };
          });

          setQuizVisible(true);
        } catch (error) {
          toast.error(t('failedToLoadQuizQuestions'));
        }
        break;
      case "invite":
        inviteCodesRef.current =
          inviteCodes
            ?.filter((inviteCode: any) => inviteCode.available)
            ?.map((inviteCode: any) => inviteCode.code) || [];
        setInviteVisible(true);
        break;
    }
  });

  // 移除URL中的参数
  const removeParamFromUrl = (paramName: string) => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has(paramName)) {
      urlParams.delete(paramName);
      const newUrl =
        window.location.pathname +
        (urlParams.toString() ? `?${urlParams.toString()}` : "") +
        window.location.hash;
      window.history.replaceState({}, document.title, newUrl);
    }
  };

  // 登录后绑定邀请码
  const bindInviteCodeAfterLogin = useCallback(async (inviteCode: string) => {
    if (!inviteCode) return;
    try {
      const response = await inviteCodeApi.bindInviteCode(
        inviteCode,
        "twitter"
      );
      if (response.code === "200") {
        toast.success(t('inviteCodeBoundSuccessfully'));
        dispatchEvent(new CustomEvent("cysic_kr_tasks_refresh_user_overview"));
      } else {
        if (response.msg == 'Invite code max use times') {
          toast.error('초대코드 사용 완료. 다른 코드로 시도하세요!' || t('failedToBindInviteCode'));
        } else {
          toast.error(response.msg || t('failedToBindInviteCode'));
        }
      }
    } catch (error) {
      toast.error(t('failedToBindInviteCode'));
    }
  }, []);

  // 检查URL中的认证token和邀请码
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("_t");
    const inviteCode = urlParams.get("_c");

    // 处理邀请码参数
    if (inviteCode) {
      localStorage.setItem("cysic_kr_invite_code", inviteCode);
      removeParamFromUrl("_c");
      toast.success(t('inviteCodeReceived'));
    }

    if (token == 'invalid') {
      removeParamFromUrl("_t");

      toast.error('Cysic 한국 온보딩 캠페인 사전등록 및 추가캠페인 참여등록이 마감되었습니다!');
    } else if (token) {
      setAuthToken(token);
      removeParamFromUrl("_t");

      toast.success(t('loginSuccessful'));
    }
  }, [bindInviteCodeAfterLogin, setAuthToken]);

  const loadFirstTask = async () => {
    try {
      // setState({tweetUnderReview: false});
      // return;
      const response = await taskApi.getTaskList(FIRST_TASK_ID);
      if (response.code === "200") {
        setState({
          tweetUnderReview: ![
            EUserTaskStatus.UserTaskCompletionStatusWaitClaim,
            EUserTaskStatus.UserTaskCompletionStatusCompleted,
          ].includes(response?.list?.[0]?.currentStatus),
          firstTask: response?.list?.[0] || null,
        });
      } else {
        toast.error(response.msg || "Failed to load task");
      }
    } catch (error) {
      toast.error("Failed to load task");
    }
  };

  const signIn = async () => {
    try {
      await signInApi.signIn();

      const signInList = await signInApi.getSignInHistory(
        dayjs().subtract(100, "day").startOf("day").valueOf(),
        dayjs().endOf("day").valueOf()
      );
      if (signInList.code === "200") {
        setState({ signInList: signInList.signInDates });
      } else {
        toast.error(signInList.msg || "Failed to get sign in list");
      }
    } catch (error) {
      toast.error("Failed to sign in");
    }
  };

  const getUserStampList = async () => {
    try {
      const response = await stampApi.getStampList();
      if (response.code === "200") {
        setState({ stampList: response.list });
      } else {
        toast.error(response.msg || "Failed to get user stamp list");
      }
    } catch (error) {
      toast.error("Failed to get user stamp list");
    }
  };

  useEffect(() => {
    initSystemSetting();
  }, []);

  useEffect(() => {
    if (authToken && systemSetting?.enableInviteCode !== undefined) {
      initUserOverview().then(() => {

        const inviterId = useKrActivity.getState().inviterId;
        const enableInviteCode = useKrActivity.getState().systemSetting?.enableInviteCode

        if (!enableInviteCode) return;

        if (!inviterId || Number(inviterId) <= 0) {
          const storedInviteCode = localStorage.getItem("cysic_kr_invite_code");
          if (storedInviteCode) {
            bindInviteCodeAfterLogin(storedInviteCode);
          }
        }
      });
    }
  }, [authToken, systemSetting?.enableInviteCode]);

  useEffect(() => {
    if (authToken && systemSetting?.enableInviteCode !== undefined && !!user?.id) {
      const week = useKrActivity.getState().week;

      if (systemSetting?.enableInviteCode) {
        if (Number(inviterId) > 0) {
          loadFirstTask();
          getUserStampList();
          initTaskListByGroup(+week);
          signIn();
        }
      } else {
        loadFirstTask();
        getUserStampList();
        initTaskListByGroup(+week);
        signIn();
      }
    }
  }, [authToken, inviterId, systemSetting?.enableInviteCode, user?.id]);


  useEffect(() => {
    if (window.location.pathname == '/kr/dashboard') {
      if (!authToken || [EUserTaskStatus.UserTaskCompletionStatusIncomplete].includes(firstTask?.currentStatus) || !user?.address) {
        navigate("/kr");
      }
    }
  }, [authToken, firstTask?.currentStatus, user?.address])

  useEffect(() => {
    if (!authToken) {
      setState({ showLogin: true });
    } else if (window.location.pathname == "/kr") {
      if (systemSetting?.enableInviteCode && Number(inviterId) <= 0) {
        setState({ showLogin: true });
      } else {
        setState({ showLogin: false });
      }
    } else {
      setState({ showLogin: true });
    }
  }, [authToken, systemSetting?.enableInviteCode, inviterId, setState]);

  useEffect(() => {
    if (authToken && window.location.pathname == '/kr') {
      if ([EUserTaskStatus.UserTaskCompletionStatusIncomplete].includes(firstTask?.currentStatus)) {
        dispatchEvent(new CustomEvent("cysic_kr_next_step", { detail: 1 }));
      } else if (!user?.address) {
        dispatchEvent(new CustomEvent("cysic_kr_next_step", { detail: 3 }));
      }

      if (![EUserTaskStatus.UserTaskCompletionStatusIncomplete].includes(firstTask?.currentStatus) && user?.address) {
        dispatchEvent(new CustomEvent("cysic_kr_next_step", { detail: 4 }));
      }
    }
  }, [authToken, user?.address, firstTask?.currentStatus]);

  useEventListener("cysic_kr_tasks_change_week", () => {
    const week = useKrActivity.getState().week;
    initTaskListByGroup(+week);
  });

  useEventListener("cysic_kr_tasks_refresh_user_overview", () => {
    initUserOverview();
  });

  useEventListener("cysic_kr_tasks_refresh", () => {
    const week = useKrActivity.getState().week;
    initUserOverview();
    initTaskListByGroup(+week);
    getUserStampList();
  });

  const handleSubmitPost = async () => {
    await taskApi.submitTask(taskId.current, postTwitterUrl);
    toast.success(t('yourTweetIsNowUnderReviewing'));

    await sleep(1000);
    dispatchEvent(new CustomEvent("cysic_kr_tasks_refresh"));
  };

  const handlePost = (content: string) => {
    const link = `https://x.com/intent/post?${generateQueryString({
      text: content,
    })}`;

    window.open(link, "_blank");
  };

  const handleSubmitQuote = async () => {
    await taskApi.submitTask(taskId.current, quoteTwitterUrl);
    toast.success(t('yourTweetIsNowUnderReviewing'));

    await sleep(1000);
    setQuoteTwitterVisible(false);
    dispatchEvent(new CustomEvent("cysic_kr_tasks_refresh"));
  };

  const extractTweetId = (url: string): string | null => {
    if (!url) return null;

    const patterns = [
      /(?:x\.com|twitter\.com)\/\w+\/status\/(\d+)/,
      /status\/(\d+)/,
      /\/tweet\/(\d+)/,
      /tweet_id=(\d+)/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }

    return null;
  };

  const handleQuote = (tweetUrlOrContent: string) => {
    // const tweetId = extractTweetId(tweetUrlOrContent) || tweetUrlOrContent;

    // if (!tweetId) {
    //   toast.error(t('invalidTwitterURLOrID'));
    //   return;
    // }

    const replyUrl = tweetUrlOrContent;
    window.open(replyUrl, "_blank");
  };

  const handleRetweetAndLike = (tweetUrlOrContent: string) => {
    const tweetId = extractTweetId(tweetUrlOrContent) || tweetUrlOrContent;

    if (!tweetId) {
      toast.error(t('invalidTwitterURLOrID'));
      return;
    }

    const retweetUrl = `https://twitter.com/intent/retweet?tweet_id=${tweetId}`;
    window.open(retweetUrl, "_blank");

    setRetweetAndLikeTwitterUrl("opened");

    handleSubmitRetweet();
  };

  const handleSubmitRetweet = async () => {
    await taskApi.submitTask(
      taskId.current,
      retweetAndLikeTwitterContentRef.current
    );
    // toast.success('Your action is now under-reviewing')

    await sleep(1000);
    dispatchEvent(new CustomEvent("cysic_kr_tasks_refresh"));
  };

  const handleUploadInteractionImage = async (file: File) => {
    if (!file) return;
    if (interactionNicknameUploading) return;
    if (file.size > 1024 * 1024) {
      toast.error("이미지 크기는 1MB 미만이어야 합니다");
      // reset input so selecting the same file again will trigger change
      if (interactionImageInputRef.current) interactionImageInputRef.current.value = "";
      return;
    }
    try {
      setInteractionNicknameUploading(true);
      const res = await uploadApi.upload(file);
      if (res.code === "200" && res.fileUrl) {
        setInteractionNicknameImageUrl(res.fileUrl);
        toast.success("이미지가 업로드되었습니다");
      } else {
        setInteractionNicknameImageUrl("");
        toast.error(res.msg || "이미지 업로드 실패");
      }
    } catch (e) {
      setInteractionNicknameImageUrl("");
      toast.error("이미지 업로드 실패");
    } finally {
      setInteractionNicknameUploading(false);
      // always clear the file input to allow re-selecting the same file
      if (interactionImageInputRef.current) interactionImageInputRef.current.value = "";
    }
  };

  const handleSubmitInteractionNickname = async () => {
    if (!interactionNicknameUrl) {
      toast.error("링크를 입력해주세요");
      return;
    }

    await taskApi.submitTask(taskId.current, interactionNicknameUrl, interactionNicknameImageUrl);
    toast.success("제출되었습니다. 검토 중입니다");
    await sleep(1000);
    setInteractionNicknameVisible(false);
    setInteractionNicknameUrl("");
    setInteractionNicknameImageUrl("");
    dispatchEvent(new CustomEvent("cysic_kr_tasks_refresh"));
  };

  return (
    <>
      <Modal
        isOpen={quizVisible}
        onClose={() => setQuizVisible(false)}
        title={t('quiz')}
        className="max-w-[600px]"
      >
        <>
          <Quizs
            setQuizVisible={setQuizVisible}
            quizId={quizId.current}
            quiz={quizRef.current}
          />
        </>
      </Modal>

      <Modal
        isOpen={inviteVisible}
        onClose={() => setInviteVisible(false)}
        title={t('getYourInviteCodes')}
        className="max-w-[400px]"
      >
        <>
          <div className="flex flex-col gap-6">
            <p className="text-white/80 text-sm">
              {t('shareInviteCodesWithFriendsToEarnRewards')}
            </p>

            {inviteCodesRef.current.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {inviteCodesRef.current.map((inviteCode: string) => (
                  <Copy
                    key={inviteCode}
                    value={window.location.origin + "/kr?_c=" + inviteCode}
                    className="justify-between bg-white/10 border border-white/20 rounded-lg px-4 py-3 hover:bg-white/15 transition-colors"
                  >
                    <span className="font-mono text-white font-semibold tracking-wider">
                      {inviteCode}
                    </span>
                  </Copy>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-white/50">
                {t('noInviteCodesAvailable')}
              </div>
            )}
          </div>
        </>
      </Modal>

      <Modal
        isOpen={postTwitterVisible}
        onClose={() => {
          setPostTwitterVisible(false);
          setPostTwitterUrl("");
        }}
        title={t('post')}
        className="max-w-[400px]"
      >
        <>
          <div className="flex flex-col gap-2">
            <p className="text-white/80 text-sm">
              {t('postFollowingSection')}
            </p>

            <Card className="p-4 rounded-[8px]">
              {/* {postTwitterContentRef.current} */}

              <div className="text-white/80 text-sm font-bold mb-2">
                트위터 콘텐츠 포스팅 미션
              </div>

              <ul className="list-decimal list-outside text-white/80 text-sm [&_li]:mb-2 [&_li]:ml-4">
                <li>Cysic의 $CYS가 상장된 거래소에서 차트를 캡처해주세요.</li>
                <li>$CYS 차트를 보고 느낀 소감과 앞으로의 기대감을 작성해주세요.</li>
                <li>트위터 포스팅에는 차트 이미지와 소감이 함께 포함되어야 합니다.</li>
                <li>작성한 트윗의 URL을 아래 제출 링크에 붙여 제출해주세요.</li>
              </ul>

            </Card>

            {/* <Button
              className="mb-4"
              type="light"
              onClick={() => handlePost(postTwitterContentRef.current)}
            >
              {t('post')}
            </Button> */}

            <p className="text-white/80 text-sm">
              {t('enterYourTweetUrl')}
            </p>

            <Input
              placeholder="https://x.com/..."
              value={postTwitterUrl}
              onValueChange={setPostTwitterUrl}
            />

            <Button
              className=""
              disabled={!postTwitterUrl}
              onClick={handleSubmitPost}
              type="light"
            >
              {t('submit')}
            </Button>
          </div>
        </>
      </Modal>

      <Modal
        isOpen={quoteTwitterVisible}
        onClose={() => {
          setQuoteTwitterVisible(false);
          setQuoteTwitterUrl("");
        }}
        title={t('reply')}
        className="max-w-[400px]"
      >
        <>
          <div className="flex flex-col gap-2">
            <p className="text-white/80 text-sm">
              {t('replyToFollowingTweet')}
            </p>

            {/* <Card className="p-4 rounded-[8px] overflow-auto"> */}
            <div className="flex flex-col gap-2 text-sm text-sub">
              {quoteTwitterIdRef.current && (
                <p>해당 포스팅의 RT + LIKE + 댓글을 달아주세요</p>
                // <a
                //   href={
                //     quoteTwitterIdRef.current.startsWith("http")
                //       ? quoteTwitterIdRef.current
                //       : `https://x.com/${quoteTwitterIdRef.current}`
                //   }
                //   target="_blank"
                //   rel="noopener noreferrer"
                //   className="text-blue-400 hover:text-blue-300 text-sm break-all"
                // >
                //   {quoteTwitterIdRef.current.startsWith("http")
                //     ? quoteTwitterIdRef.current
                //     : `View tweet: https://x.com/${quoteTwitterIdRef.current}`}
                // </a>
              )}
            </div>
            {/* </Card> */}

            <Button
              className="mb-4"
              type="light"
              onClick={() => handleQuote(quoteTwitterIdRef.current)}
            >
              {t('goToTweet')}
            </Button>

            <p className="text-white/80 text-sm">
              포스팅의 댓글 링크를 첨부해주세요 (수정이 불가능합니다 주의하세요)
            </p>

            <Input
              placeholder="https://x.com/..."
              value={quoteTwitterUrl}
              onValueChange={setQuoteTwitterUrl}
            />

            <Button
              className=""
              disabled={!quoteTwitterUrl}
              onClick={handleSubmitQuote}
              type="light"
            >
              {t('submit')}
            </Button>
          </div>
        </>
      </Modal>

      <Modal
        isOpen={retweetAndLikeTwitterVisible}
        onClose={() => {
          setRetweetAndLikeTwitterVisible(false);
          setRetweetAndLikeTwitterUrl("");
        }}
        title={t('retweetAndLike')}
        className="max-w-[400px]"
      >
        <>
          <div className="flex flex-col gap-2">
            <p className="text-white/80 text-sm">
              {t('retweetAndLikeFollowingTweet')}
            </p>

            <Card className="p-4 rounded-[8px] overflow-auto">
              <div className="flex flex-col gap-2">
                {retweetAndLikeTwitterContentRef.current && (
                  <a
                    href={
                      retweetAndLikeTwitterContentRef.current.startsWith("http")
                        ? retweetAndLikeTwitterContentRef.current
                        : `https://x.com/${retweetAndLikeTwitterContentRef.current}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 text-sm break-all"
                  >
                    {retweetAndLikeTwitterContentRef.current.startsWith("http")
                      ? retweetAndLikeTwitterContentRef.current
                      : `View tweet: https://x.com/${retweetAndLikeTwitterContentRef.current}`}
                  </a>
                )}
              </div>
            </Card>

            <Button
              className="mb-4"
              type="light"
              onClick={() =>
                handleRetweetAndLike(retweetAndLikeTwitterContentRef.current)
              }
            >
              {t('retweetLike')}
            </Button>
          </div>
        </>
      </Modal>

      {/* changeNickname */}
      <Modal
        isOpen={interactionNicknameVisible}
        onClose={() => {
          setInteractionNicknameVisible(false);
          setInteractionNicknameUrl("");
          setInteractionNicknameImageUrl("");
          interactionNicknameContentRef.current = "";
        }}
        title={"트위터 닉네임 변경 미션"}
        className="max-w-[400px]"
      >
        <>
          <div className="flex flex-col gap-2">
            <p className="text-white/80 text-sm">
              여러분들의 닉네임에, 싸이식을 추가하고, 프로필 링크 및 스크린샷을 첨부해 주세요
            </p>

            {interactionNicknameContentRef.current ? (
              <Card className="p-4 rounded-[8px]">
                ex) Yeonghee.{interactionNicknameContentRef.current}
              </Card>
            ) : null}

            <p className="text-white/80 text-sm mt-2">
              닉네임을 추가한 트위터링크를 입력해주세요
            </p>
            <Input
              placeholder="https://x.com/..."
              value={interactionNicknameUrl}
              onValueChange={setInteractionNicknameUrl}
            />

            <p className="text-white/80 text-sm mt-2">
              변경한 닉네임 스크린샷을 업로드해주세요
            </p>
            <input
              id="interaction-image-upload"
              type="file"
              accept="image/*"
              className="hidden"
              ref={interactionImageInputRef}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleUploadInteractionImage(file);
              }}
            />
            <label
              htmlFor="interaction-image-upload"
              className={`border-2 border-dashed border-white/25 hover:border-white/40 rounded-lg p-4 transition-colors flex items-center justify-center min-h-[160px] bg-white/5 hover:bg-white/10 ${interactionNicknameUploading ? "opacity-70 cursor-not-allowed pointer-events-none" : "cursor-pointer"}`}
            >
              {interactionNicknameImageUrl ? (
                <img
                  src={interactionNicknameImageUrl}
                  alt="screenshot"
                  className="rounded max-h-[280px] object-contain w-full"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-center text-white/70">
                  <div className="text-sm">
                    {interactionNicknameUploading ? "업로드 중..." : "여기를 클릭하여 이미지를 업로드하세요"}
                  </div>
                  <div className="text-xs text-white/50 mt-1">(1MB 미만, PNG/JPG 등 이미지 파일)</div>
                </div>
              )}
            </label>

            <Button
              className="mt-2"
              type="light"
              disabled={!interactionNicknameUrl}
              onClick={handleSubmitInteractionNickname}
            >
              제출
            </Button>
          </div>
        </>
      </Modal>

      <Outlet />
    </>
  );
};
