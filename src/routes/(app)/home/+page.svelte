<script>
  import { newProject, openProject } from "$lib/projects";
</script>

<div class="h-full flex items-center justify-center flex-col text-white/25">
  <h1 class="text-4xl font-bold text-white/50">Screentaku</h1>
  <p>A tool for creating and filtering screencaps from videos</p>
  <p>No project opened.</p>
  <div class="flex mt-2 space-x-6 text-white/50">
    <button onclick={newProject} class="hover:text-white/75 p-2"
      >Create a new Project</button
    >
    <button onclick={openProject} class="hover:text-white/75 p-2"
      >Open a Project</button
    >
  </div>
</div>
