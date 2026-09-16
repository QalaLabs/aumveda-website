"use client";

import React, { useState } from 'react';
import {
  Download,
  Trash2,
  AlertTriangle,
  Loader2,
  ShieldAlert
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { showSuccess, showError } from "@/utils/toast";

const DataManagement = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const res = await fetch('/api/user/export');
      const data = await res.json();
      if (res.ok) {
        showSuccess(data.message);
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      showError("Failed to start export job");
    } finally {
      setIsExporting(false);
    }
  };

  const handleDelete = async () => {
    if (deleteConfirm !== 'confirm-delete') {
      showError("Please type the confirmation phrase correctly");
      return;
    }

    setIsDeleting(true);
    try {
      const res = await fetch('/api/user/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: deleteConfirm })
      });
      const data = await res.json();
      if (res.ok) {
        showSuccess(data.message);
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      showError("Failed to delete account");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 mb-2">
        <ShieldAlert className="w-5 h-5 text-slate-400" />
        <h3 className="font-bold text-slate-900">Data Management</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm space-y-4">
          <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center">
            <Download className="w-5 h-5 text-night" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900">Export My Data</h4>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Download a copy of all your wellness data, journal entries, and purchase history in JSON format.
            </p>
          </div>
          <Button
            onClick={handleExport}
            disabled={isExporting}
            variant="outline"
            className="w-full rounded-xl h-11 font-bold border-slate-200 hover:bg-gold/10 hover:text-night hover:border-gold/20"
          >
            {isExporting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Download className="w-4 h-4 mr-2" />}
            Request Export
          </Button>
        </div>

        <div className="p-6 rounded-2xl bg-rose-50/30 border border-rose-100 shadow-sm space-y-4">
          <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center">
            <Trash2 className="w-5 h-5 text-rose-500" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900">Delete My Account</h4>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Permanently remove your account and all associated data. This action cannot be undone.
            </p>
          </div>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                className="w-full rounded-xl h-11 font-bold border-rose-200 text-rose-600 hover:bg-rose-50 hover:border-rose-300"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Account
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="rounded-[32px] border-none shadow-2xl">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                  <AlertTriangle className="w-6 h-6 text-rose-500" />
                  Are you absolutely sure?
                </AlertDialogTitle>
                <AlertDialogDescription className="text-slate-500 leading-relaxed pt-2">
                  This action will permanently delete your profile, journal entries, and progress history.
                  Your active subscriptions will be cancelled immediately.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <div className="py-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="confirm" className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Type <span className="text-rose-500 font-black">confirm-delete</span> to proceed
                  </Label>
                  <Input
                    id="confirm"
                    value={deleteConfirm}
                    onChange={(e) => setDeleteConfirm(e.target.value)}
                    placeholder="confirm-delete"
                    className="rounded-xl border-slate-200 focus:ring-rose-500"
                  />
                </div>
              </div>

              <AlertDialogFooter className="gap-3">
                <AlertDialogCancel className="rounded-xl h-12 font-bold border-slate-200">Cancel</AlertDialogCancel>
                <Button
                  onClick={handleDelete}
                  disabled={deleteConfirm !== 'confirm-delete' || isDeleting}
                  className="bg-rose-600 hover:bg-rose-700 text-white rounded-xl h-12 font-bold px-8"
                >
                  {isDeleting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Trash2 className="w-4 h-4 mr-2" />}
                  Permanently Delete
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
};

export default DataManagement;
