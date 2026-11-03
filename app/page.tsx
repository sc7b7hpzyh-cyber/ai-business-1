"use client";

import { useState } from "react";
import {
  Activity, ArrowDownRight, ArrowUpRight, Bell, CalendarDays, Check,
  ChevronDown, CircleHelp, ClipboardList, Clock3, Command, Hotel,
  LayoutDashboard, LifeBuoy, MessageSquare, MoreHorizontal, Plus,
  Search, Settings2, Sparkles, Users, WandSparkles
} from "lucide-react";

const initialTasks = [
  { id: 1, title: "Reply to late check-in request", detail: "Room 204 · WhatsApp", time: "2 min ago", status: "Needs attention", priority: "high" },
  { id: 2, title: "Prepare room 108 for arrival", detail: "Housekeeping · Today, 14:00", time: "18 min ago", status: "In progress", priority: "normal" },
  { id: 3, title: "Confirm airport transfer", detail: "Guest: Olivia Martin · Email", time: "31 min ago", status: "Waiting", priority: "normal" },
  { id: 4, title: "Review maintenance request", detail: "Room 312 · Air conditioning", time: "46 min ago", status: "Needs attention", priority: "high" }
];

const nav = [
  { label: "Overview", icon: LayoutDashboard },
  { label: "Guest messages", icon: MessageSquare, count: "8" },
  { label: "Tasks & operations", icon: ClipboardList, count: "4" },
  { label: "Guests", icon: Users },
  { label: "Calendar", icon: CalendarDays }
];

export default function Home() {
  const [active, setActive] = useState("Overview");
  const [tasks, setTasks] = useState(initialTasks);
  const [showAssistant, setShowAssistant] = useState(false);
  const [query, setQuery] = useState("");

  const completeTask = (id: number) => setTasks((current) => current.filter((task) => task.id !== id));

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand"><div className="brand-mark"><Sparkles size={19} /></div><span>nüdling<span className="brand-ai">.ai</span></span></div>
        <div className="workspace-switch"><div className="hotel-icon"><Hotel size={17} /></div><div><strong>Demo Hotel</strong><small>Workspace</small></div><ChevronDown size={15} /></div>
        <div className="nav-label">WORKSPACE</div>
        <nav>{nav.map((item) => <button key={item.label} className={active === item.label ? "nav-item active" : "nav-item"} onClick={() => setActive(item.label)}><item.icon size={18} /><span>{item.label}</span>{item.count && <small>{item.count}</small>}</button>)}</nav>
        <div className="nav-label tools-label">MANAGE</div>
        <button className="nav-item" onClick={() => setActive("Settings")}><Settings2 size={18} /><span>Settings</span></button>
        <div className="sidebar-bottom"><div className="help-card"><div className="help-icon"><LifeBuoy size={17} /></div><strong>Need a hand?</strong><p>Our team is here to help you get set up.</p><button onClick={() => setShowAssistant(true)}>Ask the assistant <ArrowUpRight size={14} /></button></div><div className="profile"><div className="avatar">JD</div><div><strong>Jordan Davis</strong><small>Hotel manager</small></div><MoreHorizontal size={18} /></div></div>
      </aside>

      <section className="main-area">
        <header className="topbar"><div className="breadcrumbs">Demo Hotel <span>/</span> <strong>{active}</strong></div><div className="top-actions"><div className="search"><Search size={16} /><input placeholder="Search anything..." /></div><button className="icon-button" aria-label="Notifications"><Bell size={18} /><i /></button><div className="top-avatar">JD</div></div></header>
        <div className="content">
          <div className="page-heading"><div><div className="eyebrow">MONDAY, NOVEMBER 3, 2026</div><h1>Good evening, Jordan <span>✦</span></h1><p>Here’s what’s happening at your hotel today.</p></div><button className="primary-button" onClick={() => setShowAssistant(true)}><WandSparkles size={16} /> Ask AI assistant</button></div>

          <div className="metric-grid">
            <article className="metric-card"><div className="metric-top"><span>Occupancy</span><span className="metric-icon purple"><Hotel size={17} /></span></div><div className="metric-value">82<span>%</span></div><div className="metric-foot"><span className="positive"><ArrowUpRight size={14} /> 6.4%</span><span>vs. last week</span></div><div className="mini-bars">{[38,55,48,67,58,78,82,69,88,74,82,95].map((h,i)=><i key={i} style={{height:h+"%"}} />)}</div></article>
            <article className="metric-card"><div className="metric-top"><span>Arrivals today</span><span className="metric-icon blue"><Users size={17} /></span></div><div className="metric-value">24</div><div className="metric-foot"><span className="muted-strong">16 checked in</span><span>8 expected</span></div><div className="progress-track"><i style={{width:"67%"}} /></div></article>
            <article className="metric-card"><div className="metric-top"><span>Open tasks</span><span className="metric-icon amber"><ClipboardList size={17} /></span></div><div className="metric-value">{tasks.length.toString().padStart(2,"0")}</div><div className="metric-foot"><span className="warning">2 need attention</span><span>Across all teams</span></div><div className="task-dots"><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/></div></article>
            <article className="metric-card"><div className="metric-top"><span>Guest satisfaction</span><span className="metric-icon green"><Activity size={17} /></span></div><div className="metric-value">4.8<span className="out-of">/5</span></div><div className="metric-foot"><span className="positive"><ArrowUpRight size={14} /> 0.3</span><span>from 126 reviews</span></div><div className="rating-stars">★★★★★</div></article>
          </div>

          <div className="section-grid">
            <section className="panel operations-panel"><div className="panel-heading"><div><h2>Operations overview</h2><p>Keep track of what needs to get done.</p></div><button className="text-button" onClick={() => setActive("Tasks & operations")}>View all <ArrowUpRight size={14}/></button></div><div className="task-list">{tasks.map((task) => <div className="task-row" key={task.id}><button className="check-button" aria-label="Complete task" onClick={() => completeTask(task.id)}><Check size={13}/></button><div className="task-copy"><strong>{task.title}</strong><small>{task.detail}</small></div><span className={task.priority === "high" ? "status-pill urgent" : "status-pill"}>{task.status}</span><span className="task-time">{task.time}</span></div>)}{tasks.length === 0 && <div className="empty-state">All caught up. No open tasks.</div>}</div><button className="add-task" onClick={() => setTasks((current) => [...current,{id:Date.now(),title:"New operational task",detail:"Added manually · Demo",time:"Now",status:"Waiting",priority:"normal"}])}><Plus size={15}/> Add a task</button></section>

            <section className="panel assistant-panel"><div className="assistant-head"><div className="assistant-symbol"><Sparkles size={18}/></div><div><h2>AI operations assistant</h2><p>Your hotel’s operational co-pilot</p></div><span className="online-dot" /></div><div className="assistant-message"><div className="assistant-mini"><Sparkles size={13}/></div><div><strong>Good evening, Jordan.</strong><p>You have 2 tasks needing attention. The late check-in request for room 204 has been waiting for 2 minutes. Would you like me to draft a reply?</p></div></div><div className="suggestion-label">SUGGESTED ACTIONS</div><button className="suggestion" onClick={() => setShowAssistant(true)}>Summarise today’s operations <ArrowUpRight size={14}/></button><button className="suggestion" onClick={() => setShowAssistant(true)}>Show messages needing a reply <ArrowUpRight size={14}/></button><button className="assistant-cta" onClick={() => setShowAssistant(true)}>Open AI assistant <ArrowUpRight size={15}/></button></section>
          </div>

          <section className="bottom-panel"><div className="bottom-title"><div><h2>Guest activity</h2><p>Recent conversations across your channels.</p></div><button className="text-button" onClick={() => setActive("Guest messages")}>All conversations <ArrowUpRight size={14}/></button></div><div className="guest-activity"><div className="guest-line"><div className="guest-avatar peach">OM</div><div className="guest-info"><strong>Olivia Martin</strong><small>WhatsApp · “Could you arrange an airport transfer?”</small></div><span className="guest-tag">New message</span><time>4 min ago</time></div><div className="guest-line"><div className="guest-avatar lilac">LB</div><div className="guest-info"><strong>Lucas Bennett</strong><small>Email · “Thank you for the lovely stay!”</small></div><span className="guest-tag answered">Answered</span><time>22 min ago</time></div><div className="guest-line"><div className="guest-avatar mint">SC</div><div className="guest-info"><strong>Sophia Chen</strong><small>Website · “Is early check-in available?”</small></div><span className="guest-tag">New message</span><time>39 min ago</time></div></div></section>
          <footer>NÜDLING AI <span>·</span> HOSPITALITY OPERATIONS <span className="footer-right">DEMO ENVIRONMENT · SAMPLE DATA</span></footer>
        </div>
      </section>

      {showAssistant && <div className="modal-backdrop" onClick={() => setShowAssistant(false)}><section className="assistant-modal" onClick={(e) => e.stopPropagation()}><div className="modal-top"><div className="assistant-symbol"><Sparkles size={18}/></div><div><h2>AI operations assistant</h2><p>Demo interface · AI connection not configured</p></div><button className="icon-button" onClick={() => setShowAssistant(false)}>×</button></div><div className="modal-body"><div className="assistant-message"><div className="assistant-mini"><Sparkles size={13}/></div><div><strong>What would you like help with?</strong><p>Ask about guest messages, daily operations, room readiness or team tasks. This is currently a frontend prototype using sample data.</p></div></div><div className="quick-prompts"><button onClick={() => setQuery("Summarise today's hotel operations")}>Summarise today</button><button onClick={() => setQuery("Which guest messages need a reply?")}>Messages needing replies</button></div></div><form className="chat-input" onSubmit={(e) => {e.preventDefault(); setQuery("");}}><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Ask your hotel assistant..." /><button type="submit" aria-label="Send message"><ArrowUpRight size={17}/></button></form></section></div>}
    </main>
  );
}
