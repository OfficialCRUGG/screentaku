import { WebviewWindow } from "@tauri-apps/api/webviewWindow";
import { getCurrentWindow, Window } from "@tauri-apps/api/window";

export function openAbout() {
  const aboutWindow = new WebviewWindow("about", {
    center: true,
    width: 400,
    height: 450,
    resizable: false,
    focus: true,
    titleBarStyle: "overlay",
    maximizable: false,
    minimizable: false,
    parent: getCurrentWindow(),
    title: "About Screentaku",
    url: "/about",
  });

  aboutWindow.show();
}
