"use client";

export default function FormField({ label, required, icon: Icon, note, children }) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-foreground">
        {label} {required && <span className="text-danger">*</span>}
      </label>

      <div className="relative">
        {Icon && (
          <div className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-default-400">
            <Icon size={18} />
          </div>
        )}
        {children}
      </div>

      {note && <p className="text-xs text-default-400">{note}</p>}
    </div>
  );
}