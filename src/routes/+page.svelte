<script>
  import { goto } from "$app/navigation";
  import Loader from "$components/Loader.svelte";
  import { getCurrentWindow } from "@tauri-apps/api/window";
  import { message } from "@tauri-apps/plugin-dialog";
  import { Command } from "@tauri-apps/plugin-shell";
  import { onMount } from "svelte";

  async function ffmpegError() {
    await message(
      "FFmpeg could not be found. Please install it and try again.",
      {
        kind: "error",
      },
    );
    getCurrentWindow().close();
  }

  onMount(async () => {
    // Check if ffmpeg is present
    const command = Command.create("ffmpeg", ["-version"]);
    try {
      const result = await command.execute();
      if (result.code !== 0) {
        await ffmpegError();
      } else {
        const command2 = Command.create("ffprobe", ["-version"]);
        try {
          const result2 = await command2.execute();
          if (result2.code !== 0) {
            await ffmpegError();
          } else {
            // FFmpeg is present
            goto("/home");
          }
        } catch (error) {
          await ffmpegError();
        }
      }
    } catch (error) {
      await ffmpegError();
    }
  });
</script>

<div class="h-full flex items-center justify-center">
  <Loader />
</div>
