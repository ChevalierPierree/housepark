'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Trash2, Plus, X, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { slugify } from '@/lib/utils';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import type { Villa, Extra } from '@/lib/types';

interface VillaFormProps {
  villa?: Villa;
  allExtras: Extra[];
  villaExtraIds?: string[];
}

export default function VillaForm({ villa, allExtras, villaExtraIds = [] }: VillaFormProps) {
  const router = useRouter();
  const isNew = !villa;

  const [title, setTitle] = useState(villa?.title || '');
  const [slug, setSlug] = useState(villa?.slug || '');
  const [locationLabel, setLocationLabel] = useState(villa?.location_label || '');
  const [description, setDescription] = useState(villa?.description || '');
  const [capacityMin, setCapacityMin] = useState(villa?.capacity_min?.toString() || '10');
  const [capacityMax, setCapacityMax] = useState(villa?.capacity_max?.toString() || '45');
  const [priceType, setPriceType] = useState(villa?.price_type || 'per_night');
  const [priceAmount, setPriceAmount] = useState(villa?.price_amount?.toString() || '');
  const [activities, setActivities] = useState<string[]>(villa?.activities || []);
  const [equipments, setEquipments] = useState<string[]>(villa?.equipments || []);
  const [published, setPublished] = useState(villa?.published || false);
  const [selectedExtras, setSelectedExtras] = useState<string[]>(villaExtraIds);

  const [newActivity, setNewActivity] = useState('');
  const [newEquipment, setNewEquipment] = useState('');
  const [photoUrls, setPhotoUrls] = useState<string[]>(
    villa?.photos?.sort((a, b) => a.sort_order - b.sort_order).map((p) => p.url) || []
  );
  const [newPhotoUrl, setNewPhotoUrl] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (isNew) setSlug(slugify(val));
  };

  const addActivity = () => {
    if (newActivity.trim() && !activities.includes(newActivity.trim())) {
      setActivities([...activities, newActivity.trim()]);
      setNewActivity('');
    }
  };

  const addEquipment = () => {
    if (newEquipment.trim() && !equipments.includes(newEquipment.trim())) {
      setEquipments([...equipments, newEquipment.trim()]);
      setNewEquipment('');
    }
  };

  const addPhoto = () => {
    if (newPhotoUrl.trim()) {
      setPhotoUrls([...photoUrls, newPhotoUrl.trim()]);
      setNewPhotoUrl('');
    }
  };

  const handleSave = async () => {
    setError('');
    if (!title || !slug || !priceAmount) {
      setError('Titre, slug et prix sont obligatoires.');
      return;
    }

    setLoading(true);
    const supabase = createClient();

    const villaData = {
      title,
      slug,
      location_label: locationLabel,
      description,
      capacity_min: parseInt(capacityMin) || 10,
      capacity_max: parseInt(capacityMax) || 45,
      price_type: priceType,
      price_amount: parseFloat(priceAmount) || 0,
      activities,
      equipments,
      published,
    };

    let villaId = villa?.id;

    if (isNew) {
      const { data, error: insertErr } = await supabase
        .from('villas')
        .insert(villaData)
        .select('id')
        .single();

      if (insertErr) {
        setError(insertErr.message);
        setLoading(false);
        return;
      }
      villaId = data.id;
    } else {
      const { error: updateErr } = await supabase
        .from('villas')
        .update({ ...villaData, updated_at: new Date().toISOString() })
        .eq('id', villa.id);

      if (updateErr) {
        setError(updateErr.message);
        setLoading(false);
        return;
      }
    }

    // Manage photos
    if (villaId) {
      // Delete old photos
      await supabase.from('villa_photos').delete().eq('villa_id', villaId);

      // Insert new photos
      if (photoUrls.length > 0) {
        await supabase.from('villa_photos').insert(
          photoUrls.map((url, i) => ({
            villa_id: villaId,
            url,
            alt: title,
            sort_order: i,
          }))
        );
      }

      // Manage extras
      await supabase.from('villa_extras').delete().eq('villa_id', villaId);
      if (selectedExtras.length > 0) {
        await supabase.from('villa_extras').insert(
          selectedExtras.map((extraId) => ({
            villa_id: villaId,
            extra_id: extraId,
          }))
        );
      }
    }

    setLoading(false);
    router.push('/admin/villas');
    router.refresh();
  };

  const handleDelete = async () => {
    if (!villa || !confirm('Supprimer cette villa ?')) return;
    const supabase = createClient();
    await supabase.from('villas').delete().eq('id', villa.id);
    router.push('/admin/villas');
    router.refresh();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/villas"
            className="text-gray-400 hover:text-dark transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-bold text-dark">
            {isNew ? 'Nouvelle villa' : 'Modifier la villa'}
          </h1>
        </div>
        {!isNew && (
          <button
            onClick={handleDelete}
            className="text-red-500 hover:text-red-600 text-sm flex items-center gap-1"
          >
            <Trash2 className="h-4 w-4" />
            Supprimer
          </button>
        )}
      </div>

      <div className="space-y-6">
        {/* Basic info */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
          <h2 className="font-semibold text-dark">Informations générales</h2>

          <Input
            id="title"
            label="Titre"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Villa Sunset – Côte d'Azur"
          />

          <Input
            id="slug"
            label="Slug (URL)"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="villa-sunset-cote-azur"
          />

          <Input
            id="location"
            label="Localisation"
            value={locationLabel}
            onChange={(e) => setLocationLabel(e.target.value)}
            placeholder="Cannes, Côte d'Azur"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              placeholder="Décrivez la villa..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              id="capacityMin"
              label="Capacité min"
              type="number"
              value={capacityMin}
              onChange={(e) => setCapacityMin(e.target.value)}
            />
            <Input
              id="capacityMax"
              label="Capacité max"
              type="number"
              value={capacityMax}
              onChange={(e) => setCapacityMax(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type de prix
              </label>
              <select
                value={priceType}
                onChange={(e) => setPriceType(e.target.value as 'per_night' | 'per_stay')}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm bg-white"
              >
                <option value="per_night">Par nuit</option>
                <option value="per_stay">Par séjour</option>
              </select>
            </div>
            <Input
              id="priceAmount"
              label="Prix (€)"
              type="number"
              value={priceAmount}
              onChange={(e) => setPriceAmount(e.target.value)}
              placeholder="2500"
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="published"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="w-4 h-4 text-primary rounded"
            />
            <label htmlFor="published" className="text-sm font-medium text-gray-700">
              Publiée (visible sur le site)
            </label>
          </div>
        </div>

        {/* Photos */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
          <h2 className="font-semibold text-dark">Photos</h2>
          <div className="space-y-2">
            {photoUrls.map((url, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-xs text-gray-400 w-6">{i + 1}</span>
                <input
                  value={url}
                  onChange={(e) => {
                    const updated = [...photoUrls];
                    updated[i] = e.target.value;
                    setPhotoUrls(updated);
                  }}
                  className="flex-1 px-3 py-1.5 border border-gray-200 rounded text-sm"
                />
                <button
                  onClick={() => setPhotoUrls(photoUrls.filter((_, j) => j !== i))}
                  className="text-gray-400 hover:text-red-500"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              value={newPhotoUrl}
              onChange={(e) => setNewPhotoUrl(e.target.value)}
              placeholder="URL de la photo"
              className="flex-1 px-3 py-1.5 border border-gray-200 rounded text-sm"
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addPhoto())}
            />
            <button
              onClick={addPhoto}
              className="px-3 py-1.5 bg-gray-100 rounded text-sm hover:bg-gray-200"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Activities */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
          <h2 className="font-semibold text-dark">Activités</h2>
          <div className="flex flex-wrap gap-2">
            {activities.map((a) => (
              <span
                key={a}
                className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary text-sm rounded-full"
              >
                {a}
                <button onClick={() => setActivities(activities.filter((x) => x !== a))}>
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              value={newActivity}
              onChange={(e) => setNewActivity(e.target.value)}
              placeholder="Ajouter une activité"
              className="flex-1 px-3 py-1.5 border border-gray-200 rounded text-sm"
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addActivity())}
            />
            <button
              onClick={addActivity}
              className="px-3 py-1.5 bg-gray-100 rounded text-sm hover:bg-gray-200"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Equipments */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
          <h2 className="font-semibold text-dark">Équipements</h2>
          <div className="flex flex-wrap gap-2">
            {equipments.map((eq) => (
              <span
                key={eq}
                className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full"
              >
                {eq}
                <button onClick={() => setEquipments(equipments.filter((x) => x !== eq))}>
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              value={newEquipment}
              onChange={(e) => setNewEquipment(e.target.value)}
              placeholder="Ajouter un équipement"
              className="flex-1 px-3 py-1.5 border border-gray-200 rounded text-sm"
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addEquipment())}
            />
            <button
              onClick={addEquipment}
              className="px-3 py-1.5 bg-gray-100 rounded text-sm hover:bg-gray-200"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Extras */}
        {allExtras.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
            <h2 className="font-semibold text-dark">Extras disponibles</h2>
            <div className="space-y-2">
              {allExtras.map((extra) => (
                <label
                  key={extra.id}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedExtras.includes(extra.id)}
                    onChange={() =>
                      setSelectedExtras((prev) =>
                        prev.includes(extra.id)
                          ? prev.filter((id) => id !== extra.id)
                          : [...prev, extra.id]
                      )
                    }
                    className="w-4 h-4 text-primary rounded"
                  />
                  <span className="text-sm text-dark">{extra.name}</span>
                  <span className="text-xs text-gray-400 ml-auto">
                    {extra.price_amount}€
                    {extra.pricing_type === 'per_person' ? '/pers.' : ' fixe'}
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Error & Save */}
        {error && (
          <div className="flex items-center gap-2 text-red-500 text-sm">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        )}

        <div className="flex gap-4">
          <Button onClick={handleSave} disabled={loading} size="lg">
            <Save className="h-4 w-4 mr-2" />
            {loading ? 'Enregistrement...' : 'Enregistrer'}
          </Button>
          <Link href="/admin/villas">
            <Button variant="outline" size="lg">
              Annuler
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
