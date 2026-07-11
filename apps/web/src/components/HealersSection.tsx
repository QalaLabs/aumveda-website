"use client";

import React from 'react';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { ArrowRight, Heart, Sparkles } from 'lucide-react';
import Link from 'next/link';

/**
 * When the real Sejal / Archana photographs land, drop them at:
 *   apps/web/public/practitioners/sejal-jain.jpg
 *   apps/web/public/practitioners/archana-jain.jpg
 * and swap the two `src` values below. Everything else — sizing, blur placeholder,
 * priority, layout — stays identical, so CLS stays at 0 through the swap.
 */
const SEJAL_IMAGE = 'https://images.unsplash.com/photo-1559839734-2b71f1536780?auto=format&fit=crop&q=80&w=1000';
const ARCHANA_IMAGE = 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=1000';

// 8x10 base64-encoded warm neutral — matches the section's editorial cream palette,
// gives an instant paint before the real image resolves.
const BLUR_DATA_URL =
  'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wgARCAAKAAoDASIAAhEBAxEB/8QAFwAAAwEAAAAAAAAAAAAAAAAAAgQFBv/EABQBAQAAAAAAAAAAAAAAAAAAAAP/2gAMAwEAAhADEAAAAcpixczEK//EABwQAAICAgMAAAAAAAAAAAAAAAECAwQFEQASIf/aAAgBAQABBQINTKz7c5nSHRDSKcMU+P/EABQRAQAAAAAAAAAAAAAAAAAAABD/2gAIAQMBAT8BP//EABQRAQAAAAAAAAAAAAAAAAAAABD/2gAIAQIBAT8BP//EAB4QAAECBwEAAAAAAAAAAAAAAAECAwAEERIhIjFB/9oACAEBAAY/AtvIojDeBOtSMt2ii5FCiw3wSJXvv+n/xAAdEAEAAgEFAQAAAAAAAAAAAAABABEhMUFRYXGB/9oACAEBAAE/IcuNjvIGxLpwyrpEXczTFywwcE6/BAWMPUvxAWFn8Wf/2gAMAwEAAgADAAAAENf/xAAUEQEAAAAAAAAAAAAAAAAAAAAQ/9oACAEDAQE/EDX/xAAUEQEAAAAAAAAAAAAAAAAAAAAQ/9oACAECAQE/EDX/xAAdEAEBAAIBBQAAAAAAAAAAAAABEQAhMUFhcYGh/9oACAEBAAE/EE/PAlV5AGoGngIPS8Yg67AmJIcnJvKGN4E5nBjtxg7Q+FRP2b//2Q==';

const HealersSection = () => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 space-y-20">
        <div className="flex flex-col md:flex-row justify-between items-end gap-8">
          <div className="max-w-2xl space-y-4">
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#C79A3B]">The Visionaries</h2>
            <h3 className="text-4xl md:text-6xl font-serif font-bold text-slate-900 leading-tight">
              Guided by Lineage <br />
              &amp; Clinical Science
            </h3>
          </div>
          <Button asChild variant="outline" className="h-12 px-8 rounded-xl border-slate-200 font-bold">
            <Link href="/about">Our Full Story <ArrowRight className="ml-2 w-4 h-4" /></Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="group cursor-pointer">
            <div className="aspect-[4/5] rounded-[60px] overflow-hidden mb-8 relative">
              <Image
                src={SEJAL_IMAGE}
                alt="Sejal Jain — Somatic Healer & Nervous System Practitioner"
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                placeholder="blur"
                blurDataURL={BLUR_DATA_URL}
                className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
              />
              <div className="absolute bottom-8 left-8 right-8 p-8 bg-white/80 backdrop-blur-xl rounded-[40px] border border-white/20 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                <div className="flex items-center gap-2 text-blue-600 mb-2">
                  <Heart className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Somatic Healing • Trauma Release</span>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  &ldquo;The body holds the score. Healing is somatic first, cognitive second.&rdquo;
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="text-3xl font-serif font-bold text-slate-900">Sejal Jain</h4>
              <p className="text-amber-600 font-bold uppercase tracking-widest text-xs">Somatic Healer • Nervous System Practitioner • Mumbai</p>
            </div>
          </div>

          <div className="group cursor-pointer lg:pt-24">
            <div className="aspect-[4/5] rounded-[60px] overflow-hidden mb-8 relative">
              <Image
                src={ARCHANA_IMAGE}
                alt="Archana Jain — Vedic Astrologer & Vastu Expert"
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                placeholder="blur"
                blurDataURL={BLUR_DATA_URL}
                className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
              />
              <div className="absolute bottom-8 left-8 right-8 p-8 bg-white/80 backdrop-blur-xl rounded-[40px] border border-white/20 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                <div className="flex items-center gap-2 text-amber-600 mb-2">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Vedic Astrology • Vastu Shastra</span>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  &ldquo;The planets don&apos;t lie. Your chart carries your karmic blueprint.&rdquo;
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="text-3xl font-serif font-bold text-slate-900">Archana Jain</h4>
              <p className="text-amber-600 font-bold uppercase tracking-widest text-xs">Vedic Astrologer • Vastu Expert • Jaipur</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HealersSection;
