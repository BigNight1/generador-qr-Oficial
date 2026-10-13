/** Tracks which asynchronous QR generation is still allowed to update the preview. */
export const createQrGenerationGuard = () => {
  let currentGeneration = 0;

  return {
    begin: () => ++currentGeneration,
    invalidate: () => {
      currentGeneration += 1;
    },
    isCurrent: (generation: number) => generation === currentGeneration,
  };
};
