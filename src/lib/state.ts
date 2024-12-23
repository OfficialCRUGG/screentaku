import { writable } from "svelte/store";

export let activeProject = writable<null | {
  status: "new" | "processing" | "finished";
  videoFile: string;
  dir: string;
}>(null);

export let statusbar = writable<{
  framesSize: string | null;
  framesAmount: number | null;
  favoritesSize: string | null;
  favoritesAmount: number | null;
}>({
  framesSize: null,
  framesAmount: null,
  favoritesSize: null,
  favoritesAmount: null,
});
