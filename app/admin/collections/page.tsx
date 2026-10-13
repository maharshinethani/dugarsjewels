'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Collection } from '@/lib/types';
import { Plus, Trash2, Edit } from 'lucide-react';
import { toast } from 'sonner';
import { GalleryImagePicker } from '@/components/gallery-image-picker';

export default function AdminCollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Collection | null>(null);
  const [form, setForm] = useState({ 
    name_en: '', 
    name_ar: '', 
    slug: '', 
    description_en: '', 
    description_ar: '', 
    hero_image_url: '', 
    story_en: '', 
    story_ar: '', 
    display_order: '0', 
    is_published: true 
  });

  useEffect(() => { fetchCollections(); }, []);

  async function fetchCollections() {
    setLoading(true);
    const { data } = await supabase.from('collections').select('*').order('display_order', { ascending: true });
    setCollections((data as Collection[]) || []);
    setLoading(false);
  }

  function startEdit(col: Collection) {
    setEditing(col);
    setForm({ 
      name_en: col.name_en, 
      name_ar: col.name_ar || '', 
      slug: col.slug, 
      description_en: col.description_en || '', 
      description_ar: col.description_ar || '', 
      hero_image_url: col.hero_image_url || '', 
      story_en: col.story_en || '', 
      story_ar: col.story_ar || '', 
      display_order: String(col.display_order), 
      is_published: col.is_published 
    });
    setShowForm(true);
  }

  function startNew() {
    setEditing(null);
    setForm({ 
      name_en: '', 
      name_ar: '', 
      slug: '', 
      description_en: '', 
      description_ar: '', 
      hero_image_url: '', 
      story_en: '', 
      story_ar: '', 
      display_order: '0', 
      is_published: true 
    });
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name_en || !form.slug) { toast.error('Name and slug required'); return; }
    try {
      const payload = {
        name_en: form.name_en, 
        name_ar: form.name_ar || null, 
        slug: form.slug,
        description_en: form.description_en || null, 
        description_ar: form.description_ar || null,
        hero_image_url: form.hero_image_url || null, 
        story_en: form.story_en || null, 
        story_ar: form.story_ar || null,
        display_order: parseInt(form.display_order) || 0, 
        is_published: form.is_published,
      };
      if (editing) {
        const { error } = await supabase.from('collections').update(payload).eq('id', editing.id);
        if (error) throw error;
        toast.success('Collection updated');
      } else {
        const { error } = await supabase.from('collections').insert(payload);
        if (error) throw error;
        toast.success('Collection created');
      }
      setShowForm(false);
      fetchCollections();
    } catch (err: any) {
      toast.error(err.message || 'Failed');
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this collection?')) return;
    const { error } = await supabase.from('collections').delete().eq('id', id);
    if (error) { toast.error('Failed'); return; }
    toast.success('Deleted');
    fetchCollections();
  }

  // -------------------------------------------------------------
  // FULL PAGE STACKED CARD FORM LAYOUT (LEFT ALIGNED & HIGHLIGHTED BORDERS)
  // -------------------------------------------------------------
  if (showForm) {
    return (
      <div className="w-full text-left space-y-6 pb-12">
        {/* Page Title */}
        <div className="flex items-center gap-3 pb-3 border-b border-gold/30">
         
          <h1 className="font-serif text-2xl text-heading">
            {editing ? 'Edit Collection' : 'Add Collection'}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="w-full space-y-6">
          
          {/* 1. BASIC SECTION */}
          <div className="w-full bg-card border-2 border-border/30 hover:border-gold/40 transition-colors p-6 space-y-4">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-gold mb-4 border-b border-border/20 pb-2">
              BASIC
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AF 
                label="NAME (ENGLISH) *" 
                value={form.name_en} 
                onChange={(v) => {
                  const generatedSlug = !editing && !form.slug ? v.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') : form.slug;
                  setForm({ ...form, name_en: v, slug: generatedSlug });
                }} 
              />
              <AF 
                label="NAME (ARABIC)" 
                value={form.name_ar} 
                onChange={(v) => setForm({ ...form, name_ar: v })} 
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AF 
                label="SLUG *" 
                value={form.slug} 
                onChange={(v) => setForm({ ...form, slug: v })} 
              />
              <AF 
                label="DISPLAY ORDER" 
                value={form.display_order} 
                onChange={(v) => setForm({ ...form, display_order: v })} 
                type="number" 
              />
            </div>
          </div>

          {/* 2. DESCRIPTION SECTION */}
          <div className="w-full bg-card border-2 border-border/30 hover:border-gold/40 transition-colors p-6 space-y-4">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-gold mb-4 border-b border-border/20 pb-2">
              DESCRIPTION
            </h2>
            <AF 
              label="DESCRIPTION (ENGLISH)" 
              value={form.description_en} 
              onChange={(v) => setForm({ ...form, description_en: v })} 
              textarea 
              rows={3}
            />
            <AF 
              label="DESCRIPTION (ARABIC)" 
              value={form.description_ar} 
              onChange={(v) => setForm({ ...form, description_ar: v })} 
              textarea 
              rows={3}
            />
          </div>

          {/* 3. STORY SECTION */}
          <div className="w-full bg-card border-2 border-border/30 hover:border-gold/40 transition-colors p-6 space-y-4">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-gold mb-4 border-b border-border/20 pb-2">
              COLLECTION STORY
            </h2>
            <AF 
              label="STORY (ENGLISH)" 
              value={form.story_en} 
              onChange={(v) => setForm({ ...form, story_en: v })} 
              textarea 
              rows={3}
            />
            <AF 
              label="STORY (ARABIC)" 
              value={form.story_ar} 
              onChange={(v) => setForm({ ...form, story_ar: v })} 
              textarea 
              rows={3}
            />
          </div>

          {/* 4. MEDIA SECTION */}
          <div className="w-full bg-card border-2 border-border/30 hover:border-gold/40 transition-colors p-6 space-y-4">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-gold mb-4 border-b border-border/20 pb-2">
              COLLECTION MEDIA
            </h2>
            <div className="max-w-2xl">
              <GalleryImagePicker 
                label="Hero Image" 
                value={form.hero_image_url} 
                onChange={(v) => setForm({ ...form, hero_image_url: v || '' })} 
                category="collections" 
              />
            </div>
          </div>

          {/* 5. STATUS SECTION */}
          <div className="w-full bg-card border-2 border-border/30 hover:border-gold/40 transition-colors p-6 space-y-4">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-gold mb-4 border-b border-border/20 pb-2">
              STATUS
            </h2>
            <div className="max-w-xs">
              <label className="text-[10px] font-semibold uppercase tracking-wider text-secondary-text/80 mb-1.5 block">
                PUBLISH STATUS
              </label>
              <select 
                value={form.is_published ? 'published' : 'draft'} 
                onChange={(e) => setForm({ ...form, is_published: e.target.value === 'published' })}
                className="w-full border-2 border-border/30 px-3 py-2 text-xs outline-none focus:border-gold bg-transparent text-heading transition-colors"
              >
                <option value="published" className="bg-card">Published</option>
                <option value="draft" className="bg-card">Draft</option>
              </select>
            </div>
          </div>

          {/* ACTIONS BUTTONS */}
          <div className="flex gap-4 pt-2">
            <button 
              type="submit" 
              className="bg-gold border-2 border-gold px-8 py-3 text-xs font-medium uppercase tracking-wider text-soft-black hover:bg-gold-light hover:border-gold-light transition-colors"
            >
              {editing ? 'SAVE COLLECTION' : 'CREATE COLLECTION'}
            </button>
            <button 
              type="button" 
              onClick={() => setShowForm(false)} 
              className="border-2 border-border/40 px-8 py-3 text-xs font-medium uppercase tracking-wider text-secondary-text hover:bg-muted hover:border-border/60 transition-colors"
            >
              CANCEL
            </button>
          </div>

        </form>
      </div>
    );
  }

  // -------------------------------------------------------------
  // FULL PAGE COLLECTIONS LIST VIEW
  // -------------------------------------------------------------
  return (
    <div className="w-full text-left space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gold/30">
        <div>
          <h1 className="font-serif text-2xl text-heading">Collections</h1>
          <p className="text-xs text-secondary-text/70 mt-1">Manage store collections and featured stories</p>
        </div>
        <button 
          onClick={startNew} 
          className="flex items-center gap-2 bg-gold px-4 py-2.5 text-xs font-medium uppercase tracking-wider text-white hover:bg-gold-light transition-colors"
        >
          <Plus className="h-4 w-4" /> Add Collection
        </button>
      </div>

      {/* Grid List */}
      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 animate-pulse bg-muted border-2 border-border/20" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {collections.map((col) => (
            <div 
              key={col.id} 
              className="group border-2 border-border/20 hover:border-gold/60 bg-card p-4 transition-all flex gap-4"
            >
              <div className="h-20 w-28 flex-shrink-0 overflow-hidden bg-muted border border-border/20">
                {col.hero_image_url ? (
                  <img src={col.hero_image_url} alt="" className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs text-secondary-text/50">No Image</div>
                )}
              </div>
              <div className="flex flex-1 flex-col">
                <h3 className="text-sm font-medium text-heading">{col.name_en}</h3>
                <p className="text-xs text-secondary-text/70">{col.slug}</p>
                <p className="mt-1 text-xs text-secondary-text/70 line-clamp-1">{col.description_en}</p>
                <div className="mt-auto flex items-center justify-between pt-2">
                  <span className="text-[10px] uppercase tracking-wider text-secondary-text/60">
                    Order: {col.display_order}
                  </span>
                  <div className="flex gap-1">
                    <button 
                      onClick={() => startEdit(col)} 
                      className="flex h-7 w-7 items-center justify-center border-2 border-border/20 text-secondary-text/70 hover:border-gold hover:text-gold transition-colors"
                      title="Edit"
                    >
                      <Edit className="h-3 w-3" />
                    </button>
                    <button 
                      onClick={() => handleDelete(col.id)} 
                      className="flex h-7 w-7 items-center justify-center border-2 border-border/20 text-secondary-text/70 hover:border-red-300 hover:text-red-500 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AF({ 
  label, 
  value, 
  onChange, 
  type = 'text', 
  textarea,
  rows = 2
}: { 
  label: string; 
  value: string; 
  onChange: (v: string) => void; 
  type?: string; 
  textarea?: boolean;
  rows?: number;
}) {
  return (
    <div className="w-full text-left">
      <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-secondary-text/80">
        {label}
      </label>
      {textarea ? (
        <textarea 
          rows={rows} 
          value={value} 
          onChange={(e) => onChange(e.target.value)} 
          className="w-full border-2 border-border/30 px-3 py-2 text-xs outline-none focus:border-gold bg-transparent text-heading transition-colors" 
        />
      ) : (
        <input 
          type={type} 
          value={value} 
          onChange={(e) => onChange(e.target.value)} 
          className="w-full border-2 border-border/30 px-3 py-2 text-xs outline-none focus:border-gold bg-transparent text-heading transition-colors" 
        />
      )}
    </div>
  );
}