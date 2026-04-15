import React from "react";

export default function LandingPage({ onGetStarted }) {
  const whatsappLink =
  "https://wa.me/2348137137336?text=I%20want%20to%20learn%20more%20about%20EduCore%20AI%20for%20my%20school";
  

  return (
    <div style={{ fontFamily: "Arial", color: "#fff", background: "#0f172a" }}>

      {/* HERO */}
      <section style={{ padding: "80px 20px", textAlign: "center" }}>
        <h1 style={{
        fontSize: "clamp(24px, 5vw, 40px)",
        marginBottom: 20
        }}>
          Ask Your School Data Anything — Get Instant Answers
        </h1>
        <p style={{ fontSize: 18, opacity: 0.8 }}>
          EduCore AI helps schools communicate with parents, track fees,
          and instantly know who has paid — without stress.
        </p>

        <div style={{ marginTop: 30 }}>
          <button onClick={onGetStarted} style={btnPrimary}>
            Get Started
            </button>

          <a href={whatsappLink} target="_blank" rel="noreferrer">
            <button style={btnSecondary}>Book Demo</button>
          </a>
        </div>
      </section>

      {/* PROBLEM */}
      <section style={sectionStyle}>
        <h2>Managing school operations is stressful</h2>
        <div style={gridStyle}>
        {[
            "You don’t know who has paid",
            "Parents keep asking the same questions",
            "Following up payments takes time",
            "Communication is scattered"
        ].map((item, i) => (
            <div key={i} style={cardStyle}>
            {item}
            </div>
        ))}
        </div>
      </section>

      {/* SOLUTION */}
      <section style={sectionAlt}>
        <h2>EduCore AI solves this</h2>
        <ul>
          <li>Talk to all parents in one place</li>
          <li>Track who has paid instantly</li>
          <li>Receive payment receipts automatically</li>
          <li>Ask questions like “Who is owing?”</li>
        </ul>
      </section>

      {/* HOW IT WORKS */}
      <section style={sectionStyle}>
        <h2>How it works</h2>
        <ol>
          <li>Parents chat via Telegram</li>
          <li>EduCore AI handles conversations</li>
          <li>Parents send receipts</li>
          <li>You approve payments</li>
          <li>Ask questions and get answers instantly</li>
        </ol>
      </section>

      {/* FEATURES */}
      <section style={sectionAlt}>
        <h2>Features</h2>
                <div style={gridStyle}>
        {[
            "Smart Parent Communication",
            "Broadcast Messaging",
            "Payment Tracking",
            "Receipt Verification",
            "AI Insights"
        ].map((item, i) => (
            <div key={i} style={cardStyle}>
            {item}
            </div>
        ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ textAlign: "center", padding: 60 }}>
        <h2>Start managing your school smarter today</h2>

        <div style={{ marginTop: 20 }}>
          <button onClick={onGetStarted} style={btnPrimary}>
            Start Now
            </button>

          <a href={whatsappLink} target="_blank" rel="noreferrer">
            <button style={btnSecondary}>Talk to Us</button>
          </a>
        </div>
      </section>

    </div>
  );
}

// 🎨 STYLES
const sectionStyle = {
  padding: "60px 20px",
  maxWidth: 900,
  margin: "auto"
};

const sectionAlt = {
  ...sectionStyle,
  background: "#1e293b",
  borderRadius: 12
};

const btnPrimary = {
  padding: "12px 20px",
  margin: 10,
  borderRadius: 8,
  border: "none",
  background: "#2563eb",
  color: "#fff",
  cursor: "pointer",
  fontWeight: "bold"
};

const btnSecondary = {
  padding: "12px 20px",
  margin: 10,
  borderRadius: 8,
  border: "1px solid #2563eb",
  background: "transparent",
  color: "#2563eb",
  cursor: "pointer",
  fontWeight: "bold"
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: 20,
  marginTop: 20
};

const cardStyle = {
  background: "#1e293b",
  padding: 20,
  borderRadius: 12,
  textAlign: "center",
  boxShadow: "0 4px 12px rgba(0,0,0,0.3)"
};