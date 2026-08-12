/**
 * קישור "דלג לתוכן" (Skip to content) — דרישת נגישות בסיסית
 * מאפשר למשתמשי מקלדת/קורא מסך לדלג ישירות לתוכן העיקרי.
 */
export const SkipLink = () => {
  return (
    <a
      href="#main-content"
      className="skip-link"
      aria-label="דלג לתוכן העמוד"
    >
      דלג לתוכן
    </a>
  );
};
