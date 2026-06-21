/**
 * Fixed full-viewport animated gradient-mesh background. Mount once near
 * the app root — it sits behind everything via z-index: -1 and never
 * affects layout.
 */
export function MeshBackdrop() {
  return (
    <div className="mesh-backdrop" aria-hidden="true">
      <span className="mesh-blob" />
    </div>
  );
}
