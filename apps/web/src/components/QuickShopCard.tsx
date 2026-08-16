"use client";

import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingBag, ArrowRight } from "lucide-react";
import Link from "next/link";

interface Product {
  id: string;
  slug: string | null;
  title: string;
  description: string | null;
  priceInr: number;
  imageUrl: string | null;
}

interface QuickShopCardProps {
  product: Product;
  onAddToCart: (id: string) => void;
}

const QuickShopCard: React.FC<QuickShopCardProps> = ({ product, onAddToCart }) => {
  return (
    <Card className="border-none shadow-xl bg-gradient-to-br from-[#0F5B56] to-[#0D4D49] text-white overflow-hidden group">
      <CardContent className="p-8 space-y-6">
        <div className="flex justify-between items-start">
          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
            <ShoppingBag className="w-6 h-6 text-emerald-400" />
          </div>
        </div>

        <div className="flex gap-6 items-center">
          <div className="w-24 h-24 rounded-2xl overflow-hidden bg-white/10 shrink-0 border border-white/10">
            {product.imageUrl ? (
              <img src={product.imageUrl} alt={product.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <ShoppingBag className="w-8 h-8 text-white/30" />
              </div>
            )}
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold leading-tight">{product.title}</h3>
            <p className="text-2xl font-black text-emerald-400">₹{product.priceInr}</p>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <Button
            onClick={() => onAddToCart(product.id)}
            className="w-full bg-white text-[#0F5B56] hover:bg-emerald-50 rounded-xl h-12 font-bold shadow-lg"
          >
            Add to Cart
          </Button>
          <Button asChild variant="ghost" className="w-full text-white/70 hover:text-white hover:bg-white/10 text-xs">
            <Link href="/dashboard/shop">
              Browse Shop <ArrowRight className="w-3 h-3 ml-2" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickShopCard;
