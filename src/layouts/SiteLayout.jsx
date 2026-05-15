import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

export default function SiteLayout({ children }) {
  return (
    <>
      <Header />
      <main className="pt-20">{children}</main>
      <Footer />
    </>
  );
}
