"use client";

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy, Check, Code, Database } from "lucide-react";
import { showSuccess } from "@/utils/toast";

interface ActivityDetailModalProps {
  event: any | null;
  isOpen: boolean;
  onClose: () => void;
}

const ActivityDetailModal: React.FC<ActivityDetailModalProps> = ({ event, isOpen, onClose }) => {
  const [copied, setCopied] = React.useState(false);

  if (!event) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(event, null, 2));
    setCopied(true);
    showSuccess("Event JSON copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] rounded-[32px] border-none shadow-2xl p-0 overflow-hidden">
        <DialogHeader className="p-8 bg-slate-50 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center">
              <Database className="w-5 h-5 text-slate-400" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-slate-900">Event Payload</DialogTitle>
              <p className="text-xs text-slate-500 font-mono mt-0.5">{event.id}</p>
            </div>
          </div>
        </DialogHeader>

        <div className="p-8">
          <div className="bg-slate-900 rounded-2xl p-6 overflow-hidden relative group">
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                size="sm"
                variant="secondary"
                className="h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white border-none"
                onClick={handleCopy}
              >
                {copied ? <Check className="w-3 h-3 mr-2" /> : <Copy className="w-3 h-3 mr-2" />}
                {copied ? "Copied" : "Copy JSON"}
              </Button>
            </div>
            <pre className="text-[11px] font-mono text-gold-soft overflow-x-auto max-h-[400px] scrollbar-hide">
              {JSON.stringify(event, null, 2)}
            </pre>
          </div>

          <div className="mt-6 p-4 bg-gold/10 rounded-xl border border-gold/20 flex gap-3">
            <Code className="w-4 h-4 text-night shrink-0 mt-0.5" />
            <p className="text-[10px] text-night leading-relaxed">
              This is an immutable record of the system event. Use this data for auditing or debugging purposes.
              PII is redacted based on your current privacy settings.
            </p>
          </div>
        </div>

        <DialogFooter className="p-8 bg-slate-50 border-t border-slate-100">
          <Button onClick={onClose} className="w-full bg-slate-900 hover:bg-black rounded-xl h-12 font-bold">
            Close Inspector
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ActivityDetailModal;
