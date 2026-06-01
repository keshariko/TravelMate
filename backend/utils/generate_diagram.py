import os
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import matplotlib.patches as patches

def draw_system_architecture():
    print("==================================================")
    print("PHASE 17 - GENERATING SYSTEM ARCHITECTURE DIAGRAM")
    print("==================================================")
    
    backend_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    reports_dir = os.path.join(backend_root, "reports")
    os.makedirs(reports_dir, exist_ok=True)
    
    # Create figure and axis
    fig, ax = plt.subplots(figsize=(12, 7), dpi=300)
    
    # Hide axis lines and ticks
    ax.axis('off')
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 100)
    
    # Background styling (Clean soft gridless canvas)
    fig.patch.set_facecolor('#f8fafc') # Tailwind slate-50
    ax.set_facecolor('#f8fafc')
    
    # Define box details
    # List of (x, y, width, height, text, color_gradient_primary)
    boxes = [
        # Frontend Layer
        {"x": 5, "y": 70, "w": 22, "h": 15, "title": "User Interface", "lines": ["React Chat Interface", "Browser UI Window"], "color": "#4f46e5"}, # Indigo
        {"x": 38, "y": 70, "w": 24, "h": 15, "title": "React Frontend", "lines": ["inferenceEngine.ts", "FastAPI Fetch Controller"], "color": "#7c3aed"}, # Violet
        
        # API Layer
        {"x": 73, "y": 70, "w": 22, "h": 15, "title": "FastAPI Web Server", "lines": ["main.py (REST Endpoints)", "CORS Middleware"], "color": "#059669"}, # Emerald
        
        # NLP & ML Core Layer
        {"x": 73, "y": 30, "w": 22, "h": 15, "title": "NLP Preprocessor", "lines": ["nlp_utils.py", "Porter Stemmer & Clean"], "color": "#ea580c"}, # Orange
        {"x": 38, "y": 30, "w": 24, "h": 15, "title": "Trained ML Model", "lines": ["Logistic Regression Classifier", "TF-IDF Vectorizer"], "color": "#db2777"}, # Pink
        
        # Database / DB Layer
        {"x": 5, "y": 30, "w": 22, "h": 15, "title": "Knowledge Base", "lines": ["knowledge_base.py (DB)", "Sri Lankan Tour Packages"], "color": "#2563eb"}, # Blue
    ]
    
    # Draw boxes
    for b in boxes:
        # Draw shadow
        shadow = patches.FancyBboxPatch(
            (b["x"]+0.6, b["y"]-0.6), b["w"], b["h"],
            boxstyle="round,pad=1.0",
            facecolor='#e2e8f0', edgecolor='none', alpha=0.5
        )
        ax.add_patch(shadow)
        
        # Draw box
        box = patches.FancyBboxPatch(
            (b["x"], b["y"]), b["w"], b["h"],
            boxstyle="round,pad=1.0",
            facecolor='white', edgecolor=b["color"], linewidth=2.5
        )
        ax.add_patch(box)
        
        # Box title header
        ax.text(
            b["x"] + b["w"]/2, b["y"] + b["h"] - 3, b["title"],
            ha="center", va="center", color=b["color"],
            fontweight="bold", fontsize=11
        )
        
        # Divider line
        ax.plot([b["x"]+1, b["x"]+b["w"]-1], [b["y"]+b["h"]-5, b["y"]+b["h"]-5], color='#cbd5e1', linewidth=1)
        
        # Box lines
        y_offset = b["y"] + b["h"] - 8.5
        for line in b["lines"]:
            ax.text(
                b["x"] + b["w"]/2, y_offset, line,
                ha="center", va="center", color='#475569',
                fontsize=8.5
            )
            y_offset -= 3.5
            
    # Draw connections (Arrows)
    arrow_props = dict(
        facecolor='#64748b', edgecolor='#64748b',
        arrowstyle="simple,head_length=0.7,head_width=0.7,tail_width=0.15",
        connectionstyle="arc3,rad=0"
    )
    
    # 1. User -> React Frontend (Query Send)
    ax.annotate("", xy=(37, 77.5), xytext=(28, 77.5), arrowprops=arrow_props)
    ax.text(32.5, 80, "User Query", ha="center", va="bottom", fontsize=8, color="#64748b", fontweight="semibold")
    
    # 2. React Frontend -> FastAPI (POST /api/chat)
    ax.annotate("", xy=(72, 77.5), xytext=(63, 77.5), arrowprops=arrow_props)
    ax.text(67.5, 80, "HTTP POST\n/api/chat", ha="center", va="bottom", fontsize=7.5, color="#64748b", fontweight="semibold")
    
    # 3. FastAPI -> NLP Preprocessor (Inference pipeline)
    ax.annotate("", xy=(84, 46), xytext=(84, 69), arrowprops=arrow_props)
    ax.text(85.5, 57.5, "Process Message", ha="left", va="center", fontsize=8, color="#64748b")
    
    # 4. NLP Preprocessor -> ML Model (Vectorize & Predict)
    ax.annotate("", xy=(63, 37.5), xytext=(72, 37.5), arrowprops=arrow_props)
    ax.text(67.5, 40, "Clean Tokens\n& TF-IDF", ha="center", va="bottom", fontsize=7.5, color="#64748b")
    
    # 5. ML Model -> Knowledge Base (Intent Mapping)
    ax.annotate("", xy=(28, 37.5), xytext=(37, 37.5), arrowprops=arrow_props)
    ax.text(32.5, 40, "Intent & Conf\nResolved", ha="center", va="bottom", fontsize=7.5, color="#64748b")
    
    # 6. Knowledge Base -> User (Direct Package render return flow)
    # Let's draw a nice dotted feedback loop arrow from Knowledge Base back to React Frontend UI
    ax.annotate(
        "", xy=(16, 69), xytext=(16, 46),
        arrowprops=dict(
            facecolor='#4f46e5', edgecolor='#4f46e5',
            arrowstyle="simple,head_length=0.7,head_width=0.7,tail_width=0.15",
            connectionstyle="arc3,rad=-0.1"
        )
    )
    ax.text(12, 57.5, "Recommend\nPackages & Text", ha="right", va="center", fontsize=8, color="#4f46e5", fontweight="bold")
    
    # Title at the top center of the canvas
    plt.text(50, 95, "TravelMate Chatbot - Intelligent System Architecture", ha="center", va="center", fontsize=15, color="#0f172a", fontweight="bold")
    plt.text(50, 91.5, "Modern REST Integration of Scikit-Learn Classifiers with React View Managers", ha="center", va="center", fontsize=10, color="#64748b", style="italic")
    
    # Save files
    svg_path = os.path.join(reports_dir, "system_architecture.svg")
    png_path = os.path.join(reports_dir, "system_architecture.png")
    
    plt.tight_layout()
    plt.savefig(svg_path, format="svg", bbox_inches="tight")
    plt.savefig(png_path, format="png", bbox_inches="tight", dpi=300)
    plt.close()
    
    print(f"Generated Phase 17 SVG Architecture Diagram: {svg_path}")
    print(f"Generated Phase 17 PNG Architecture Diagram: {png_path}")
    print("==================================================\n")

if __name__ == "__main__":
    draw_system_architecture()
