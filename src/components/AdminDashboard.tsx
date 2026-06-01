import { useState, useEffect } from "react";
import {
  Database,
  BrainCircuit,
  Plus,
  Trash2,
  Save,
  X,
  RefreshCw,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  FileText,
  Tag,
  ChevronRight,
  Package,
  Layers,
  Cpu,
  Zap,
  BarChart3,
  Settings2,
  Clock,
  Activity,
  LogOut,
} from "lucide-react";

import { type TravelPackage } from "../data/knowledgeBase";

interface Intent {
  name: string;
  patterns: string[];
  responses: string[];
}

interface ModelInfo {
  status: string;
  algorithm: string;
  last_trained: string;
  dataset_size: number;
  number_of_intents: number;
  classes: string[];
}

interface ModelMetrics {
  overall_performance: {
    accuracy: number;
    f1_score: number;
    training_timestamp: string;
    dataset_size: number;
    selected_algorithm: string;
    lr_metrics?: { accuracy: number; f1_score: number };
    nb_metrics?: { accuracy: number; f1_score: number };
  };
  intent_breakdown: Record<string, {
    precision: number;
    recall: number;
    f1_score: number;
    support: number;
  }>;
  model_comparison: Record<string, {
    accuracy: number;
    precision: number;
    recall: number;
    f1_score: number;
    training_time_sec: number;
  }>;
}

interface AdminDashboardProps {
  onLogout?: () => void;
}

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<"packages" | "intents" | "model">("packages");


  // Data State
  const [packages, setPackages] = useState<TravelPackage[]>([]);
  const [intents, setIntents] = useState<Intent[]>([]);
  const [modelInfo, setModelInfo] = useState<ModelInfo | null>(null);
  const [modelMetrics, setModelMetrics] = useState<ModelMetrics | null>(null);

  // Selected items for editing
  const [selectedPkgId, setSelectedPkgId] = useState<string | null>(null);
  const [selectedIntentName, setSelectedIntentName] = useState<string | null>(null);

  // Forms / Editing State
  const [editingPkg, setEditingPkg] = useState<Partial<TravelPackage> | null>(null);
  const [editingIntent, setEditingIntent] = useState<Intent | null>(null);

  // Dynamic tag inputs
  const [newHighlight, setNewHighlight] = useState("");
  const [newInclusion, setNewInclusion] = useState("");
  const [newPattern, setNewPattern] = useState("");
  const [newResponse, setNewResponse] = useState("");

  // Loading & Notification State
  const [loading, setLoading] = useState(false);
  const [retraining, setRetraining] = useState(false);
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Fetch Data
  const fetchPackages = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/admin/packages");
      if (res.ok) {
        const data = await res.json();
        setPackages(data);
        if (data.length > 0 && !selectedPkgId && !editingPkg) {
          setSelectedPkgId(data[0].id);
          setEditingPkg(data[0]);
        }
      }
    } catch (e) {
      showNotice("error", "Failed to fetch packages from backend.");
    }
  };

  const fetchIntents = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/admin/intents");
      if (res.ok) {
        const data = await res.json();
        setIntents(data);
        if (data.length > 0 && !selectedIntentName && !editingIntent) {
          setSelectedIntentName(data[0].name);
          setEditingIntent(data[0]);
        }
      }
    } catch (e) {
      showNotice("error", "Failed to fetch intents from backend.");
    }
  };

  const fetchModelInfo = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/model-info");
      if (res.ok) {
        const data = await res.json();
        setModelInfo(data);
      }
    } catch (e) {}
  };

  const fetchModelMetrics = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/model-metrics");
      if (res.ok) {
        const data = await res.json();
        setModelMetrics(data);
      }
    } catch (e) {}
  };

  const loadAllData = async () => {
    setLoading(true);
    await Promise.all([fetchPackages(), fetchIntents(), fetchModelInfo(), fetchModelMetrics()]);
    setLoading(false);
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const showNotice = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleSelectPkg = (pkg: TravelPackage) => {
    setSelectedPkgId(pkg.id);
    setEditingPkg({ ...pkg });
    setNewHighlight("");
    setNewInclusion("");
  };

  const handleSelectIntent = (intent: Intent) => {
    setSelectedIntentName(intent.name);
    setEditingIntent({ ...intent });
    setNewPattern("");
    setNewResponse("");
  };

  const handleInitNewPackage = () => {
    setSelectedPkgId(null);
    setEditingPkg({
      id: `pkg-${String(packages.length + 1).padStart(3, "0")}`,
      name: "",
      destination: "",
      category: "beach",
      duration: "3 Days / 2 Nights",
      price: 15000,
      currency: "LKR",
      description: "",
      highlights: [],
      includes: [],
      rating: 5.0,
      emoji: "🌴",
      image: "from-cyan-400 to-blue-600",
    });
    setNewHighlight("");
    setNewInclusion("");
  };

  const handleSavePackage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPkg?.id || !editingPkg?.name || !editingPkg?.destination || !editingPkg?.category || !editingPkg?.price) {
      showNotice("error", "Please fill in all required package fields.");
      return;
    }

    const isEdit = packages.some((p) => p.id === editingPkg.id);
    const method = isEdit ? "PUT" : "POST";
    const url = isEdit
      ? `http://localhost:8000/api/admin/packages/${editingPkg.id}`
      : "http://localhost:8000/api/admin/packages";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingPkg),
      });

      if (res.ok) {
        showNotice("success", `Package successfully ${isEdit ? "updated" : "created"}!`);
        fetchPackages();
        if (!isEdit) {
          setSelectedPkgId(editingPkg.id);
        }
      } else {
        const err = await res.json();
        showNotice("error", err.detail || "Error saving package.");
      }
    } catch (e) {
      showNotice("error", "Network error while saving package.");
    }
  };

  const handleDeletePackage = async (id: string) => {
    if (!confirm("Are you sure you want to delete this travel package? This action is permanent.")) return;

    try {
      const res = await fetch(`http://localhost:8000/api/admin/packages/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        showNotice("success", "Package deleted successfully!");
        setSelectedPkgId(null);
        setEditingPkg(null);
        fetchPackages();
      } else {
        const err = await res.json();
        showNotice("error", err.detail || "Failed to delete package.");
      }
    } catch (e) {
      showNotice("error", "Network error while deleting package.");
    }
  };

  const handleSaveIntent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingIntent?.name) return;

    try {
      const res = await fetch(`http://localhost:8000/api/admin/intents/${editingIntent.name}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingIntent),
      });

      if (res.ok) {
        showNotice("success", `Intent '${editingIntent.name}' dataset updated successfully.`);
        fetchIntents();
      } else {
        showNotice("error", "Failed to save intent.");
      }
    } catch (e) {
      showNotice("error", "Network error while saving intent.");
    }
  };

  const handleRetrain = async () => {
    setRetraining(true);
    showNotice("success", "Model retraining started. Processing NLP pipelines...");
    try {
      const res = await fetch("http://localhost:8000/api/retrain", { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        showNotice("success", `Retraining complete! Winner: ${data.selected_algorithm} (Accuracy: ${(data.accuracy * 100).toFixed(2)}%)`);
        fetchModelInfo();
        fetchModelMetrics();
      } else {
        showNotice("error", "Retraining process failed on the backend.");
      }
    } catch (e) {
      showNotice("error", "Network error during retraining trigger.");
    } finally {
      setRetraining(false);
    }
  };

  const addHighlight = () => {
    if (!newHighlight.trim() || !editingPkg) return;
    const currentList = editingPkg.highlights || [];
    setEditingPkg({ ...editingPkg, highlights: [...currentList, newHighlight.trim()] });
    setNewHighlight("");
  };

  const removeHighlight = (index: number) => {
    if (!editingPkg?.highlights) return;
    const list = [...editingPkg.highlights];
    list.splice(index, 1);
    setEditingPkg({ ...editingPkg, highlights: list });
  };

  const addInclusion = () => {
    if (!newInclusion.trim() || !editingPkg) return;
    const currentList = editingPkg.includes || [];
    setEditingPkg({ ...editingPkg, includes: [...currentList, newInclusion.trim()] });
    setNewInclusion("");
  };

  const removeInclusion = (index: number) => {
    if (!editingPkg?.includes) return;
    const list = [...editingPkg.includes];
    list.splice(index, 1);
    setEditingPkg({ ...editingPkg, includes: list });
  };

  const addPattern = () => {
    if (!newPattern.trim() || !editingIntent) return;
    const currentList = editingIntent.patterns || [];
    setEditingIntent({ ...editingIntent, patterns: [...currentList, newPattern.trim().toLowerCase()] });
    setNewPattern("");
  };

  const removePattern = (index: number) => {
    if (!editingIntent?.patterns) return;
    const list = [...editingIntent.patterns];
    list.splice(index, 1);
    setEditingIntent({ ...editingIntent, patterns: list });
  };

  const addResponse = () => {
    if (!newResponse.trim() || !editingIntent) return;
    const currentList = editingIntent.responses || [];
    setEditingIntent({ ...editingIntent, responses: [...currentList, newResponse.trim()] });
    setNewResponse("");
  };

  const removeResponse = (index: number) => {
    if (!editingIntent?.responses) return;
    const list = [...editingIntent.responses];
    list.splice(index, 1);
    setEditingIntent({ ...editingIntent, responses: list });
  };

  const tabs = [
    { id: "packages" as const, label: "Travel Packages", icon: Database, count: packages.length },
    { id: "intents" as const, label: "NLP Intents", icon: Tag, count: intents.length },
    { id: "model" as const, label: "Model & Metrics", icon: BrainCircuit, count: null },
  ];

  return (
    <div style={styles.root}>

      {/* ── HEADER ── */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.headerIconWrap}>
            <Settings2 size={22} color="white" />
          </div>
          <div>
            <h1 style={styles.headerTitle}>Control Dashboard</h1>
            <p style={styles.headerSub}>Manage packages, NLP intents, and retrain the ML classifier</p>
          </div>
        </div>

        <div style={styles.headerRight}>
          {notification && (
            <div style={{
              ...styles.notif,
              ...(notification.type === "success" ? styles.notifSuccess : styles.notifError),
            }}>
              {notification.type === "success"
                ? <CheckCircle size={14} />
                : <AlertTriangle size={14} />}
              <span style={styles.notifText}>{notification.message}</span>
            </div>
          )}
          <button
            onClick={loadAllData}
            disabled={loading}
            style={styles.refreshBtn}
            title="Reload Data"
          >
            <RefreshCw size={16} style={loading ? { animation: "spin 1s linear infinite" } : {}} />
            <span style={{ fontSize: 13, fontWeight: 600 }}>Refresh</span>
          </button>
          
          {onLogout && (
            <button
              onClick={onLogout}
              style={{
                ...styles.refreshBtn,
                background: "rgba(239, 68, 68, 0.08)",
                color: "#ef4444",
                borderColor: "rgba(239, 68, 68, 0.2)",
              }}
              title="Log Out"
            >
              <LogOut size={16} />
              <span style={{ fontSize: 13, fontWeight: 600 }}>Log Out</span>
            </button>
          )}
        </div>
      </div>


      {/* ── TAB BAR ── */}
      <div style={styles.tabBar}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{ ...styles.tabBtn, ...(isActive ? styles.tabBtnActive : {}) }}
            >
              <tab.icon size={15} style={{ flexShrink: 0 }} />
              <span>{tab.label}</span>
              {tab.count !== null && (
                <span style={{ ...styles.tabCount, ...(isActive ? styles.tabCountActive : {}) }}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── CONTENT AREA ── */}
      <div style={styles.content}>

        {/* ═══════════════════════════════════════════
            TAB 1 — TRAVEL PACKAGES
        ═══════════════════════════════════════════ */}
        {activeTab === "packages" && (
          <div style={styles.splitLayout}>

            {/* LEFT: Package List */}
            <div style={styles.listPane}>
              <div style={styles.listPaneHeader}>
                <div style={styles.listPaneTitle}>
                  <Package size={16} style={{ color: "#0ea5e9" }} />
                  <span>Packages</span>
                  <span style={styles.listCount}>{packages.length}</span>
                </div>
                <button onClick={handleInitNewPackage} style={styles.addBtn}>
                  <Plus size={13} />
                  <span>New</span>
                </button>
              </div>

              <div style={styles.listScroll}>
                {packages.map((pkg) => {
                  const isSelected = selectedPkgId === pkg.id;
                  return (
                    <div
                      key={pkg.id}
                      onClick={() => handleSelectPkg(pkg)}
                      style={{
                        ...styles.listItem,
                        ...(isSelected ? styles.listItemActive : {}),
                      }}
                    >
                      <div style={styles.listItemEmoji}>{pkg.emoji}</div>
                      <div style={styles.listItemBody}>
                        <div style={styles.listItemName}>{pkg.name}</div>
                        <div style={styles.listItemMeta}>
                          {pkg.category.toUpperCase()} · {pkg.duration}
                        </div>
                      </div>
                      <ChevronRight
                        size={14}
                        style={{
                          color: isSelected ? "#0ea5e9" : "#94a3b8",
                          transform: isSelected ? "translateX(2px)" : "none",
                          transition: "all 0.2s",
                          flexShrink: 0,
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* RIGHT: Editor */}
            <div style={styles.editorPane}>
              {editingPkg ? (
                <form onSubmit={handleSavePackage} style={styles.editorForm}>
                  {/* Editor Header */}
                  <div style={styles.editorHeader}>
                    <div>
                      <div style={styles.editorLabel}>
                        {packages.some((p) => p.id === editingPkg.id) ? "Editing Package" : "New Package"}
                      </div>
                      <div style={styles.editorTitle}>
                        {packages.some((p) => p.id === editingPkg.id)
                          ? editingPkg.name || "Untitled"
                          : "Build a New Tour Package"}
                      </div>
                    </div>
                    {packages.some((p) => p.id === editingPkg.id) && (
                      <button
                        type="button"
                        onClick={() => handleDeletePackage(editingPkg.id!)}
                        style={styles.deleteBtn}
                      >
                        <Trash2 size={13} />
                        <span>Delete</span>
                      </button>
                    )}
                  </div>

                  <div style={styles.editorBody}>
                    {/* Row 1: ID + Name */}
                    <div style={styles.formRow2}>
                      <div style={styles.formField}>
                        <label style={styles.fieldLabel}>Package ID *</label>
                        <input
                          type="text"
                          required
                          value={editingPkg.id || ""}
                          onChange={(e) => setEditingPkg({ ...editingPkg, id: e.target.value })}
                          disabled={packages.some((p) => p.id === editingPkg.id)}
                          style={{ ...styles.input, ...(packages.some((p) => p.id === editingPkg.id) ? styles.inputDisabled : {}) }}
                          placeholder="pkg-001"
                        />
                      </div>
                      <div style={styles.formField}>
                        <label style={styles.fieldLabel}>Package Name *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Ella Greenery Tour"
                          value={editingPkg.name || ""}
                          onChange={(e) => setEditingPkg({ ...editingPkg, name: e.target.value })}
                          style={styles.input}
                        />
                      </div>
                    </div>

                    {/* Row 2: Destination + Category + Emoji */}
                    <div style={styles.formRow3}>
                      <div style={{ ...styles.formField, flex: 2 }}>
                        <label style={styles.fieldLabel}>Destination *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Ella, Sri Lanka"
                          value={editingPkg.destination || ""}
                          onChange={(e) => setEditingPkg({ ...editingPkg, destination: e.target.value })}
                          style={styles.input}
                        />
                      </div>
                      <div style={{ ...styles.formField, flex: 1 }}>
                        <label style={styles.fieldLabel}>Category *</label>
                        <select
                          value={editingPkg.category || "beach"}
                          onChange={(e) => setEditingPkg({ ...editingPkg, category: e.target.value as any })}
                          style={styles.select}
                        >
                          <option value="beach">🌊 Beach</option>
                          <option value="hill">⛰️ Hill</option>
                          <option value="safari">🦁 Safari</option>
                          <option value="cultural">🏛️ Cultural</option>
                          <option value="heritage">🏔️ Heritage</option>
                        </select>
                      </div>
                      <div style={{ ...styles.formField, flex: 0.6 }}>
                        <label style={styles.fieldLabel}>Emoji</label>
                        <input
                          type="text"
                          placeholder="🌴"
                          value={editingPkg.emoji || ""}
                          onChange={(e) => setEditingPkg({ ...editingPkg, emoji: e.target.value })}
                          style={{ ...styles.input, textAlign: "center", fontSize: 20 }}
                        />
                      </div>
                    </div>

                    {/* Row 3: Duration + Price + Rating */}
                    <div style={styles.formRow3}>
                      <div style={styles.formField}>
                        <label style={styles.fieldLabel}>Duration</label>
                        <input
                          type="text"
                          placeholder="3 Days / 2 Nights"
                          value={editingPkg.duration || ""}
                          onChange={(e) => setEditingPkg({ ...editingPkg, duration: e.target.value })}
                          style={styles.input}
                        />
                      </div>
                      <div style={styles.formField}>
                        <label style={styles.fieldLabel}>Price (LKR) *</label>
                        <input
                          type="number"
                          required
                          placeholder="18500"
                          value={editingPkg.price || ""}
                          onChange={(e) => setEditingPkg({ ...editingPkg, price: parseFloat(e.target.value) })}
                          style={styles.input}
                        />
                      </div>
                      <div style={styles.formField}>
                        <label style={styles.fieldLabel}>Rating</label>
                        <input
                          type="number"
                          step="0.1"
                          min="1.0"
                          max="5.0"
                          value={editingPkg.rating || 5.0}
                          onChange={(e) => setEditingPkg({ ...editingPkg, rating: parseFloat(e.target.value) })}
                          style={styles.input}
                        />
                      </div>
                    </div>

                    {/* Description */}
                    <div style={styles.formField}>
                      <label style={styles.fieldLabel}>Description</label>
                      <textarea
                        rows={3}
                        placeholder="Write a captivating description of this Sri Lankan getaway..."
                        value={editingPkg.description || ""}
                        onChange={(e) => setEditingPkg({ ...editingPkg, description: e.target.value })}
                        style={styles.textarea}
                      />
                    </div>

                    {/* Highlights */}
                    <div style={styles.tagSection}>
                      <div style={styles.tagSectionHeader}>
                        <label style={styles.fieldLabel}>Package Highlights</label>
                        <span style={styles.tagCount}>{(editingPkg.highlights || []).length} items</span>
                      </div>
                      <div style={styles.tagBox}>
                        {(editingPkg.highlights || []).length > 0 ? (
                          (editingPkg.highlights || []).map((tag, idx) => (
                            <span key={idx} style={styles.tagChipBlue}>
                              {tag}
                              <button type="button" onClick={() => removeHighlight(idx)} style={styles.tagRemove}>
                                <X size={11} />
                              </button>
                            </span>
                          ))
                        ) : (
                          <span style={styles.tagEmpty}>No highlights added yet</span>
                        )}
                      </div>
                      <div style={styles.tagInputRow}>
                        <input
                          type="text"
                          placeholder="Add a highlight (e.g. Whale watching)"
                          value={newHighlight}
                          onChange={(e) => setNewHighlight(e.target.value)}
                          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addHighlight(); } }}
                          style={styles.tagInput}
                        />
                        <button type="button" onClick={addHighlight} style={styles.tagAddBtn}>Add</button>
                      </div>
                    </div>

                    {/* Inclusions */}
                    <div style={styles.tagSection}>
                      <div style={styles.tagSectionHeader}>
                        <label style={styles.fieldLabel}>What's Included</label>
                        <span style={styles.tagCount}>{(editingPkg.includes || []).length} items</span>
                      </div>
                      <div style={styles.tagBox}>
                        {(editingPkg.includes || []).length > 0 ? (
                          (editingPkg.includes || []).map((tag, idx) => (
                            <span key={idx} style={styles.tagChipIndigo}>
                              {tag}
                              <button type="button" onClick={() => removeInclusion(idx)} style={styles.tagRemove}>
                                <X size={11} />
                              </button>
                            </span>
                          ))
                        ) : (
                          <span style={styles.tagEmpty}>No inclusions specified yet</span>
                        )}
                      </div>
                      <div style={styles.tagInputRow}>
                        <input
                          type="text"
                          placeholder="Add an inclusion (e.g. Hotel 3 Star)"
                          value={newInclusion}
                          onChange={(e) => setNewInclusion(e.target.value)}
                          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addInclusion(); } }}
                          style={styles.tagInput}
                        />
                        <button type="button" onClick={addInclusion} style={{ ...styles.tagAddBtn, background: "#6366f1" }}>Add</button>
                      </div>
                    </div>
                  </div>

                  {/* Save Footer */}
                  <div style={styles.editorFooter}>
                    <button type="submit" style={styles.saveBtn}>
                      <Save size={15} />
                      <span>Save Package</span>
                    </button>
                  </div>
                </form>
              ) : (
                <div style={styles.emptyState}>
                  <div style={styles.emptyIcon}>
                    <Package size={32} color="#94a3b8" />
                  </div>
                  <h3 style={styles.emptyTitle}>No Package Selected</h3>
                  <p style={styles.emptyDesc}>Choose a package from the list or create a new one</p>
                  <button onClick={handleInitNewPackage} style={styles.emptyAction}>
                    <Plus size={14} />
                    <span>Create New Package</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════
            TAB 2 — NLP INTENTS
        ═══════════════════════════════════════════ */}
        {activeTab === "intents" && (
          <div style={styles.splitLayout}>

            {/* LEFT: Intents List */}
            <div style={styles.listPane}>
              <div style={styles.listPaneHeader}>
                <div style={styles.listPaneTitle}>
                  <Tag size={16} style={{ color: "#6366f1" }} />
                  <span>Intents</span>
                  <span style={styles.listCount}>{intents.length}</span>
                </div>
              </div>

              <div style={styles.listScroll}>
                {intents.map((intent) => {
                  const isSelected = selectedIntentName === intent.name;
                  return (
                    <div
                      key={intent.name}
                      onClick={() => handleSelectIntent(intent)}
                      style={{
                        ...styles.listItem,
                        ...(isSelected ? { ...styles.listItemActive, borderColor: "rgba(99,102,241,0.4)", background: "rgba(99,102,241,0.06)" } : {}),
                      }}
                    >
                      <div style={{ ...styles.listItemEmoji, fontSize: 12, background: "rgba(99,102,241,0.1)", color: "#6366f1", borderRadius: 8, width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, letterSpacing: 0 }}>
                        {intent.name.charAt(0).toUpperCase()}
                      </div>
                      <div style={styles.listItemBody}>
                        <div style={{ ...styles.listItemName, textTransform: "capitalize" }}>{intent.name.replace(/_/g, " ")}</div>
                        <div style={styles.listItemMeta}>{intent.patterns.length} training patterns</div>
                      </div>
                      <ChevronRight
                        size={14}
                        style={{
                          color: isSelected ? "#6366f1" : "#94a3b8",
                          transform: isSelected ? "translateX(2px)" : "none",
                          transition: "all 0.2s",
                          flexShrink: 0,
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* RIGHT: Intent Editor */}
            <div style={styles.editorPane}>
              {editingIntent ? (
                <form onSubmit={handleSaveIntent} style={styles.editorForm}>
                  {/* Header */}
                  <div style={styles.editorHeader}>
                    <div>
                      <div style={{ ...styles.editorLabel, color: "#6366f1" }}>NLP Classification Dataset</div>
                      <div style={styles.editorTitle}>{editingIntent.name.replace(/_/g, " ")}</div>
                    </div>
                    <div style={styles.warningBadge}>
                      <AlertTriangle size={11} />
                      <span>Retrain required after saving</span>
                    </div>
                  </div>

                  <div style={styles.editorBody}>
                    {/* Training Patterns */}
                    <div style={styles.tagSection}>
                      <div style={styles.tagSectionHeader}>
                        <label style={styles.fieldLabel}>User Training Queries</label>
                        <span style={styles.tagCount}>{editingIntent.patterns.length} samples</span>
                      </div>
                      <div style={{ ...styles.tagBox, minHeight: 100, maxHeight: 220, overflowY: "auto" }}>
                        {editingIntent.patterns.length > 0 ? (
                          editingIntent.patterns.map((tag, idx) => (
                            <span key={idx} style={styles.tagChipBlue}>
                              "{tag}"
                              <button type="button" onClick={() => removePattern(idx)} style={styles.tagRemove}>
                                <X size={11} />
                              </button>
                            </span>
                          ))
                        ) : (
                          <span style={{ ...styles.tagEmpty, color: "#f97316" }}>
                            ⚠️ No training patterns — model cannot predict this intent!
                          </span>
                        )}
                      </div>
                      <div style={styles.tagInputRow}>
                        <input
                          type="text"
                          placeholder="Type a query phrase (e.g. how much is it)"
                          value={newPattern}
                          onChange={(e) => setNewPattern(e.target.value)}
                          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addPattern(); } }}
                          style={styles.tagInput}
                        />
                        <button type="button" onClick={addPattern} style={styles.tagAddBtn}>Add Query</button>
                      </div>
                    </div>

                    {/* Response Templates */}
                    <div style={styles.tagSection}>
                      <label style={{ ...styles.fieldLabel, marginBottom: 12 }}>Response Templates</label>
                      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        {editingIntent.responses.map((resp, idx) => (
                          <div key={idx} style={styles.responseCard}>
                            <span style={styles.responseIndex}>#{idx + 1}</span>
                            <p style={styles.responseText}>{resp}</p>
                            <button
                              type="button"
                              onClick={() => removeResponse(idx)}
                              style={styles.responseDelete}
                              title="Delete"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        ))}
                      </div>
                      <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
                        <textarea
                          rows={2}
                          placeholder="Type a new response template..."
                          value={newResponse}
                          onChange={(e) => setNewResponse(e.target.value)}
                          style={styles.textarea}
                        />
                        <div style={{ display: "flex", justifyContent: "flex-end" }}>
                          <button
                            type="button"
                            onClick={addResponse}
                            style={{ ...styles.tagAddBtn, background: "#6366f1", padding: "9px 20px" }}
                          >
                            Add Response
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div style={styles.editorFooter}>
                    <button type="submit" style={{ ...styles.saveBtn, background: "linear-gradient(135deg, #6366f1, #4f46e5)" }}>
                      <Save size={15} />
                      <span>Save Dataset</span>
                    </button>
                  </div>
                </form>
              ) : (
                <div style={styles.emptyState}>
                  <div style={styles.emptyIcon}>
                    <Tag size={32} color="#94a3b8" />
                  </div>
                  <h3 style={styles.emptyTitle}>No Intent Selected</h3>
                  <p style={styles.emptyDesc}>Choose an intent from the list to edit its training patterns and responses</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════
            TAB 3 — MODEL & METRICS
        ═══════════════════════════════════════════ */}
        {activeTab === "model" && (
          <div style={styles.modelTab}>

            {/* Retrain Card */}
            <div style={styles.retrainCard}>
              <div style={styles.retrainLeft}>
                <div style={styles.retrainIconWrap}>
                  <Cpu size={28} color="white" />
                </div>
                <div>
                  <h2 style={styles.retrainTitle}>NLP Classifier Retraining</h2>
                  <p style={styles.retrainDesc}>
                    Fits Logistic Regression and Naive Bayes on your MongoDB dataset using stratified 80:20 validation.
                    Automatically deploys the best-performing model in real-time.
                  </p>
                </div>
              </div>
              <button
                onClick={handleRetrain}
                disabled={retraining}
                style={{
                  ...styles.retrainBtn,
                  opacity: retraining ? 0.7 : 1,
                }}
              >
                <RefreshCw size={16} style={retraining ? { animation: "spin 1s linear infinite" } : {}} />
                <span>{retraining ? "Training..." : "Retrain Model"}</span>
              </button>
            </div>

            {/* Stats Grid */}
            <div style={styles.statsGrid}>
              <StatCard
                icon={<Zap size={20} color="#6366f1" />}
                iconBg="rgba(99,102,241,0.1)"
                label="Active Classifier"
                value={modelInfo?.algorithm || "—"}
                sub="Optimal fit winner"
                subColor="#6366f1"
              />
              <StatCard
                icon={<Activity size={20} color="#0ea5e9" />}
                iconBg="rgba(14,165,233,0.1)"
                label="Weighted Accuracy"
                value={modelMetrics?.overall_performance?.accuracy
                  ? `${(modelMetrics.overall_performance.accuracy * 100).toFixed(2)}%`
                  : "—"}
                sub="Stratified test verified"
                subColor="#22c55e"
              />
              <StatCard
                icon={<Database size={20} color="#f59e0b" />}
                iconBg="rgba(245,158,11,0.1)"
                label="Training Dataset"
                value={`${modelInfo?.dataset_size || "—"}`}
                sub="Synthesized phrases"
                subColor="#94a3b8"
              />
              <StatCard
                icon={<Clock size={20} color="#94a3b8" />}
                iconBg="rgba(148,163,184,0.1)"
                label="Last Deployed"
                value={modelInfo?.last_trained
                  ? new Date(modelInfo.last_trained).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                  : "—"}
                sub={modelInfo?.last_trained
                  ? new Date(modelInfo.last_trained).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
                  : "No stamp available"}
                subColor="#94a3b8"
              />
            </div>

            {/* Classifier Comparison */}
            {modelMetrics?.model_comparison && (
              <div style={styles.metricsCard}>
                <div style={styles.metricsCardHeader}>
                  <div style={styles.metricsCardHeaderLeft}>
                    <BarChart3 size={18} color="#0ea5e9" />
                    <h3 style={styles.metricsCardTitle}>Classifier Benchmarks</h3>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 20, padding: "4px 0" }}>
                  {Object.entries(modelMetrics.model_comparison).map(([name, stats]) => {
                    const accuracyPercent = stats.accuracy * 100;
                    const f1Percent = stats.f1_score * 100;
                    const isWinner = modelInfo?.algorithm === name;
                    return (
                      <div key={name} style={{
                        ...styles.benchmarkRow,
                        ...(isWinner ? styles.benchmarkRowWinner : {}),
                      }}>
                        <div style={styles.benchmarkTop}>
                          <div style={styles.benchmarkNameRow}>
                            <span style={styles.benchmarkName}>{name}</span>
                            {isWinner && <span style={styles.winnerBadge}>🏆 Deployed</span>}
                            <span style={styles.benchmarkTime}>{stats.training_time_sec.toFixed(4)}s fit</span>
                          </div>
                          <div style={styles.benchmarkStats}>
                            <div style={styles.benchmarkStat}>
                              <span style={styles.benchmarkStatLabel}>Accuracy</span>
                              <span style={styles.benchmarkStatValue}>{accuracyPercent.toFixed(2)}%</span>
                            </div>
                            <div style={{ width: 1, background: "rgba(148,163,184,0.2)", margin: "0 8px" }} />
                            <div style={styles.benchmarkStat}>
                              <span style={styles.benchmarkStatLabel}>F1-Score</span>
                              <span style={{ ...styles.benchmarkStatValue, color: "#6366f1" }}>{f1Percent.toFixed(2)}%</span>
                            </div>
                          </div>
                        </div>
                        <div style={styles.progressWrap}>
                          <div style={styles.progressTrack}>
                            <div style={{
                              ...styles.progressBar,
                              width: `${f1Percent}%`,
                              background: isWinner
                                ? "linear-gradient(90deg, #0ea5e9, #6366f1)"
                                : "linear-gradient(90deg, #94a3b8, #64748b)",
                            }} />
                          </div>
                          <span style={styles.progressLabel}>{f1Percent.toFixed(1)}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Intent Breakdown */}
            {modelMetrics?.intent_breakdown && (
              <div style={styles.metricsCard}>
                <div style={styles.metricsCardHeader}>
                  <div style={styles.metricsCardHeaderLeft}>
                    <Layers size={18} color="#6366f1" />
                    <h3 style={styles.metricsCardTitle}>Per-Intent Validation</h3>
                  </div>
                  <span style={styles.metricsCardSub}>{Object.keys(modelMetrics.intent_breakdown).length} classes</span>
                </div>
                <div style={styles.intentGrid}>
                  {Object.entries(modelMetrics.intent_breakdown).map(([intent, metrics]) => {
                    const f1Score = metrics.f1_score * 100;
                    const color = f1Score >= 90 ? "#22c55e" : f1Score >= 70 ? "#f59e0b" : "#ef4444";
                    return (
                      <div key={intent} style={styles.intentCard}>
                        <div style={styles.intentCardTop}>
                          <span style={styles.intentName}>{intent}</span>
                          <span style={{ ...styles.intentSupport }}>N={metrics.support}</span>
                        </div>
                        <div style={styles.intentMetrics}>
                          <div style={styles.intentMetric}>
                            <span style={styles.intentMetricLabel}>Precision</span>
                            <span style={styles.intentMetricValue}>{(metrics.precision * 100).toFixed(1)}%</span>
                          </div>
                          <div style={styles.intentMetric}>
                            <span style={styles.intentMetricLabel}>Recall</span>
                            <span style={styles.intentMetricValue}>{(metrics.recall * 100).toFixed(1)}%</span>
                          </div>
                        </div>
                        <div style={{ marginTop: 12 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                            <span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600 }}>F1-Score</span>
                            <span style={{ fontSize: 12, fontWeight: 800, color }}>{f1Score.toFixed(1)}%</span>
                          </div>
                          <div style={styles.intentProgressTrack}>
                            <div style={{
                              height: "100%",
                              borderRadius: 4,
                              width: `${f1Score}%`,
                              background: color,
                              transition: "width 0.6s ease",
                            }} />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          </div>
        )}
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        * { box-sizing: border-box; }
        input:focus, textarea:focus, select:focus { outline: none; border-color: #0ea5e9!important; box-shadow: 0 0 0 3px rgba(14,165,233,0.12)!important; }
        input::placeholder, textarea::placeholder { color: #94a3b8; }
        textarea { resize: vertical; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(148,163,184,0.3); border-radius: 4px; }
      `}</style>
    </div>
  );
}

/* ─── STAT CARD COMPONENT ─── */
function StatCard({
  icon, iconBg, label, value, sub, subColor,
}: {
  icon: React.ReactNode;
  iconBg: string;
  label: string;
  value: string;
  sub: string;
  subColor: string;
}) {
  return (
    <div style={styles.statCard}>
      <div style={{ ...styles.statIcon, background: iconBg }}>{icon}</div>
      <p style={styles.statLabel}>{label}</p>
      <p style={styles.statValue}>{value}</p>
      <p style={{ ...styles.statSub, color: subColor }}>{sub}</p>
    </div>
  );
}

/* ─── STYLES ─── */
const styles: Record<string, React.CSSProperties> = {
  root: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    position: "relative",
    zIndex: 10,
    background: "transparent",
  },

  // ── Header ──
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "32px 40px 24px",
    gap: 16,
    flexShrink: 0,
  },
  headerLeft: {
    display: "flex",
    alignItems: "center",
    gap: 16,
  },
  headerIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    background: "linear-gradient(135deg, #0ea5e9, #6366f1)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 4px 16px rgba(14,165,233,0.35)",
    flexShrink: 0,
  },
  headerTitle: {
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontSize: 26,
    fontWeight: 800,
    color: "var(--text)",
    lineHeight: 1.2,
    margin: 0,
  },
  headerSub: {
    fontSize: 13,
    color: "var(--text-muted)",
    marginTop: 3,
    margin: 0,
  },
  headerRight: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    flexShrink: 0,
  },
  notif: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "10px 16px",
    borderRadius: 12,
    fontSize: 13,
    fontWeight: 600,
    border: "1px solid",
    maxWidth: 380,
    animation: "slideIn 0.3s ease",
  },
  notifText: {
    flex: 1,
    lineHeight: 1.4,
  },
  notifSuccess: {
    background: "rgba(34,197,94,0.08)",
    borderColor: "rgba(34,197,94,0.2)",
    color: "#16a34a",
  },
  notifError: {
    background: "rgba(239,68,68,0.08)",
    borderColor: "rgba(239,68,68,0.2)",
    color: "#dc2626",
  },
  refreshBtn: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "10px 18px",
    borderRadius: 12,
    border: "1px solid rgba(148,163,184,0.25)",
    background: "rgba(255,255,255,0.6)",
    backdropFilter: "blur(8px)",
    color: "var(--text-muted)",
    fontFamily: "inherit",
    cursor: "pointer",
    transition: "all 0.2s",
    fontSize: 13,
    fontWeight: 600,
  },

  // ── Tabs ──
  tabBar: {
    display: "flex",
    gap: 4,
    padding: "0 40px 0",
    borderBottom: "1px solid rgba(148,163,184,0.15)",
    flexShrink: 0,
    marginBottom: 0,
  },
  tabBtn: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "13px 20px",
    borderRadius: 0,
    border: "none",
    background: "transparent",
    color: "#94a3b8",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s",
    position: "relative",
    borderBottom: "2px solid transparent",
    marginBottom: -1,
    fontFamily: "inherit",
  },
  tabBtnActive: {
    color: "#0ea5e9",
    borderBottom: "2px solid #0ea5e9",
  },
  tabCount: {
    padding: "2px 8px",
    borderRadius: 20,
    fontSize: 11,
    fontWeight: 700,
    background: "rgba(148,163,184,0.15)",
    color: "#64748b",
  },
  tabCountActive: {
    background: "rgba(14,165,233,0.12)",
    color: "#0ea5e9",
  },

  // ── Content ──
  content: {
    flex: 1,
    overflow: "hidden",
    padding: "28px 40px 40px",
    display: "flex",
    flexDirection: "column",
  },

  // ── Split Layout ──
  splitLayout: {
    flex: 1,
    display: "grid",
    gridTemplateColumns: "320px 1fr",
    gap: 24,
    overflow: "hidden",
    minHeight: 0,
  },

  // ── List Pane ──
  listPane: {
    display: "flex",
    flexDirection: "column",
    background: "rgba(255,255,255,0.55)",
    backdropFilter: "blur(12px)",
    borderRadius: 20,
    border: "1px solid rgba(148,163,184,0.2)",
    overflow: "hidden",
    boxShadow: "0 2px 16px rgba(0,0,0,0.04)",
  },
  listPaneHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "20px 20px 16px",
    borderBottom: "1px solid rgba(148,163,184,0.12)",
    flexShrink: 0,
  },
  listPaneTitle: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontSize: 14,
    fontWeight: 700,
    color: "var(--text)",
  },
  listCount: {
    padding: "2px 8px",
    borderRadius: 20,
    fontSize: 11,
    fontWeight: 700,
    background: "rgba(148,163,184,0.12)",
    color: "#64748b",
  },
  addBtn: {
    display: "flex",
    alignItems: "center",
    gap: 5,
    padding: "7px 14px",
    borderRadius: 10,
    background: "#0ea5e9",
    color: "white",
    fontSize: 12,
    fontWeight: 700,
    cursor: "pointer",
    border: "none",
    fontFamily: "inherit",
    transition: "all 0.2s",
    boxShadow: "0 2px 8px rgba(14,165,233,0.3)",
  },
  listScroll: {
    flex: 1,
    overflowY: "auto",
    padding: "12px",
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },
  listItem: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "14px 14px",
    borderRadius: 14,
    border: "1px solid transparent",
    cursor: "pointer",
    transition: "all 0.18s",
    background: "transparent",
  },
  listItemActive: {
    background: "rgba(14,165,233,0.07)",
    borderColor: "rgba(14,165,233,0.3)",
  },
  listItemEmoji: {
    fontSize: 24,
    lineHeight: 1,
    flexShrink: 0,
  },
  listItemBody: {
    flex: 1,
    minWidth: 0,
  },
  listItemName: {
    fontSize: 13,
    fontWeight: 700,
    color: "var(--text)",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  listItemMeta: {
    fontSize: 10,
    fontWeight: 600,
    color: "#94a3b8",
    textTransform: "uppercase",
    letterSpacing: "0.6px",
    marginTop: 3,
  },

  // ── Editor Pane ──
  editorPane: {
    display: "flex",
    flexDirection: "column",
    background: "rgba(255,255,255,0.55)",
    backdropFilter: "blur(12px)",
    borderRadius: 20,
    border: "1px solid rgba(148,163,184,0.2)",
    overflow: "hidden",
    boxShadow: "0 2px 16px rgba(0,0,0,0.04)",
  },
  editorForm: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  editorHeader: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    padding: "24px 28px 20px",
    borderBottom: "1px solid rgba(148,163,184,0.12)",
    flexShrink: 0,
    gap: 12,
  },
  editorLabel: {
    fontSize: 11,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.8px",
    color: "#0ea5e9",
    marginBottom: 4,
  },
  editorTitle: {
    fontSize: 18,
    fontWeight: 800,
    color: "var(--text)",
    fontFamily: "'Plus Jakarta Sans', sans-serif",
  },
  deleteBtn: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "8px 14px",
    borderRadius: 10,
    border: "1px solid rgba(239,68,68,0.2)",
    background: "rgba(239,68,68,0.05)",
    color: "#ef4444",
    fontSize: 12,
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "inherit",
    transition: "all 0.2s",
    flexShrink: 0,
  },
  editorBody: {
    flex: 1,
    overflowY: "auto",
    padding: "24px 28px",
    display: "flex",
    flexDirection: "column",
    gap: 24,
  },
  editorFooter: {
    display: "flex",
    justifyContent: "flex-end",
    padding: "18px 28px",
    borderTop: "1px solid rgba(148,163,184,0.12)",
    flexShrink: 0,
    background: "rgba(255,255,255,0.4)",
  },
  saveBtn: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "12px 28px",
    borderRadius: 14,
    background: "linear-gradient(135deg, #0ea5e9, #0284c7)",
    color: "white",
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
    border: "none",
    fontFamily: "inherit",
    boxShadow: "0 4px 16px rgba(14,165,233,0.35)",
    transition: "all 0.2s",
  },

  // ── Form Fields ──
  formRow2: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 16,
  },
  formRow3: {
    display: "flex",
    gap: 16,
    alignItems: "flex-end",
  },
  formField: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    gap: 0,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.7px",
    color: "#94a3b8",
    marginBottom: 8,
    display: "block",
  },
  input: {
    width: "100%",
    padding: "11px 14px",
    borderRadius: 12,
    border: "1.5px solid rgba(148,163,184,0.25)",
    background: "rgba(255,255,255,0.7)",
    fontSize: 14,
    fontWeight: 600,
    color: "var(--text)",
    fontFamily: "inherit",
    transition: "all 0.2s",
    outline: "none",
  },
  inputDisabled: {
    background: "rgba(148,163,184,0.08)",
    color: "#94a3b8",
    cursor: "not-allowed",
  },
  select: {
    width: "100%",
    padding: "11px 14px",
    borderRadius: 12,
    border: "1.5px solid rgba(148,163,184,0.25)",
    background: "rgba(255,255,255,0.7)",
    fontSize: 14,
    fontWeight: 600,
    color: "var(--text)",
    fontFamily: "inherit",
    transition: "all 0.2s",
    outline: "none",
    cursor: "pointer",
    appearance: "auto",
  },
  textarea: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 12,
    border: "1.5px solid rgba(148,163,184,0.25)",
    background: "rgba(255,255,255,0.7)",
    fontSize: 14,
    fontWeight: 500,
    color: "var(--text)",
    fontFamily: "inherit",
    transition: "all 0.2s",
    outline: "none",
    lineHeight: 1.6,
  },

  // ── Tag Sections ──
  tagSection: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  tagSectionHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  tagCount: {
    fontSize: 11,
    fontWeight: 600,
    color: "#94a3b8",
  },
  tagBox: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
    padding: "14px",
    minHeight: 54,
    borderRadius: 12,
    border: "1.5px solid rgba(148,163,184,0.2)",
    background: "rgba(248,250,252,0.7)",
    alignContent: "flex-start",
  },
  tagChipBlue: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "5px 12px",
    borderRadius: 20,
    background: "rgba(14,165,233,0.1)",
    border: "1px solid rgba(14,165,233,0.25)",
    color: "#0284c7",
    fontSize: 12,
    fontWeight: 600,
  },
  tagChipIndigo: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "5px 12px",
    borderRadius: 20,
    background: "rgba(99,102,241,0.1)",
    border: "1px solid rgba(99,102,241,0.25)",
    color: "#4f46e5",
    fontSize: 12,
    fontWeight: 600,
  },
  tagRemove: {
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "inherit",
    padding: 0,
    display: "flex",
    alignItems: "center",
    opacity: 0.6,
    transition: "opacity 0.15s",
    fontFamily: "inherit",
  },
  tagEmpty: {
    fontSize: 12,
    color: "#94a3b8",
    fontStyle: "italic",
  },
  tagInputRow: {
    display: "flex",
    gap: 8,
  },
  tagInput: {
    flex: 1,
    padding: "10px 14px",
    borderRadius: 12,
    border: "1.5px solid rgba(148,163,184,0.25)",
    background: "rgba(255,255,255,0.7)",
    fontSize: 13,
    fontWeight: 500,
    color: "var(--text)",
    fontFamily: "inherit",
    outline: "none",
    transition: "all 0.2s",
  },
  tagAddBtn: {
    padding: "10px 18px",
    borderRadius: 12,
    background: "#0ea5e9",
    color: "white",
    fontSize: 13,
    fontWeight: 700,
    cursor: "pointer",
    border: "none",
    fontFamily: "inherit",
    flexShrink: 0,
    transition: "all 0.2s",
  },

  // ── Intent editor extras ──
  warningBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "7px 12px",
    borderRadius: 10,
    background: "rgba(245,158,11,0.08)",
    border: "1px solid rgba(245,158,11,0.2)",
    color: "#d97706",
    fontSize: 11,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    flexShrink: 0,
    whiteSpace: "nowrap",
  },
  responseCard: {
    display: "flex",
    alignItems: "flex-start",
    gap: 12,
    padding: "14px 16px",
    borderRadius: 12,
    border: "1.5px solid rgba(148,163,184,0.15)",
    background: "rgba(255,255,255,0.5)",
  },
  responseIndex: {
    fontSize: 11,
    fontWeight: 800,
    color: "#94a3b8",
    flexShrink: 0,
    marginTop: 2,
    fontFamily: "'Plus Jakarta Sans', monospace",
  },
  responseText: {
    flex: 1,
    fontSize: 13,
    fontWeight: 500,
    color: "var(--text)",
    lineHeight: 1.6,
    margin: 0,
  },
  responseDelete: {
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#94a3b8",
    padding: 4,
    display: "flex",
    alignItems: "center",
    transition: "color 0.15s",
    flexShrink: 0,
    fontFamily: "inherit",
  },

  // ── Empty State ──
  emptyState: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
    padding: 40,
    textAlign: "center",
  },
  emptyIcon: {
    width: 72,
    height: 72,
    borderRadius: 20,
    background: "rgba(148,163,184,0.1)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 800,
    color: "var(--text)",
    margin: 0,
    fontFamily: "'Plus Jakarta Sans', sans-serif",
  },
  emptyDesc: {
    fontSize: 13,
    color: "#94a3b8",
    maxWidth: 300,
    lineHeight: 1.6,
    margin: 0,
  },
  emptyAction: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "11px 22px",
    borderRadius: 12,
    background: "#0ea5e9",
    color: "white",
    fontSize: 13,
    fontWeight: 700,
    cursor: "pointer",
    border: "none",
    fontFamily: "inherit",
    marginTop: 6,
    boxShadow: "0 4px 14px rgba(14,165,233,0.3)",
  },

  // ── Model Tab ──
  modelTab: {
    flex: 1,
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: 24,
  },

  retrainCard: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 24,
    padding: "28px 32px",
    borderRadius: 20,
    background: "rgba(255,255,255,0.55)",
    backdropFilter: "blur(12px)",
    border: "1px solid rgba(148,163,184,0.2)",
    boxShadow: "0 2px 16px rgba(0,0,0,0.04)",
    flexShrink: 0,
  },
  retrainLeft: {
    display: "flex",
    alignItems: "flex-start",
    gap: 20,
    flex: 1,
  },
  retrainIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 16,
    background: "linear-gradient(135deg, #6366f1, #4f46e5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    boxShadow: "0 4px 16px rgba(99,102,241,0.35)",
  },
  retrainTitle: {
    fontSize: 17,
    fontWeight: 800,
    color: "var(--text)",
    margin: "0 0 6px",
    fontFamily: "'Plus Jakarta Sans', sans-serif",
  },
  retrainDesc: {
    fontSize: 13,
    color: "#64748b",
    lineHeight: 1.65,
    margin: 0,
    maxWidth: 560,
  },
  retrainBtn: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "14px 28px",
    borderRadius: 14,
    background: "linear-gradient(135deg, #0ea5e9, #6366f1)",
    color: "white",
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
    border: "none",
    fontFamily: "inherit",
    whiteSpace: "nowrap",
    boxShadow: "0 4px 20px rgba(14,165,233,0.35)",
    transition: "all 0.2s",
    letterSpacing: "0.3px",
    flexShrink: 0,
  },

  // Stats grid
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 16,
    flexShrink: 0,
  },
  statCard: {
    padding: "22px 22px",
    borderRadius: 18,
    background: "rgba(255,255,255,0.55)",
    backdropFilter: "blur(12px)",
    border: "1px solid rgba(148,163,184,0.2)",
    boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },
  statIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.7px",
    color: "#94a3b8",
    margin: 0,
  },
  statValue: {
    fontSize: 22,
    fontWeight: 900,
    color: "var(--text)",
    margin: 0,
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    lineHeight: 1.2,
    wordBreak: "break-word",
  },
  statSub: {
    fontSize: 12,
    fontWeight: 600,
    margin: 0,
  },

  // Metrics cards
  metricsCard: {
    padding: "24px 28px",
    borderRadius: 20,
    background: "rgba(255,255,255,0.55)",
    backdropFilter: "blur(12px)",
    border: "1px solid rgba(148,163,184,0.2)",
    boxShadow: "0 2px 16px rgba(0,0,0,0.04)",
    flexShrink: 0,
  },
  metricsCardHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 22,
    paddingBottom: 16,
    borderBottom: "1px solid rgba(148,163,184,0.12)",
  },
  metricsCardHeaderLeft: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  metricsCardTitle: {
    fontSize: 15,
    fontWeight: 800,
    color: "var(--text)",
    margin: 0,
    fontFamily: "'Plus Jakarta Sans', sans-serif",
  },
  metricsCardSub: {
    fontSize: 12,
    color: "#94a3b8",
    fontWeight: 600,
  },

  // Benchmark rows
  benchmarkRow: {
    padding: "18px 20px",
    borderRadius: 14,
    border: "1.5px solid rgba(148,163,184,0.15)",
    background: "rgba(248,250,252,0.5)",
  },
  benchmarkRowWinner: {
    border: "1.5px solid rgba(99,102,241,0.25)",
    background: "rgba(99,102,241,0.04)",
  },
  benchmarkTop: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
    gap: 12,
  },
  benchmarkNameRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  benchmarkName: {
    fontSize: 14,
    fontWeight: 800,
    color: "var(--text)",
    fontFamily: "'Plus Jakarta Sans', sans-serif",
  },
  winnerBadge: {
    padding: "3px 10px",
    borderRadius: 20,
    background: "rgba(99,102,241,0.12)",
    border: "1px solid rgba(99,102,241,0.25)",
    color: "#6366f1",
    fontSize: 11,
    fontWeight: 700,
  },
  benchmarkTime: {
    fontSize: 11,
    color: "#94a3b8",
    fontWeight: 600,
  },
  benchmarkStats: {
    display: "flex",
    alignItems: "center",
    gap: 4,
  },
  benchmarkStat: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "0 16px",
  },
  benchmarkStatLabel: {
    fontSize: 10,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.6px",
    color: "#94a3b8",
  },
  benchmarkStatValue: {
    fontSize: 16,
    fontWeight: 900,
    color: "var(--text)",
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    marginTop: 2,
  },
  progressWrap: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  progressTrack: {
    flex: 1,
    height: 8,
    borderRadius: 8,
    background: "rgba(148,163,184,0.15)",
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    borderRadius: 8,
    transition: "width 0.6s ease",
  },
  progressLabel: {
    fontSize: 12,
    fontWeight: 700,
    color: "#64748b",
    width: 44,
    textAlign: "right",
    flexShrink: 0,
  },

  // Intent grid
  intentGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
    gap: 14,
  },
  intentCard: {
    padding: "18px 18px",
    borderRadius: 14,
    border: "1.5px solid rgba(148,163,184,0.15)",
    background: "rgba(248,250,252,0.6)",
  },
  intentCardTop: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
    gap: 8,
  },
  intentName: {
    fontSize: 12,
    fontWeight: 800,
    color: "var(--text)",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    flex: 1,
  },
  intentSupport: {
    padding: "2px 8px",
    borderRadius: 20,
    background: "rgba(148,163,184,0.12)",
    color: "#64748b",
    fontSize: 10,
    fontWeight: 700,
    flexShrink: 0,
  },
  intentMetrics: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 8,
    padding: "10px 0",
    borderTop: "1px solid rgba(148,163,184,0.12)",
    borderBottom: "1px solid rgba(148,163,184,0.12)",
    marginBottom: 2,
  },
  intentMetric: {
    display: "flex",
    flexDirection: "column",
    gap: 3,
  },
  intentMetricLabel: {
    fontSize: 10,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.6px",
    color: "#94a3b8",
  },
  intentMetricValue: {
    fontSize: 14,
    fontWeight: 800,
    color: "var(--text)",
    fontFamily: "'Plus Jakarta Sans', sans-serif",
  },
  intentProgressTrack: {
    width: "100%",
    height: 5,
    borderRadius: 4,
    background: "rgba(148,163,184,0.15)",
    overflow: "hidden",
  },
};
