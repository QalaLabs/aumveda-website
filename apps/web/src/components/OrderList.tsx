"use client";

import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Eye,
  Download,
  RefreshCw,
  Package
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface Order {
  id: string;
  createdAt: string;
  total: number;
  status: string;
  items: any[];
}

interface OrderListProps {
  orders: Order[];
  onViewDetails: (order: Order) => void;
  onReorder: (id: string) => void;
  onDownloadInvoice: (id: string) => void;
}

const OrderList: React.FC<OrderListProps> = ({ orders, onViewDetails, onReorder, onDownloadInvoice }) => {
  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'PAID': return "bg-[#0F5B56]/10 text-[#0F5B56] border-[#0F5B56]/20";
      case 'PENDING': return "bg-[#C79A3B]/10 text-[#C79A3B] border-[#C79A3B]/20";
      case 'REFUNDED': return "bg-rose-50 text-rose-600 border-rose-100";
      default: return "bg-slate-100 text-slate-600";
    }
  };

  return (
    <div className="bg-white rounded-[32px] shadow-lg overflow-hidden border border-slate-100">
      <div className="p-8 border-b border-slate-100 flex justify-between items-center">
        <h3 className="text-xl font-bold text-slate-900">Order History</h3>
        <Badge variant="secondary" className="bg-slate-100 text-slate-500 border-none">
          {orders.length} Orders
        </Badge>
      </div>

      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
              <TableHead className="text-[10px] font-bold uppercase tracking-widest pl-8">Order ID</TableHead>
              <TableHead className="text-[10px] font-bold uppercase tracking-widest">Date</TableHead>
              <TableHead className="text-[10px] font-bold uppercase tracking-widest">Items</TableHead>
              <TableHead className="text-[10px] font-bold uppercase tracking-widest">Total</TableHead>
              <TableHead className="text-[10px] font-bold uppercase tracking-widest">Status</TableHead>
              <TableHead className="text-[10px] font-bold uppercase tracking-widest text-right pr-8">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id} className="group hover:bg-slate-50/30 transition-colors">
                <TableCell className="font-mono text-xs text-slate-500 pl-8">{order.id}</TableCell>
                <TableCell className="text-sm text-slate-600">
                  {format(new Date(order.createdAt), 'MMM dd, yyyy')}
                </TableCell>
                <TableCell className="text-sm text-slate-600">
                  {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                </TableCell>
                <TableCell className="font-bold text-slate-900">${order.total.toFixed(2)}</TableCell>
                <TableCell>
                  <Badge className={cn("border", getStatusStyles(order.status))}>
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right pr-8">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-slate-400 hover:text-night hover:bg-gold/10" onClick={() => onViewDetails(order)}>
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50" onClick={() => onDownloadInvoice(order.id)}>
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50" onClick={() => onReorder(order.id)}>
                      <RefreshCw className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="md:hidden divide-y divide-slate-100">
        {orders.map((order) => (
          <div key={order.id} className="p-6 space-y-4">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="font-mono text-[10px] text-slate-400 uppercase tracking-widest">#{order.id}</p>
                <h4 className="font-bold text-slate-900">{format(new Date(order.createdAt), 'MMM dd, yyyy')}</h4>
              </div>
              <Badge className={cn("border", getStatusStyles(order.status))}>
                {order.status}
              </Badge>
            </div>
            <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Package className="w-3.5 h-3.5" />
                {order.items.length} Items
              </div>
              <p className="font-black text-slate-900">${order.total.toFixed(2)}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1 rounded-xl h-10 text-xs font-bold border-slate-200" onClick={() => onViewDetails(order)}>
                <Eye className="w-3.5 h-3.5 mr-2" /> Details
              </Button>
              <Button variant="outline" className="flex-1 rounded-xl h-10 text-xs font-bold border-slate-200" onClick={() => onReorder(order.id)}>
                <RefreshCw className="w-3.5 h-3.5 mr-2" /> Reorder
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderList;
