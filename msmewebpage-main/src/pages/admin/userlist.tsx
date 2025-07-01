import React, { useEffect, useState } from "react";
import axios from "axios";

const UserList: React.FC = () => {
    const [users, setUsers] = useState<any[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState("");
    const [copiedEmail, setCopiedEmail] = useState<string | null>(null);

    useEffect(() => {
        axios.get("/api/admin/users")
            .then(res => {
                if (Array.isArray(res.data)) {
                    setUsers(res.data);
                    setFilteredUsers(res.data);
                } else {
                    setUsers([]);
                    setFilteredUsers([]);
                }
                setLoading(false);
            })
            .catch(() => {
                setError("Failed to fetch users");
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        if (!search) {
            setFilteredUsers(users);
        } else {
            const s = search.toLowerCase();
            setFilteredUsers(
                users.filter(
                    (u: any) =>
                        (u.name && u.name.toLowerCase().includes(s)) ||
                        (u.email && u.email.toLowerCase().includes(s)) ||
                        (u.organization && u.organization.toLowerCase().includes(s)) ||
                        (u.role && u.role.toLowerCase().includes(s)) ||
                        (u.phoneNumber && u.phoneNumber.toLowerCase().includes(s))
                )
            );
        }
    }, [search, users]);

    const handleCopy = (email: string) => {
        navigator.clipboard.writeText(email);
        setCopiedEmail(email);
        setTimeout(() => setCopiedEmail(null), 1200);
    };

    return (
        <div style={{
            maxWidth: 1200,
            margin: "40px auto",
            padding: "32px 16px",
            background: "linear-gradient(135deg, #181c24 0%, #23272f 100%)",
            minHeight: "100vh",
            borderRadius: 18,
            boxShadow: "0 8px 32px 0 rgba(0,0,0,0.25)",
        }}>
            <h2 style={{
                marginBottom: 24,
                color: "#fff",
                fontWeight: 700,
                fontSize: 32,
                letterSpacing: 1
            }}>Admin User Management</h2>
            <div style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 24,
                gap: 12
            }}>
                <input
                    type="text"
                    placeholder="Search by name, email, org, role, phone"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    style={{
                        padding: "10px 16px",
                        borderRadius: 8,
                        border: "1px solid #333",
                        width: 340,
                        fontSize: 17,
                        background: "#23272f",
                        color: "#fff",
                        outline: "none",
                        boxShadow: "0 1px 4px 0 #0002"
                    }}
                />
                <span style={{
                    fontWeight: 500,
                    color: "#bbb",
                    fontSize: 16,
                    background: "#23272f",
                    padding: "8px 18px",
                    borderRadius: 8,
                    letterSpacing: 0.5
                }}>
                    {filteredUsers.length} {filteredUsers.length === 1 ? "user" : "users"}
                </span>
            </div>
            {loading ? (
                <div style={{ textAlign: "center", padding: 60 }}>
                    <div className="spinner" style={{
                        border: "5px solid #23272f",
                        borderTop: "5px solid #fff",
                        borderRadius: "50%",
                        width: 44,
                        height: 44,
                        animation: "spin 1s linear infinite",
                        margin: "0 auto 16px"
                    }} />
                    <div style={{ color: "#fff", fontSize: 18 }}>Loading users...</div>
                    <style>
                        {`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}
                    </style>
                </div>
            ) : error ? (
                <div style={{ color: "red", textAlign: "center", padding: 32, fontSize: 18 }}>{error}</div>
            ) : (
                <div style={{ overflowX: "auto", borderRadius: 12, background: "#181c24" }}>
                    <table style={{
                        width: "100%",
                        borderCollapse: "separate",
                        borderSpacing: 0,
                        background: "transparent",
                        color: "#fff",
                        fontFamily: "inherit"
                    }}>
                        <thead>
                            <tr style={{
                                background: "rgba(35,39,47,0.98)",
                                position: "sticky",
                                top: 0,
                                zIndex: 2
                            }}>
                                <th style={thStyle}>#</th>
                                <th style={thStyle}>User</th>
                                <th style={thStyle}>Email</th>
                                <th style={thStyle}>Role</th>
                                <th style={thStyle}>Organization</th>
                                <th style={thStyle}>Phone</th>
                                <th style={thStyle}>Status</th>
                                <th style={thStyle}>Created At</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map((user: any, idx: number) => (
                                    <tr key={user.id ?? user.email ?? idx}
                                        style={{
                                            transition: "background 0.2s",
                                            background: idx % 2 === 0 ? "#1e222b" : "#23272f"
                                        }}
                                        onMouseOver={e => (e.currentTarget.style.background = "#2a2f3a")}
                                        onMouseOut={e => (e.currentTarget.style.background = idx % 2 === 0 ? "#1e222b" : "#23272f")}
                                    >
                                        <td style={tdStyle}>{idx + 1}</td>
                                        <td style={{ ...tdStyle, display: "flex", alignItems: "center", gap: 10 }}>
                                            <div style={{
                                                width: 36,
                                                height: 36,
                                                borderRadius: "50%",
                                                background: "linear-gradient(135deg, #3a3f4b 0%, #23272f 100%)",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                fontWeight: 700,
                                                color: "#fff",
                                                fontSize: 17,
                                                marginRight: 8,
                                                border: "2px solid #23272f"
                                            }}>
                                                {user.name ? user.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0,2) : "U"}
                                            </div>
                                            <span>{user.name || <span style={{ color: "#888" }}>-</span>}</span>
                                        </td>
                                        <td style={{ ...tdStyle, cursor: "pointer", position: "relative" }}
                                            onClick={() => user.email && handleCopy(user.email)}
                                            title="Click to copy"
                                        >
                                            {user.email || <span style={{ color: "#888" }}>-</span>}
                                            {copiedEmail === user.email && (
                                                <span style={{
                                                    position: "absolute",
                                                    left: "50%",
                                                    top: "50%",
                                                    transform: "translate(-50%,-120%)",
                                                    background: "#23272f",
                                                    color: "#4caf50",
                                                    fontSize: 13,
                                                    padding: "2px 10px",
                                                    borderRadius: 6,
                                                    pointerEvents: "none"
                                                }}>Copied!</span>
                                            )}
                                        </td>
                                        <td style={tdStyle}>
                                            <span style={{
                                                background: "#2e7dff22",
                                                color: "#6ea8ff",
                                                padding: "4px 12px",
                                                borderRadius: 8,
                                                fontWeight: 600,
                                                fontSize: 14,
                                                letterSpacing: 0.5
                                            }}>{user.role || <span style={{ color: "#888" }}>-</span>}</span>
                                        </td>
                                        <td style={tdStyle}>{user.organization || <span style={{ color: "#888" }}>-</span>}</td>
                                        <td style={tdStyle}>{user.phoneNumber || <span style={{ color: "#888" }}>-</span>}</td>
                                        <td style={tdStyle}>
                                            <span style={{
                                                background: user.isActive ? "#4caf5022" : "#f4433622",
                                                color: user.isActive ? "#4caf50" : "#f44336",
                                                fontWeight: 700,
                                                padding: "4px 12px",
                                                borderRadius: 8,
                                                fontSize: 14
                                            }}>
                                                {user.isActive ? "Active" : "Inactive"}
                                            </span>
                                        </td>
                                        <td style={tdStyle}>
                                            {user.createdAt
                                                ? new Date(user.createdAt).toLocaleString()
                                                : <span style={{ color: "#888" }}>-</span>}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={8} style={{ textAlign: "center", color: "#888", padding: 32, fontSize: 17 }}>
                                        {search ? "No users match your search." : "No users found."}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
            <style>
                {`
                @media (max-width: 900px) {
                    table, thead, tbody, th, td, tr { display: block; }
                    thead tr { display: none; }
                    tr { margin-bottom: 18px; }
                    td { border: none !important; padding: 12px 8px !important; }
                }
                `}
            </style>
        </div>
    );
};

const thStyle: React.CSSProperties = {
    padding: "14px 10px",
    borderBottom: "2px solid #23272f",
    textAlign: "left",
    fontWeight: 700,
    fontSize: 16,
    color: "#fff",
    letterSpacing: 0.5
};

const tdStyle: React.CSSProperties = {
    padding: "12px 10px",
    borderBottom: "1px solid #23272f",
    fontSize: 15,
    color: "#fff",
    verticalAlign: "middle"
};

export default UserList;
