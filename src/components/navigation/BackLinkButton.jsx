import { useNavigate } from "react-router-dom";

export default function BackLinkButton({
  fallbackTo,
  className,
  children,
}) {
  const navigate = useNavigate();

  function handleClick() {
    const historyIndex = window.history.state?.idx;

    if (typeof historyIndex === "number" && historyIndex > 0) {
      navigate(-1);
      return;
    }

    navigate(fallbackTo);
  }

  return (
    <button type="button" onClick={handleClick} className={className}>
      {children}
    </button>
  );
}
