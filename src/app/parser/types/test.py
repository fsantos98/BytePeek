import tkinter as tk
from datetime import datetime

# Stats to track
stats = {
    "Speed": 0,
    "Stamina": 0,
    "Power": 0,
    "Guts": 0,
    "Wit": 0
}

def log_message(msg):
    timestamp = datetime.now().strftime("%H:%M:%S")
    log_panel.config(state="normal")
    log_panel.insert(tk.END, f"[{timestamp}] {msg}\n")
    log_panel.see(tk.END)
    log_panel.config(state="disabled")

def update_stat(stat, delta):
    """Update the stat by delta and refresh the label."""
    old = stats[stat]
    stats[stat] = max(0, stats[stat] + delta)
    labels[stat]["text"] = f"{stats[stat]}"
    log_message(f"{stat}: {old} -> {stats[stat]} ({'+' if delta > 0 else ''}{delta})")

# Setup GUI
root = tk.Tk()
root.title("Stat Evolution Tracker")

main_frame = tk.Frame(root)
main_frame.pack(side=tk.LEFT, padx=10, pady=10)

labels = {}

for i, stat in enumerate(stats.keys()):
    tk.Label(main_frame, text=stat, font=('Arial', 12, 'bold')).grid(row=i, column=0, padx=10, pady=5)
    labels[stat] = tk.Label(main_frame, text=f"{stats[stat]}", font=('Arial', 12))
    labels[stat].grid(row=i, column=1)
    tk.Button(main_frame, text="+1", width=5, command=lambda s=stat: update_stat(s, 1)).grid(row=i, column=2)
    tk.Button(main_frame, text="-1", width=5, command=lambda s=stat: update_stat(s, -1)).grid(row=i, column=3)

# Log panel on the right
log_panel = tk.Text(root, width=35, height=15, state="disabled", font=('Consolas', 10))
log_panel.pack(side=tk.RIGHT, padx=10, pady=10, fill=tk.Y)

root.mainloop()
