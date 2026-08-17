"use client";

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Package, Truck, CreditCard, MapPin, Download, RefreshCw, PlayCircle, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  image: string;
  type: 'PHYSICAL' | 'COURSE' | 'SESSION' | 'MICRO_LEARNING';
  accessUrl?: string;
  meetingUrl?: string;
  accessToken?: string;
}

interface Order {
  id: string;
  createdAt: string;
  total: number;
  status: string;
  shippingAddress: string;
  paymentMethod: string;
  items: OrderItem[];
  trackingNumber?: string;
  estimatedDelivery?: string;
}

interface OrderDetailModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onReorder: (id: string) => void;
  onDownloadInvoice: (id: string) => void;
}

const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  order,
  isOpen,
  onClose,
  onReorder,
  onDownloadInvoice
}) => {
  if (!order) return null;

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'PAID': return "bg-[#0F5B56]/10 text-[#0F5B56] border-[#0F5B56]/20";
      case 'PENDING': return "bg-[#C79A3B]/10 text-[#C79A3B] border-[#C79A3B]/20";
      case 'REFUNDED': return "bg-rose-50 text-rose-600 border-rose-100";
      default: return "bg-slate-100 text-slate-600";
    }
  };

  const hasPhysicalItems = order.items.some(item => item.type === 'PHYSICAL');

  const renderAccessButton = (item: OrderItem) => {
    if (order.status !== 'PAID') return null;
    switch (item.type) {
      case 'COURSE':
      case 'MICRO_LEARNING':
        return (
          <Button asChild size="sm" className="bg-blue-600 hover:bg-blue-700 rounded-lg h-8 px-3 text-[10px] font-bold uppercase tracking-wider">
            <Link href={item.accessUrl || '#'}>
              <PlayCircle className="w-3 h-3 mr-1.5" />
              Access Content
            </Link>
          </Button>
        );
      case 'SESSION':
        return (
          <Button asChild size="sm" className="bg-emerald-600 hover:bg-emerald-700 rounded-lg h-8 px-3 text-[10px] font-bold uppercase tracking-wider">
            <a href={item.meetingUrl} target="_blank" rel="noopener noreferrer">
              <Video className="w-3 h-3 mr-1.5" />
              Join Session
            </a>
          </Button>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] rounded-[32px] border-none shadow-2xl p-0 overflow-hidden">
        <DialogHeader className="p-8 bg-slate-50 border-b border-slate-100">
          <div className="flex justify-between items-start">
            <div>
              <DialogTitle className="text-2xl font-bold text-slate-900">Order Details</DialogTitle>
              <p className="text-sm text-slate-500 mt-1">#{order.id} • {format(new Date(order.createdAt), 'MMM dd, yyyy')}</p>
            </div>
            <Badge className={getStatusStyles(order.status)}>
              {order.status}
            </Badge>
          </div>
        </DialogHeader>

        <div className="p-8 space-y-8 max-h-[60vh] overflow-y-auto">
          {hasPhysicalItems && order.trackingNumber && (
            <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100 space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-bold text-blue-900 flex items-center gap-2">
                  <Truck className="w-4 h-4" /> Shipment Tracking
                </h4>
                {order.estimatedDelivery && (
                  <Badge className="bg-blue-600 text-white border-none text-[9px]">In Transit</Badge>
                )}
              </div>
              <div className="flex items-center gap-4">
                <div className="flex-1 space-y-1">
                  <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Tracking Number</p>
                  <p className="text-sm font-mono font-bold text-blue-900">{order.trackingNumber}</p>
                </div>
                {order.estimatedDelivery && (
                  <div className="flex-1 space-y-1 text-right">
                    <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Est. Delivery</p>
                    <p className="text-sm font-bold text-blue-900">{order.estimatedDelivery}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="space-y-4">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <Package className="w-3 h-3" /> Items Ordered
            </h4>
            <div className="space-y-6">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-xl bg-slate-100 overflow-hidden shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <h5 className="font-bold text-slate-900 text-sm truncate">{item.name}</h5>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{item.type}</p>
                      </div>
                      <p className="font-bold text-slate-900">${(item.quantity * item.price).toFixed(2)}</p>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <p className="text-xs text-slate-500">Qty: {item.quantity} • ${item.price} each</p>
                      {renderAccessButton(item)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator className="bg-slate-100" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <MapPin className="w-3 h-3" /> Delivery Method
              </h4>
              <p className="text-sm text-slate-600 leading-relaxed">{order.shippingAddress}</p>
            </div>
            <div className="space-y-3">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <CreditCard className="w-3 h-3" /> Payment Method
              </h4>
              <p className="text-sm text-slate-600">{order.paymentMethod}</p>
            </div>
          </div>

          <Separator className="bg-slate-100" />

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Subtotal</span>
              <span className="text-slate-900 font-medium">${order.total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Tax / Fees</span>
              <span className="text-slate-900 font-medium">$0.00</span>
            </div>
            <div className="flex justify-between text-lg font-black pt-2">
              <span className="text-slate-900">Total</span>
              <span className="text-[#0F5B56]">${order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="p-8 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
          <Button onClick={() => onDownloadInvoice(order.id)} variant="outline" className="flex-1 rounded-xl h-12 font-bold border-slate-200">
            <Download className="w-4 h-4 mr-2" />
            Invoice
          </Button>
          <Button onClick={() => onReorder(order.id)} className="flex-1 bg-slate-900 hover:bg-black rounded-xl h-12 font-bold">
            <RefreshCw className="w-4 h-4 mr-2" />
            Reorder Items
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailModal;
