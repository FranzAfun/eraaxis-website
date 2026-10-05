import schoolStem from "../assets/images/programmes/school-stem-programs.webp";
import schoolStem768 from "../assets/images/programmes/school-stem-programs-768.webp";
import outOfSchool from "../assets/images/programmes/out-of-school-youth.webp";
import outOfSchool768 from "../assets/images/programmes/out-of-school-youth-768.webp";
import onlineLearning from "../assets/images/programmes/online-learning.webp";
import onlineLearning768 from "../assets/images/programmes/online-learning-768.webp";
import eraDigital from "../assets/images/programmes/era-digital-skill.webp";
import eraDigital768 from "../assets/images/programmes/era-digital-skill-768.webp";

/**
 * Each programme's photo, by programme category, at full size and at 768 px
 * wide, so a phone downloads the small one. Use `src` and `srcSet` together,
 * with a `sizes` that says how wide the picture shows.
 */
const set = (full, fullWidth, small) => ({ src: full, srcSet: `${small} 768w, ${full} ${fullWidth}w` });

export const PROGRAMME_IMAGES = {
  school_stem:         set(schoolStem, 1280, schoolStem768),
  out_of_school_youth: set(outOfSchool, 1600, outOfSchool768),
  online_learning:     set(onlineLearning, 960, onlineLearning768),
  digital_skills:      set(eraDigital, 1600, eraDigital768),
};

/** For a programme card in a grid of up to four across. */
export const CARD_SIZES = "(min-width: 1280px) 300px, (min-width: 640px) 50vw, calc(100vw - 2rem)";
