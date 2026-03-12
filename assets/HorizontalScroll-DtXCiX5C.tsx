import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { isMobile } from "react-device-detect";

// 注册 ScrollTrigger 插件
gsap.registerPlugin(ScrollTrigger);


const HorizontalScroll = ({ children }: { children: React.ReactNode }) => {
  const containerRef = useRef(null);
  const scrollRef = useRef(null);

  // 设置滚动动画的函数，以便在初始化和窗口大小变化时调用
  const setupScrollAnimation = () => {
    const sections = gsap.utils.toArray<HTMLElement>(".horizontal-section");
    const sectionWidth = sections[0]?.offsetWidth || window.innerWidth;

    const initialOffset = (Math.floor(sections.length / 2) - 0.5) * sectionWidth;
    const remainingSections = sections.length - Math.floor(sections.length / 2) - 0.5;

    // 清除之前的动画实例
    ScrollTrigger.getAll().forEach(st => st.kill());

    gsap.set('.horizontal-scroll', {
      x: initialOffset
    });
    gsap.to('.horizontal-scroll', {
      x: -(remainingSections * sectionWidth), // 只计算剩余需要移动的距离
      ease: "none",
      scrollTrigger: {
        trigger: '.horizontal-scroll-wrapper',
        start: "top top",
        end: `+=${sections.length * 100}%`,
        pin: '.horizontal-scroll',
        scrub: 2,
        anticipatePin: 1,
        invalidateOnRefresh: true
      }
    });
  };

  useEffect(() => {
    // 初始化滚动动画
    setupScrollAnimation();

    // 添加窗口大小变化监听器
    const handleResize = () => {
      // 使用requestAnimationFrame防止resize事件触发过于频繁
      window.requestAnimationFrame(() => {
        setupScrollAnimation();
      });
    };

    window.addEventListener("resize", handleResize);

    // 清理函数
    return () => {
      window.removeEventListener("resize", handleResize);
      ScrollTrigger.killAll();
    };
  }, []);

  return (
    <div ref={containerRef} className="horizontal-scroll-wrapper relative overflow-hidden">
      <div ref={scrollRef} className="horizontal-scroll flex">
        {React.Children.map(children, (child, index) => (
          <div className="horizontal-section w-screen h-screen"
            key={index}>
            {child}
          </div>
        ))}
      </div>
    </div>
  );
};

const MobileTransitionScroll = ({ children }: { children: React.ReactNode }) => {
  const containerRef = useRef(null);
  const scrollRef = useRef(null);
  const currentSection = useRef<any>(null)


  function setSection(newSection: any) {
    if (newSection !== currentSection.current) {
      gsap.to(currentSection.current, {zIndex: -1, autoAlpha: 0, duration: 0.6})
      gsap.to(newSection, {zIndex: 1, autoAlpha: 1, duration: 0.6});
      currentSection.current = newSection;
    }
  }


  const setupScrollAnimation = () => {
    const height = window.innerHeight

    const sections = gsap.utils.toArray<HTMLElement>(".horizontal-section");

    currentSection.current = sections[0];
    const { y } = sections[0].getBoundingClientRect()
    const startY = y + window.scrollY 

    gsap.defaults({ duration: 0.6 });

    // create a ScrollTrigger for each section
    sections.forEach((section, i) => {
      ScrollTrigger.create({
        start: startY + i*height,
        end: startY + (i+1)*height,

        onToggle: self => {
          if(self.isActive){
            setSection(section)
          }else{
            if(self.progress == 0){
              setSection(sections[0])
            }
          }
        }
      });
    });

    gsap.to('.horizontal-scroll', {
      ease: "none",
      scrollTrigger: {
        trigger: '.horizontal-scroll-wrapper',
        start: "top top",
        end: `+=${sections.length * 100}%`,
        pin: '.horizontal-scroll',
        scrub: 2,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      }
    });
  };

  

  useEffect(() => {
    // 初始化滚动动画
    setupScrollAnimation();

    // 添加窗口大小变化监听器
    const handleResize = () => {
      // 使用requestAnimationFrame防止resize事件触发过于频繁
      window.requestAnimationFrame(() => {
        setupScrollAnimation();
      });
    };

    window.addEventListener("resize", handleResize);

    // 清理函数
    return () => {
      window.removeEventListener("resize", handleResize);
      ScrollTrigger.killAll();
    };
  }, []);

  return (
    <div ref={containerRef} className="horizontal-scroll-wrapper relative overflow-hidden">
      <div ref={scrollRef} className="horizontal-scroll flex relative">
        {React.Children.map(children, (child, index) => (
          <div className="horizontal-section w-screen h-screen [&:not(:first-of-type)]:absolute [&:not(:first-of-type)]:opacity-0"
            key={index}>
            {child}
          </div>
        ))}
      </div>
    </div>
  )
}

const Layout = isMobile ? MobileTransitionScroll : HorizontalScroll

export default Layout;
