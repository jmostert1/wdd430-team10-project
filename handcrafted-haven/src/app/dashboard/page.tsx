// Delete? 
import Header from "@/components/Header";

export default function DashboardPage() {
  return (
    <main className="page">
        <Header />
      <div className="container">
        <h1 className="below__title">Dashboard</h1>
        <p className="below__desc">Browse handcrafted items by category and price.</p>
      </div>
    </main>
  );
}
