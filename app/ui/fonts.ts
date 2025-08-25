import localFont from "next/font/local";

export const bahnschrift = localFont({
  src: [
    {
      path: "../../public/font/BahijJanna-Regular.ttf",
      weight: "400",
      style: "normal",
    },
  ],
});
export const bahnschriftBold = localFont({
  src: [
    {
      path: "../../public/font/BahijJanna-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
});
