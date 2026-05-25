/**
 * Shared types used across features.
 */

export type ActionResult =
  | { ok: true; message: string }
  | { ok: false; message: string };
