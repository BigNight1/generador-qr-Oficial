import assert from "node:assert/strict";
import test from "node:test";
import { createQrGenerationGuard } from "../src/utils/qrGenerationGuard.ts";

test("invalidating QR inputs makes an in-flight generation stale", () => {
  const guard = createQrGenerationGuard();
  const generation = guard.begin();

  guard.invalidate();

  assert.equal(guard.isCurrent(generation), false);
});

test("a newer generation supersedes an older one", () => {
  const guard = createQrGenerationGuard();
  const oldGeneration = guard.begin();
  const newGeneration = guard.begin();

  assert.equal(guard.isCurrent(oldGeneration), false);
  assert.equal(guard.isCurrent(newGeneration), true);
});
