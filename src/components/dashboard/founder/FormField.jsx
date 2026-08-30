"use client";

export default function FormField({ label, required, icon: Icon, note, children }) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-slate-800 dark:text-slate-200">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>

      <div className="relative">
        {Icon && (
          <div className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">
            <Icon size={18} />
          </div>
        )}
        {children}
      </div>

      {note && <p className="text-xs text-slate-500 dark:text-slate-400">{note}</p>}
    </div>
  );
}