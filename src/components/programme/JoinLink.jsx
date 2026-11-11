import { Link } from "react-router-dom";
import { ArrowDown, ArrowRight } from "lucide-react";

/**
 * A programme's main button, by how people join it (useProgrammeOffer): open
 * online, its sign-up (`enrol`: { to, state, label }); by enquiry, Get in
 * Touch on the Contact page with the topic chosen (`enquiry`: the Contact
 * page's state); coming soon, the "Stay connected" signup, on the same page
 * unless `updatesTo` names the programme page that has it.
 */
export default function JoinLink({ mode, enrol, enquiry, className, iconSize = 16, updatesTo }) {
  const icon = { size: iconSize, strokeWidth: 2, "aria-hidden": true };
  if (mode === "online" && enrol) {
    return (
      <Link to={enrol.to} state={enrol.state} className={className}>
        {enrol.label}
        <ArrowRight {...icon} />
      </Link>
    );
  }
  if (mode === "coming_soon") {
    return updatesTo ? (
      <Link to={`${updatesTo}#stay-connected`} className={className}>
        Get updates
        <ArrowRight {...icon} />
      </Link>
    ) : (
      <a href="#stay-connected" className={className}>
        Get updates
        <ArrowDown {...icon} />
      </a>
    );
  }
  return (
    <Link to="/contact#enquiry" state={enquiry} className={className}>
      Get in Touch
      <ArrowRight {...icon} />
    </Link>
  );
}
