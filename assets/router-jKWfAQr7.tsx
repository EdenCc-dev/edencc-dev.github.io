import { createBrowserRouter } from "react-router-dom";
import Root from "./routes/root";
import Home from "./routes/pages/Home/page";
import { getImageUrl } from "@/utils/tools";

import EcosystemPage from "@/routes/pages/Ecosystem/page";
import AcademyPage from "@/routes/pages/Academy/page";
import HardwarePage from "@/routes/pages/Hardware/page";

import MediakitPage from "@/routes/pages/Mediakit/page";
import ContactUs from "@/routes/pages/ContactUs/page";
import CareersPage from "@/routes/pages/Careers/page";
import NotFound from "@/not-found";
import { LeaderboardPage } from "@/routes/pages/Leaderboard/page";
import { KRActivity } from "@/routes/pages/Kr/page";
import { KrActivityDashboard } from "@/routes/pages/Kr/dashboard/page";
import { KrLayout } from "@/routes/pages/Kr/layout";
import { AmbassadorPage } from "@/routes/pages/Ambassador/page";
import { isMobile } from "react-device-detect";
import { isNewYear } from "@/config";
import BlogPage from "@/routes/pages/Blog/page";
import BlogDetailPage from "@/routes/pages/BlogDetail/page";

const sharedRouteChildren = [
  {
    index: true,
    element: <Home />,
  },
  {
    path: "ambassador",
    element: <AmbassadorPage />,
  },
  {
    path: "kr",
    element: <KrLayout />,
    children: [
      {
        index: true,
        element: <KRActivity />,
      },
      {
        path: "dashboard",
        element: <KrActivityDashboard />,
      },
    ],
  },
  {
    path: "careers",
    element: <CareersPage />,
  },
  {
    path: "ecosystem",
    element: <EcosystemPage />,
  },
  {
    path: "academy",
    element: <AcademyPage />,
  },
  {
    path: "hardware",
    element: <HardwarePage />,
  },
  {
    path: "mediakit",
    element: <MediakitPage />,
  },
  {
    path: "contactus",
    element: <ContactUs />,
  },
  {
    path: "media-kit",
    element: <MediakitPage />,
  },
  {
    path: "contact-us",
    element: <ContactUs />,
  },
  {
    path: "leaderboard",
    element: <LeaderboardPage />,
  },
  {
    path: "404",
    element: <NotFound />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

const rootRouteChildren = [
  {
    path: "blog",
    element: <BlogPage />,
  },
  {
    path: "blog/:slug",
    element: <BlogDetailPage />,
  },
  ...sharedRouteChildren,
];

const mobileRouteChildren = [...sharedRouteChildren];

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: rootRouteChildren,
  },
  {
    path: "/m",
    element: <Root />,
    children: mobileRouteChildren,
  },
]);

export const backgroundImageList = {
  "/ambassador": {
    img: "#000",
  },
  "/kr/dashboard": {
    img: "#000",
  },
  "/kr": {
    img: "#000",
  },
  "/ahidhfoiwneofadmin": {
    img: "#000",
  },
  "/": {
    img: isMobile
      ? isNewYear
        ? getImageUrl("@/assets/images/_global/2026_new_year_bg_sp.png")
        : getImageUrl("@/assets/images/_global/home_landing_bg_sp.png")
      : getImageUrl("@/assets/images/_global/home_landing_bg.png"),
    className: isNewYear ? "opacity-60 h-screen" : "grayscale h-screen",
    style: isMobile ? {} : { backgroundSize: "max(calc(120% + 1px), 1900px)" },
    mainClassName: "overflow-x-hidden",
  },
  "/careers": {
    img: "#000",
  },
  "/ecosystem": {
    img: getImageUrl("@/assets/images/_global/zk_ecosystem_bg.png"),
    className: "h-[50vh]",
    style: {
      filter: "grayscale(1) brightness(0.3) ",
      backgroundPosition: "center -25vh",
    },
    needShadow: true,
  },
  "/academy": {
    img: getImageUrl("@/assets/images/_global/zk_academy_bg.png"),
    style: { backgroundPosition: "center -62vh" },
    needShadow: true,
  },
  "/hardware": {
    img: getImageUrl("@/assets/images/_global/zk_hardware_bg.png"),
    className: "h-[calc(100vh+5.625rem)] lg:h-screen",
    style: { backgroundPosition: "center -10vh" },
    mainClassName: "pt-0",
  },
  "/mediakit": {
    img: getImageUrl("@/assets/images/_global/mediakit_landing_bg.png"),
    className: "h-screen",
  },
  "/media-kit": {
    img: getImageUrl("@/assets/images/_global/mediakit_landing_bg.png"),
    className: "h-screen",
  },
  "/contactus": {
    img: getImageUrl("@/assets/images/_global/contactus_landing_bg.png"),
    className: "purple-landing",
    needShadow: true,
  },
  "/contact-us": {
    img: getImageUrl("@/assets/images/_global/contactus_landing_bg.png"),
    className: "purple-landing",
    needShadow: true,
  },
  "/leaderboard": {
    img: getImageUrl("@/assets/images/_global/leaderboard_landing_bg.png"),
    className: "h-screen bg-position-[center_-20rem]",
  },
  "/404": {
    needShadow: true,
  },
};
