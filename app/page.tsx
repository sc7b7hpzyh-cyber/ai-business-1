"use client";

import { useMemo, useState } from "react";
import {
  Activity, ArrowDownRight, ArrowRight, ArrowUpRight, Bell, CalendarDays,
  Check, CheckCircle2, ChevronDown, Clock3, CreditCard, MessageCircle,
  MoreHorizontal, Plus, Search, Settings, Scissors, Send, Sparkles,
  UserRound, Users, X, Zap
} from "lucide-react";

type Tab = "Overview" | "Appointments" | "Customers" | "Services" | "Settings";
type Appointment = {
  id: number; customer: string; initials: string; service: string;
  staff: string; time: string; duration: string; status: "Confirmed" | "Waiting" | "Cancelled";
  color: string;
};
type Service = { id: number; name: string; duration: number; price: number };

const seedAppointments: Appointment[] = [
  { id: 1, customer: "Sophie Weber", initials: "SW", service: "Classic haircut", staff: "Alex", time: "09:30", duration: "30 min", status: "Confirmed", color: "lavender" },
  { id: 2, customer: "Daniel Fischer", initials: "DF", service: "Skin fade", staff: "Marco", time: "10:00", duration: "45 min", status: "Confirmed", color: "blue" },
  { id: 3, customer: "Emma Schneider", initials: "ES", service: "Manicure", staff: "Mia", time: "11:15", duration: "45 min", status: "Waiting", color: "peach" },
  { id: 4, customer: "Noah Wagner", initials: "NW", service: "Beard trim", staff: "Alex", time: "13:00", duration: "20 min", status: "Confirmed", color: "mint" },
  { id: 5, customer: "Lena Hoffmann", initials: "LH", service: "Gel nails", staff: "Mia", time: "14:30", duration: "60 min", status: "Confirmed", color: "pink" },
];

const seedServices: Service[] = [
  { id: 1, name: "Classic haircut", duration: 30, price: 28 },
  { id: 2, name: "Skin fade", duration: 45, price: 35 },
  { id: 3, name: "Beard trim", duration: 20, price: 18 },
  { id: 4, name: "Manicure", duration: 45, price: 32 },
  { id: 5, name: "Gel nails", duration: 60, price: 48 },
];

const navItems: { name: Tab; icon: typeof Activity }[] = [
  { name: "Overview", icon: Activity },
  { name: "Appointments", icon: CalendarDays },
  { name: "Customers", icon: Users },
  { name: "Services", icon: Scissors },
  { name: "Settings", icon: Settings },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("Overview");
  const [businessName, setBusinessName] = useState("The Corner Studio");
  const [businessType, setBusinessType] = useState("Barbershop");
  const [appointments, setAppointments] = useState(seedAppointments);
  const [services, setServices] = useState(seedServices);
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [newCustomer, setNewCustomer] = useState("");
  const [newService, setNewService] = useState(seedServices[0].name);
  const [newTime, setNewTime] = useState("15:30");
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([
    { role: "assistant", text: "Hi! I'm your studio assistant. I can help manage appointments, answer customer questions and follow up on cancellations. What would you like to do?" }
  ]);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState("");

  const confirmed = appointments.filter(a => a.status === "Confirmed").length;
  const cancelled = appointments.filter(a => a.status === "Cancelled").length;
  const todayRevenue = appointments.filter(a => a.status === "Confirmed").reduce((sum, a) => sum + (services.find(s => s.name === a.service)?.price ?? 0), 0);
  const filteredAppointments = useMemo(() => appointments.filter(a =>
    [a.customer, a.service, a.staff, a.time].some(v => v.toLowerCase().includes(search.toLowerCase()))
  ), [appointments, search]);

  function notify(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  }

  function cancelAppointment(id: number) {
    setAppointments(current => current.map(a => a.id === id ? { ...a, status: "Cancelled" } : a));
    notify("Appointment cancelled. The slot is now available to recover.");
  }

  function recoverSlot(id: number) {
    const appointment = appointments.find(a => a.id === id);
    if (!appointment) return;
    setAppointments(current => current.map(a => a.id === id ? { ...a, status: "Confirmed" } : a));
    notify("Waiting-list customer matched. Demo slot marked as filled.");
  }

  function addAppointment() {
    if (!newCustomer.trim()) return;
    const selected = services.find(s => s.name === newService) ?? services[0];
    setAppointments(current => [...current, {
      id: Date.now(), customer: newCustomer.trim(),
      initials: newCustomer.trim().split(/\s+/).map(v => v[0]).join("").slice(0, 2).toUpperCase(),
      service: selected?.name ?? "Appointment", staff: "Unassigned", time: newTime,
      duration: selected ? selected.duration + " min" : "30 min", status: "Confirmed", color: "lavender"
    }].sort((a,b) => a.time.localeCompare(b.time)));
    setNewCustomer("");
    setBookingOpen(false);
    notify("Appointment added to today's schedule.");
  }

  function sendChat() {
    const text = chatInput.trim();
    if (!text) return;
    setChatMessages(current => [...current, { role: "user", text }, { role: "assistant", text: "This demo is using sample data. Once we connect the AI model and your booking calendar, I'll be able to carry out this task for your business." }]);
    setChatInput("");
  }

  const pageTitle: Record<Tab, string> = {
    Overview: "Good morning",
    Appointments: "Appointments",
    Customers: "Customers",
    Services: "Services & pricing",
    Settings: "Business settings"
  };

  return (
    <main className="shell">
      <aside className="sidebar">
        <div className="brand"><div className="brand-symbol"><Sparkles size={19}/></div><span>studio<span className="brand-accent">flow</span></span></div>
        <button className="business-switch" onClick={() => setActiveTab("Settings")}><div className="business-avatar"><Scissors size={17}/></div><div className="business-switch-copy"><strong>{businessName}</strong><small>{businessType}</small></div><ChevronDown size={15}/></button>
        <div className="side-label">WORKSPACE</div>
        <nav className="nav-list">{navItems.map(item => <button key={item.name} className={activeTab === item.name ? "nav-link selected" : "nav-link"} onClick={() => setActiveTab(item.name)}><item.icon size={18}/><span>{item.name}</span>{item.name === "Appointments" && <small>{appointments.filter(a => a.status === "Confirmed").length}</small>}</button>)}</nav>
        <div className="sidebar-bottom">
          <div className="ai-card"><div className="ai-card-icon"><Zap size={16}/></div><strong>Your assistant is ready</strong><p>Connect your channels to start handling customer requests.</p><button onClick={() => setAssistantOpen(true)}>Open assistant <ArrowUpRight size={14}/></button></div>
          <div className="user-profile"><div className="user-avatar">JD</div><div><strong>Studio owner</strong><small>Admin account</small></div><MoreHorizontal size={18}/></div>
        </div>
      </aside>

      <section className="main">
        <header className="topbar">
          <div className="crumb">{businessName}<span>/</span><strong>{activeTab}</strong></div>
          <div className="topbar-actions"><label className="searchbox"><Search size={16}/><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search appointments..."/></label><button className="notification-button" aria-label="Notifications"><Bell size={18}/><i/></button><div className="user-avatar small">JD</div></div>
        </header>
        <div className="content">
          <div className="heading-row"><div><div className="eyebrow">TUESDAY, NOVEMBER 3, 2026</div><h1>{pageTitle[activeTab]}{activeTab === "Overview" ? ", Alex" : ""}<span className="heading-spark"> ✦</span></h1><p>{activeTab === "Overview" ? "Here's what's happening at your business today." : "Manage your business from one simple workspace."}</p></div><button className="primary-button" onClick={() => setBookingOpen(true)}><Plus size={16}/> New appointment</button></div>

          {activeTab === "Overview" && <>
            <div className="stats-grid">
              <article className="stat-card"><div className="stat-label">Appointments today <span className="stat-icon purple"><CalendarDays size={17}/></span></div><div className="stat-number">{appointments.length.toString().padStart(2,"0")}</div><div className="stat-foot"><span className="trend"><ArrowUpRight size={13}/> 12%</span> compared with last week</div></article>
              <article className="stat-card"><div className="stat-label">Confirmed bookings <span className="stat-icon blue"><CheckCircle2 size={17}/></span></div><div className="stat-number">{confirmed.toString().padStart(2,"0")}</div><div className="stat-foot">Appointments confirmed today</div></article>
              <article className="stat-card"><div className="stat-label">Estimated revenue <span className="stat-icon green"><CreditCard size={17}/></span></div><div className="stat-number">€{todayRevenue}</div><div className="stat-foot">Based on confirmed services</div></article>
              <article className="stat-card"><div className="stat-label">Slots recovered <span className="stat-icon orange"><Zap size={17}/></span></div><div className="stat-number">{cancelled.toString().padStart(2,"0")}</div><div className="stat-foot">Cancellations to follow up</div></article>
            </div>

            <div className="dashboard-grid">
              <section className="panel schedule-panel"><div className="panel-title"><div><h2>Today's schedule</h2><p>Your appointments at a glance.</p></div><button className="link-button" onClick={() => setActiveTab("Appointments")}>View calendar <ArrowRight size={14}/></button></div>
                <div className="appointment-list">{appointments.slice().sort((a,b)=>a.time.localeCompare(b.time)).slice(0,6).map(a => <div className="appointment-row" key={a.id}><div className="time-block">{a.time}<small>{a.duration}</small></div><div className={"customer-avatar "+a.color}>{a.initials}</div><div className="appointment-info"><strong>{a.customer}</strong><small>{a.service} · {a.staff}</small></div><span className={"status "+a.status.toLowerCase()}>{a.status}</span>{a.status === "Confirmed" && <button className="row-menu" title="Cancel appointment" onClick={() => cancelAppointment(a.id)}><MoreHorizontal size={17}/></button>}{a.status === "Cancelled" && <button className="recover-button" onClick={() => recoverSlot(a.id)}>Recover slot</button>}</div>)}</div>
                <button className="add-inline" onClick={() => setBookingOpen(true)}><Plus size={15}/> Add appointment</button>
              </section>

              <section className="panel assistant-panel"><div className="assistant-title"><div className="assistant-logo"><Sparkles size={18}/></div><div><h2>AI booking assistant</h2><p>Customer communication, handled.</p></div><span className="live-indicator">DEMO</span></div><div className="assistant-preview"><div className="assistant-avatar"><Sparkles size={13}/></div><div><strong>Good morning!</strong><p>You have {cancelled} cancelled appointment{cancelled === 1 ? "" : "s"} today. I can help find a customer from your waiting list to fill an open slot.</p></div></div><div className="suggestion-label">TRY THE DEMO</div><button className="suggestion" onClick={() => setAssistantOpen(true)}>Show today's booking summary <ArrowUpRight size={14}/></button><button className="suggestion" onClick={() => setAssistantOpen(true)}>Draft a reply to a customer <ArrowUpRight size={14}/></button><button className="assistant-open" onClick={() => setAssistantOpen(true)}>Open AI assistant <ArrowUpRight size={15}/></button></section>
            </div>

            <section className="panel activity-panel"><div className="panel-title"><div><h2>Recent customer activity</h2><p>Example conversations from your connected channels.</p></div><button className="link-button" onClick={() => setActiveTab("Customers")}>View customers <ArrowRight size={14}/></button></div><div className="activity-row"><div className="channel-icon whatsapp"><MessageCircle size={16}/></div><div className="activity-copy"><strong>Lisa Müller</strong><small>WhatsApp · “Do you have any appointments available tomorrow?”</small></div><span className="activity-time">5 min ago</span><span className="unread-tag">New</span></div><div className="activity-row"><div className="channel-icon email"><UserRound size={16}/></div><div className="activity-copy"><strong>Tom Becker</strong><small>WhatsApp · “I need to move my appointment to Friday.”</small></div><span className="activity-time">18 min ago</span><span className="answered-tag">Handled</span></div></section>
          </>}

          {activeTab === "Appointments" && <section className="panel full-panel"><div className="panel-title"><div><h2>All appointments</h2><p>Manage bookings, cancellations and open slots.</p></div><button className="primary-button compact" onClick={() => setBookingOpen(true)}><Plus size={15}/> Add booking</button></div><div className="table-head"><span>TIME</span><span>CUSTOMER</span><span>SERVICE</span><span>STAFF</span><span>STATUS</span><span>ACTION</span></div>{filteredAppointments.map(a => <div className="table-row" key={a.id}><strong>{a.time}</strong><span>{a.customer}</span><span>{a.service}</span><span>{a.staff}</span><span><i className={"status "+a.status.toLowerCase()}>{a.status}</i></span><span>{a.status === "Confirmed" ? <button className="table-action" onClick={() => cancelAppointment(a.id)}>Cancel</button> : a.status === "Cancelled" ? <button className="table-action recover" onClick={() => recoverSlot(a.id)}>Recover slot</button> : <span className="muted">Waiting</span>}</span></div>)}</section>}

          {activeTab === "Customers" && <section className="panel full-panel"><div className="panel-title"><div><h2>Customers</h2><p>Customer list and recent activity. Demo records only.</p></div></div>{[["Lisa Müller","LM","WhatsApp","Returning customer"],["Tom Becker","TB","WhatsApp","Appointment change"],["Sophie Weber","SW","In person","Regular customer"],["Daniel Fischer","DF","WhatsApp","Regular customer"],["Emma Schneider","ES","Instagram","New customer"]].map((c,i)=><div className="customer-list-row" key={c[0]}><div className={"customer-avatar "+["lavender","blue","peach","mint","pink"][i]}>{c[1]}</div><div className="customer-name"><strong>{c[0]}</strong><small>{c[2]}</small></div><span className="customer-note">{c[3]}</span><button className="table-action" onClick={() => setAssistantOpen(true)}>Message</button></div>)}</section>}

          {activeTab === "Services" && <section className="panel full-panel"><div className="panel-title"><div><h2>Your services</h2><p>Set the services, durations and prices customers see when booking.</p></div><button className="primary-button compact" onClick={() => { const name=window.prompt("Service name"); if(name?.trim()) setServices(s=>[...s,{id:Date.now(),name:name.trim(),duration:30,price:25}]); }}><Plus size={15}/> Add service</button></div><div className="service-grid">{services.map(s=><article className="service-card" key={s.id}><div className="service-icon"><Scissors size={18}/></div><strong>{s.name}</strong><div className="service-meta"><span><Clock3 size={13}/> {s.duration} min</span><b>€{s.price}</b></div><button className="service-edit" onClick={() => {const price=window.prompt("Set price in euros",String(s.price)); if(price && !Number.isNaN(Number(price))) setServices(current=>current.map(x=>x.id===s.id?{...x,price:Number(price)}:x));}}>Edit price</button></article>)}</div></section>}

          {activeTab === "Settings" && <section className="panel settings-panel"><div className="settings-section"><div><h2>Business profile</h2><p>Personalise the assistant for your business.</p></div><label>Business name<input value={businessName} onChange={e=>setBusinessName(e.target.value)} /></label><label>Business type<select value={businessType} onChange={e=>setBusinessType(e.target.value)}><option>Barbershop</option><option>Hair salon</option><option>Nail salon</option><option>Beauty studio</option><option>Other appointment business</option></select></label><label>Business location<input defaultValue="Barcelona, Spain" /></label><button className="primary-button compact" onClick={()=>notify("Business profile saved in this demo.")}>Save changes</button></div><div className="settings-section"><h2>Assistant behaviour</h2><p>Choose what your assistant should help with. These controls are a product preview.</p>{["Answer questions about services and prices","Book and reschedule appointments","Send appointment reminders","Follow up on cancellations and waiting lists","Hand over complex requests to a person"].map((v,i)=><label className="toggle-row" key={v}><span>{v}</span><input type="checkbox" defaultChecked={i!==3}/></label>)}</div><div className="settings-section"><h2>Opening hours</h2><p>Example schedule. We will make these settings editable in the next build.</p>{["Monday – Friday","Saturday","Sunday"].map((v,i)=><div className="hours-row" key={v}><span>{v}</span><strong>{i===2?"Closed":i===1?"10:00 – 16:00":"09:00 – 19:00"}</strong></div>)}</div></section>}

          <footer className="footer">STUDIOFLOW <span>·</span> APPOINTMENT BUSINESS ASSISTANT <span className="footer-right">DEMO ENVIRONMENT · SAMPLE DATA</span></footer>
        </div>
      </section>

      {bookingOpen && <div className="overlay" onClick={()=>setBookingOpen(false)}><section className="modal" onClick={e=>e.stopPropagation()}><div className="modal-heading"><div><h2>New appointment</h2><p>Add a booking to the demo schedule.</p></div><button className="close-button" onClick={()=>setBookingOpen(false)}><X size={18}/></button></div><label>Customer name<input autoFocus value={newCustomer} onChange={e=>setNewCustomer(e.target.value)} placeholder="e.g. Jamie Smith"/></label><label>Service<select value={newService} onChange={e=>setNewService(e.target.value)}>{services.map(s=><option key={s.id}>{s.name}</option>)}</select></label><label>Time<input type="time" value={newTime} onChange={e=>setNewTime(e.target.value)}/></label><button className="primary-button modal-submit" onClick={addAppointment} disabled={!newCustomer.trim()}>Add appointment <ArrowRight size={15}/></button></section></div>}

      {assistantOpen && <div className="overlay" onClick={()=>setAssistantOpen(false)}><section className="chat-modal" onClick={e=>e.stopPropagation()}><div className="chat-heading"><div className="assistant-logo"><Sparkles size={18}/></div><div><h2>AI booking assistant</h2><p>Prototype · AI and messaging integrations not connected</p></div><button className="close-button" onClick={()=>setAssistantOpen(false)}><X size={18}/></button></div><div className="chat-body">{chatMessages.map((m,i)=><div className={m.role==="assistant"?"chat-bubble assistant-bubble":"chat-bubble user-bubble"} key={i}>{m.text}</div>)}</div><form className="chat-compose" onSubmit={e=>{e.preventDefault();sendChat();}}><input value={chatInput} onChange={e=>setChatInput(e.target.value)} placeholder="Ask about bookings or customers..."/><button type="submit" aria-label="Send message"><Send size={16}/></button></form></section></div>}

      {toast && <div className="toast"><CheckCircle2 size={16}/>{toast}</div>}
    </main>
  );
}
