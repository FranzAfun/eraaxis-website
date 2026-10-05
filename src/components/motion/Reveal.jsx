import { useInView } from "./useInView";

/**
 * Soft entrance on scroll: the content rises a little and fades in the first
 * time it comes into view, then stays. People who ask for less motion get it
 * in place, still (see .reveal in index.css).
 *
 * `delay` (ms) staggers siblings: pass `index * 70` across a list.
 */
export default function Reveal({ as: Tag = "div", delay = 0, className = "", style, children, ...rest }) {
  const [ref, inView] = useInView();
  return (
    <Tag
      ref={ref}
      className={`reveal ${className}`.trim()}
      data-in={inView || undefined}
      style={{ ...style, "--reveal-delay": `${delay}ms` }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
