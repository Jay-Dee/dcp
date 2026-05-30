import { useEffect, useMemo, useState } from "react";
import { getAuditEvents, getDevices, getEvents } from "./api";
import type { AuditEvent, DeviceRecord, DomainEvent } from "./types";
import "./App.css";

function App() {
  const [devices, setDevices] = useState<DeviceRecord[]>([]);
  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [events, setEvents] = useState<DomainEvent[]>([]);

  async function loadDashboard() {
    try {
      setError(null);

      const [deviceData, auditData, eventData] = await Promise.all([
        getDevices(),
        getAuditEvents(),
        getEvents(),
      ]);

      setDevices(deviceData);
      setAuditEvents(auditData);
      setEvents(eventData);
    } catch {
      setError("Unable to load dashboard data");
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  const summary = useMemo(() => {
    const compliant = devices.filter((d) => d.status === "COMPLIANT").length;
    const nonCompliant = devices.length - compliant;

    return {
      total: devices.length,
      compliant,
      nonCompliant,
    };
  }, [devices]);

  return (
    <main className="page">
      <header className="header">
        <div>
          <p className="eyebrow">Endpoint Platform</p>
          <h1>Compliance Dashboard</h1>
          <p className="subtitle">
            Local MVP for device compliance monitoring and audit visibility.
          </p>
        </div>

        <button onClick={loadDashboard}>Refresh</button>
      </header>

      {error && <section className="error">{error}</section>}

      <section className="summary-grid">
        <SummaryCard label="Total Devices" value={summary.total} />
        <SummaryCard label="Compliant" value={summary.compliant} />
        <SummaryCard label="Non-Compliant" value={summary.nonCompliant} />
      </section>

      <section className="panel">
        <h2>Device Inventory</h2>

        <table>
          <thead>
            <tr>
              <th>Device</th>
              <th>Platform</th>
              <th>Status</th>
              <th>Violations</th>
              <th>Last Check-In</th>
            </tr>
          </thead>
          <tbody>
            {devices.map((device) => (
              <tr key={device.deviceId}>
                <td>{device.deviceId}</td>
                <td>{device.platform}</td>
                <td>
                  <StatusBadge status={device.status} />
                </td>
                <td>{device.violations.length}</td>
                <td>{new Date(device.checkedInAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {devices.length === 0 && (
          <p className="empty">No devices have checked in yet.</p>
        )}
      </section>

      <section className="panel">
        <h2>Audit Events</h2>

        <table>
          <thead>
            <tr>
              <th>Time</th>
              <th>Device</th>
              <th>Action</th>
              <th>Status</th>
              <th>Violations</th>
            </tr>
          </thead>
          <tbody>
            {auditEvents.map((event) => (
              <tr key={event.auditId}>
                <td>{new Date(event.timestamp).toLocaleString()}</td>
                <td>{event.deviceId}</td>
                <td>{event.action}</td>
                <td>{event.status}</td>
                <td>{event.violationCount}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {auditEvents.length === 0 && (
          <p className="empty">No audit events recorded yet.</p>
        )}
      </section>

      <section className="panel">
        <h2>Event Store</h2>

        <table>
          <thead>
            <tr>
              <th>Time</th>
              <th>Event Type</th>
              <th>Aggregate</th>
            </tr>
          </thead>

          <tbody>
            {events.map((event) => (
              <tr key={event.eventId}>
                <td>{new Date(event.timestamp).toLocaleString()}</td>
                <td>{event.eventType}</td>
                <td>{event.aggregateId}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {events.length === 0 && <p className="empty">No events recorded.</p>}
      </section>
    </main>
  );
}

function SummaryCard(props: { label: string; value: number }) {
  return (
    <div className="card">
      <span>{props.label}</span>
      <strong>{props.value}</strong>
    </div>
  );
}

function StatusBadge(props: { status: DeviceRecord["status"] }) {
  return (
    <span className={`badge ${props.status.toLowerCase()}`}>
      {props.status}
    </span>
  );
}

export default App;
