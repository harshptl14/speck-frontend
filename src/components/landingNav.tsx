"use client";
import { JSX, SVGProps, useEffect, useState } from "react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";

const LandingNav = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [inView, setInView] = useState(true);

  const router = useRouter();
  useEffect(() => {
    function myfunction() {
      const elem = document.getElementById("joinForFree") as HTMLElement;
      const item = elem?.getBoundingClientRect();
      return (
        item &&
        item.top >= 0 &&
        item.left >= 0 &&
        item.bottom <=
          (window.innerHeight || document.documentElement.clientHeight) &&
        item.right <=
          (window.innerWidth || document.documentElement.clientWidth)
      );
    }
    window.addEventListener("scroll", () => {
      if (myfunction()) {
        setInView(true);
        console.log("Element is visible in viewport");
      } else {
        setInView(false);
        console.log("Element is not visible in viewport");
      }
    });

    return () => {
      window.removeEventListener("scroll", () => {
        if (myfunction()) {
          setInView(true);
          console.log("Element is visible in viewport");
        } else {
          setInView(false);
          console.log("Element is not visible in viewport");
        }
      });
    };
  }, []);

  return (
    <div className="sticky top-0 z-10">
      <nav
        className={`min-720 flex h-6 w-[584px] rounded-full items-center justify-between bg-muted/[.72] backdrop-blur-xl absolute left-1/2 top-5 z-10 -translate-x-1/2 gap-x-24 px-5 py-8 
            `}
      >
        <div className="flex items-center w-fit">
          <MountainIcon className="h-6 w-6" />
          <span className="text-xl font-bold px-2">Speck</span>
        </div>

        <div className="flex items-center gap-2 transition-all duration-300 ease-in">
          <div
            className={`flex items-center gap-2 transition-all duration-300 ease-in-out ${
              !inView
                ? "opacity-100 -translate-x-2"
                : "opacity-100 translate-x-0"
            }`}
          >
            <Link href="#">
              <div className="text-sm font-medium text-primary opacity-70 hover:opacity-100 transition duration-300">
                Pricing
              </div>
            </Link>
            <Link href="/auth">
              <div className="text-sm font-medium text-primary opacity-70 hover:opacity-100 transition duration-300">
                Log in
              </div>
            </Link>
          </div>
          <div
            className={`transition-transform duration-300 transform ${
              !inView
                ? "translate-y-0 opacity-100 scale-100"
                : "translate-y-12 opacity-0 scale-90"
            }`}
            style={{ transformOrigin: "bottom" }}
          >
            {!inView && (
              <Button
                style={{ transformOrigin: "bottom" }}
                variant={"default"}
                className={`transition-all duration-300 transform ${
                  !inView
                    ? "translate-y-0 opacity-100 scale-100"
                    : "translate-y-12 opacity-0 scale-90"
                }`}
                onClick={() => router.push("/auth")}
              >
                Join for free
              </Button>
            )}
          </div>
        </div>

        <button
          className="md:hidden p-2 rounded-full hover:bg-gray-200 focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <MenuIcon className="w-6 h-6" />
          <span className="sr-only">Toggle menu</span>
        </button>
      </nav>
    </div>
  );
};

interface MountainIconProps {
  className?: string;
  width?: number;
  height?: number;
}

function MountainIcon(props: MountainIconProps) {
  const { className, width = 24, height = 24 } = props;
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
    </svg>
  );
}

function MenuIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  );
}

export default LandingNav;
